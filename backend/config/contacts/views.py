import hashlib
import html
import json
import logging
import mimetypes
import re
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import FileResponse, JsonResponse
from django.utils.html import escape
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import ContactRequest

logger = logging.getLogger(__name__)
INSTAGRAM_RE = re.compile(r"^@?([A-Za-z0-9._]{1,30})$")
COUNTRIES = {"UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"}
SITE_ROOT = Path(settings.SITE_ROOT).resolve()
PUBLIC_SUFFIXES = {".html", ".css", ".js", ".mjs", ".map", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".webm", ".json"}

def health(request):
    return JsonResponse({"ok": True, "service": "BDIX AI contact API"})

def serve_site(request, asset_path):
    # Serve only public website assets. Never expose backend source, env files,
    # databases, archives, Markdown handoff, or hidden files.
    parts = Path(asset_path).parts
    if not parts or any(part.startswith(".") for part in parts) or parts[0].lower() in {"backend", "node_modules", "__pycache__"}:
        return JsonResponse({"detail": "Not found."}, status=404)
    target = (SITE_ROOT / asset_path).resolve()
    if SITE_ROOT not in target.parents or not target.is_file() or target.suffix.lower() not in PUBLIC_SUFFIXES:
        return JsonResponse({"detail": "Not found."}, status=404)
    content_type, _ = mimetypes.guess_type(str(target))
    response = FileResponse(target.open("rb"), content_type=content_type or "application/octet-stream")
    response["X-Content-Type-Options"] = "nosniff"
    return response

def _clean(data, key, maximum, required=True):
    value = data.get(key, "")
    if not isinstance(value, str):
        raise ValueError(key)
    value = value.strip()
    if required and not value:
        raise ValueError(key)
    if len(value) > maximum:
        raise ValueError(key)
    return value

def _notify_admin(contact):
    if not (settings.RESEND_API_KEY and settings.DEFAULT_FROM_EMAIL and settings.ADMIN_NOTIFICATION_EMAIL):
        logger.warning("Contact request %s saved, but email notification is not configured.", contact.pk)
        return False
    name = escape(contact.full_name)
    email = escape(contact.email)
    country = escape(contact.country)
    business = escape(contact.business)
    challenge = escape(contact.challenge)
    phone = escape(contact.phone or "—")
    whatsapp = escape(contact.whatsapp or "—")
    instagram = escape(contact.instagram_url)
    text = (
        f"New contact request\nName: {contact.full_name}\nEmail: {contact.email}\n"
        f"Country: {contact.country}\nBusiness: {contact.business}\n"
        f"Phone: {contact.phone or '—'}\nWhatsApp: {contact.whatsapp or '—'}\n"
        f"Instagram: {contact.instagram_url}\nChallenge: {contact.challenge}\n"
        f"Received: {contact.created_at.isoformat()}"
    )
    body = f"""<h2>New BDIX AI contact request</h2>
<p><b>Name:</b> {name}<br><b>Email:</b> {email}<br><b>Country:</b> {country}<br>
<b>Business:</b> {business}<br><b>Phone:</b> {phone}<br><b>WhatsApp:</b> {whatsapp}<br>
<b>Instagram:</b> <a href="{instagram}">{instagram}</a><br>
<b>Challenge:</b> {challenge}<br><b>Received:</b> {escape(contact.created_at.isoformat())}</p>"""
    payload = json.dumps({
        "from": settings.DEFAULT_FROM_EMAIL,
        "to": [settings.ADMIN_NOTIFICATION_EMAIL],
        "subject": "New BDIX AI contact request",
        "html": body,
        "text": text,
    }).encode("utf-8")
    request = Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=12) as response:
            return 200 <= response.status < 300
    except (HTTPError, URLError, TimeoutError, OSError):
        logger.exception("Email notification failed for contact request %s.", contact.pk)
        return False

@csrf_exempt
@require_http_methods(["POST"])
def create_contact_request(request):
    origin = request.headers.get("Origin", "").rstrip("/")
    allowed = set(settings.FORM_ALLOWED_ORIGINS)
    current_origin = request.build_absolute_uri("/").rstrip("/")
    if origin and origin not in allowed and origin != current_origin:
        return JsonResponse({"ok": False, "error": "origin_not_allowed"}, status=403)
    if request.content_type != "application/json":
        return JsonResponse({"ok": False, "error": "json_required"}, status=415)
    if len(request.body) > 65536:
        return JsonResponse({"ok": False, "error": "request_too_large"}, status=413)
    try:
        data = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return JsonResponse({"ok": False, "error": "invalid_json"}, status=400)
    if not isinstance(data, dict):
        return JsonResponse({"ok": False, "error": "invalid_payload"}, status=400)
    # Quietly accept but discard submissions caught by the invisible honeypot.
    if str(data.get("website", "")).strip():
        return JsonResponse({"ok": True}, status=201)
    remote = request.META.get("REMOTE_ADDR", "unknown")
    key = "contact-rate:" + hashlib.sha256(remote.encode("utf-8")).hexdigest()
    if not cache.add(key, 1, timeout=600):
        try:
            count = cache.incr(key)
        except ValueError:
            cache.set(key, 1, timeout=600)
            count = 1
    else:
        count = 1
    if count > 8:
        return JsonResponse({"ok": False, "error": "rate_limited"}, status=429)
    try:
        full_name = _clean(data, "fullName", 100)
        email = _clean(data, "email", 120)
        validate_email(email)
        country = _clean(data, "country", 80)
        if country not in COUNTRIES:
            raise ValueError("country")
        business = _clean(data, "business", 80)
        challenge = _clean(data, "challenge", 500)
        phone = _clean(data, "phone", 30, required=False)
        whatsapp = _clean(data, "whatsapp", 30, required=False)
        handle = _clean(data, "instagram", 31)
        match = INSTAGRAM_RE.fullmatch(handle)
        if not match:
            raise ValueError("instagram")
    except (ValueError, ValidationError):
        return JsonResponse({"ok": False, "error": "invalid_fields"}, status=400)
    username = match.group(1)
    contact = ContactRequest.objects.create(
        full_name=full_name, email=email, country=country, business=business,
        challenge=challenge, phone=phone, whatsapp=whatsapp,
        instagram_url=f"https://www.instagram.com/{username}/",
    )
    _notify_admin(contact)
    return JsonResponse({"ok": True, "id": contact.pk}, status=201)

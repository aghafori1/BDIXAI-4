import json
from django.test import TestCase, override_settings
from .models import ContactRequest

@override_settings(FORM_ALLOWED_ORIGINS=["http://testserver"])
class ContactApiTests(TestCase):
    def payload(self, instagram="@bdixai"):
        return {
            "fullName": "Test Person", "email": "test@example.com", "country": "UAE",
            "business": "Consulting", "challenge": "Need a website",
            "phone": "", "whatsapp": "", "instagram": instagram, "website": "",
        }

    def test_valid_request_saves_canonical_instagram_url(self):
        response = self.client.post("/api/contact/", data=json.dumps(self.payload()), content_type="application/json")
        self.assertEqual(response.status_code, 201)
        row = ContactRequest.objects.get()
        self.assertEqual(row.instagram_url, "https://www.instagram.com/bdixai/")

    def test_full_instagram_url_is_rejected(self):
        response = self.client.post("/api/contact/", data=json.dumps(self.payload("https://www.instagram.com/bdixai/")), content_type="application/json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ContactRequest.objects.count(), 0)

    def test_missing_required_instagram_is_rejected(self):
        response = self.client.post("/api/contact/", data=json.dumps(self.payload("")), content_type="application/json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ContactRequest.objects.count(), 0)

import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = "Create the initial admin account if configured; never changes an existing password."

    def handle(self, *args, **options):
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "").strip()
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "").strip()
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "")
        if not (username and email and password):
            self.stdout.write("Admin bootstrap skipped: set all DJANGO_SUPERUSER_* variables.")
            return
        User = get_user_model()
        if User.objects.filter(username=username).exists():
            self.stdout.write(f"Admin '{username}' already exists; left unchanged.")
            return
        try:
            User.objects.create_superuser(username=username, email=email, password=password)
        except Exception as exc:
            raise CommandError("Could not create the initial admin account; check configured values.") from exc
        self.stdout.write(self.style.SUCCESS(f"Created initial admin account '{username}'. Remove its password env var after deploy."))

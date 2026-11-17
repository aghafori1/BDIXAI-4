# Initial contact-request schema created in the user's existing project.
from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="ContactRequest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(max_length=100)),
                ("email", models.EmailField(max_length=120)),
                ("country", models.CharField(max_length=80)),
                ("business", models.CharField(max_length=80)),
                ("challenge", models.CharField(max_length=500)),
                ("phone", models.CharField(blank=True, max_length=30)),
                ("whatsapp", models.CharField(blank=True, max_length=30)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]

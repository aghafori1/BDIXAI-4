from django.db import models

class ContactRequest(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=120)
    country = models.CharField(max_length=80)
    business = models.CharField(max_length=80)
    challenge = models.CharField(max_length=500)
    phone = models.CharField(max_length=30, blank=True)
    whatsapp = models.CharField(max_length=30, blank=True)
    instagram_url = models.URLField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} <{self.email}>"

from django.contrib import admin
from .models import ContactRequest

@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "country", "business", "instagram_url", "created_at")
    list_filter = ("country", "created_at")
    search_fields = ("full_name", "email", "country", "business", "instagram_url")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

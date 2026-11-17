from django.contrib import admin
from django.urls import path
from contacts import views as contact_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", contact_views.health, name="health"),
    path("api/contact/", contact_views.create_contact_request, name="create-contact"),
    path("", contact_views.serve_site, {"asset_path": "index.html"}, name="home"),
    path("<path:asset_path>", contact_views.serve_site, name="site-asset"),
]

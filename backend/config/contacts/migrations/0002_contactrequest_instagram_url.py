# Add the mandatory Instagram profile URL; existing rows get an empty legacy value.
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [("contacts", "0001_initial")]
    operations = [
        migrations.AddField(
            model_name="contactrequest",
            name="instagram_url",
            field=models.URLField(default="", max_length=255),
            preserve_default=False,
        ),
    ]

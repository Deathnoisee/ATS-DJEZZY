from django.db import models
import uuid
# Create your models here.
class ExtractionLog(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4)
    source_type = models.CharField(max_length=50)
    source_uuid = models.UUIDField()
    raw_text = models.TextField()
    extracted_data = models.JSONField(null=True)
    status = models.CharField(max_length=20, default='pending')
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
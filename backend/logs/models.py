from django.db import models
import uuid
# Create your models here.
class user_logs (models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey('Authentication.Users', on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255, null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
class jobs_logs (models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    job = models.ForeignKey('HR.job_Data', on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255, null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
class applications_logs (models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    application = models.ForeignKey('candidates.application', on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255, null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
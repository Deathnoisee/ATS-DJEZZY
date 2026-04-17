from django.db import models
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.
class application(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey('Authentication.Users', on_delete=models.CASCADE)
    job = models.ForeignKey('HR.job_Data', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default='pending', null=False, blank=False, choices=[('pending', 'Pending'), ('done', 'Done')])
    macro_score = models.FloatField(null=True, blank=True)
    micro_score = models.FloatField(null=True, blank=True)
    final_score = models.FloatField(null=True, blank=True)
    matchedAt = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'job'], name='unique_application')
        ]
class candidate_skills(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey('Authentication.Users', on_delete=models.CASCADE)
    resume = models.ForeignKey('candidate_resume', on_delete=models.CASCADE)
    skill_name = models.CharField(max_length=255, null=False, blank=False)
    experience = models.IntegerField(validators=[MinValueValidator(0)], null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

class candidate_resume(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey('Authentication.Users', on_delete=models.CASCADE, unique=True)
    resume_file = models.FileField(upload_to='resumes/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
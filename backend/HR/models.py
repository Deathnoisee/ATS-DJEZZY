from django.db import models
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.
class job_Data(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=255, null=False, blank=False)
    jobs_requirement_raw = models.TextField(null=False, blank=False)
    using_priority = models.BooleanField(default=False)
    macro_micro_blend = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)], default=0.5, null=False, blank=False)
    job_description = models.TextField(null=False, blank=False)
    isOpen = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

class job_requirements(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    job = models.ForeignKey(job_Data, on_delete=models.CASCADE)
    skill = models.CharField(max_length=255, null=False, blank=False)
    experience = models.IntegerField(validators=[MinValueValidator(0)], null=False, blank=False)
    weight = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(1.0)], null=False, blank=False)
    is_required = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

class job_minimum_requirements(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    job = models.ForeignKey(job_Data, on_delete=models.CASCADE)
    requirement = models.CharField(max_length=255, null=False, blank=False)
    experience = models.IntegerField(validators=[MinValueValidator(0)], null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
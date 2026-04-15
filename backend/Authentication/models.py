from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import uuid

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  
        user.save()
        return user

class Users(AbstractBaseUser):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    username = models.CharField(max_length=150,null=False ,unique=True, blank=False)
    last_name = models.CharField(max_length=150,null=False , blank=False)
    email = models.EmailField(unique=True, null=False, blank=False)
    isRH = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'last_name']

class Password_reset_tokens(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, null=False, blank=False)
    expiration_time = models.DateTimeField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

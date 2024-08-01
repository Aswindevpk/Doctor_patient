from django.db import models
import uuid
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from datetime import timedelta


class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES,default=None,blank=True,null=True)
    profile_pic = models.ImageField(upload_to='media/',blank=True,null=True)


class Address(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE, related_name='address')
    line1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.line1}, {self.city}, {self.state} - {self.pincode}"
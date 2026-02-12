from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model with additional fields"""
    
    USER_TYPE_CHOICES = [
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('admin', 'Admin'),
    ]
    
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='farmer')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        return self.username


class FarmerProfile(models.Model):
    """Extended profile for farmers"""
    
    SOIL_TYPES = [
        ('alluvial', 'Alluvial'),
        ('black', 'Black'),
        ('red', 'Red'),
        ('laterite', 'Laterite'),
        ('desert', 'Desert'),
        ('mountain', 'Mountain'),
    ]
    
    IRRIGATION_TYPES = [
        ('rainfed', 'Rainfed'),
        ('canal', 'Canal'),
        ('well', 'Well'),
        ('tubewell', 'Tubewell'),
        ('drip', 'Drip'),
        ('sprinkler', 'Sprinkler'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    farm_size = models.DecimalField(max_digits=10, decimal_places=2, help_text="Farm size in acres")
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    village = models.CharField(max_length=100, blank=True)
    soil_type = models.CharField(max_length=20, choices=SOIL_TYPES)
    irrigation_type = models.CharField(max_length=20, choices=IRRIGATION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.district}, {self.state}"
    
    class Meta:
        verbose_name = 'Farmer Profile'
        verbose_name_plural = 'Farmer Profiles'

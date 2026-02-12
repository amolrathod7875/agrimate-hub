from django.db import models
from users.models import User


class Crop(models.Model):
    """Crop master data"""
    
    SEASON_CHOICES = [
        ('kharif', 'Kharif'),
        ('rabi', 'Rabi'),
        ('zaid', 'Zaid'),
        ('all', 'All Season'),
    ]
    
    name = models.CharField(max_length=100)
    scientific_name = models.CharField(max_length=100, blank=True)
    season = models.CharField(max_length=10, choices=SEASON_CHOICES)
    duration_days = models.IntegerField(help_text="Crop duration in days")
    
    # Soil requirements
    suitable_soil_types = models.JSONField(default=list)
    ph_min = models.DecimalField(max_digits=3, decimal_places=1)
    ph_max = models.DecimalField(max_digits=3, decimal_places=1)
    
    # NPK requirements
    nitrogen_requirement = models.IntegerField(help_text="N requirement (kg/acre)")
    phosphorus_requirement = models.IntegerField(help_text="P requirement (kg/acre)")
    potassium_requirement = models.IntegerField(help_text="K requirement (kg/acre)")
    
    # Climate requirements
    temp_min = models.DecimalField(max_digits=5, decimal_places=2, help_text="Minimum temperature (°C)")
    temp_max = models.DecimalField(max_digits=5, decimal_places=2, help_text="Maximum temperature (°C)")
    rainfall_min = models.IntegerField(help_text="Minimum rainfall (mm)")
    rainfall_max = models.IntegerField(help_text="Maximum rainfall (mm)")
    
    # Additional info
    water_requirement = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='crops/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class CropRecommendation(models.Model):
    """Crop recommendations based on user inputs"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_recommendations')
    
    # Input parameters
    nitrogen = models.IntegerField()
    phosphorus = models.IntegerField()
    potassium = models.IntegerField()
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    humidity = models.DecimalField(max_digits=5, decimal_places=2)
    ph = models.DecimalField(max_digits=3, decimal_places=1)
    rainfall = models.DecimalField(max_digits=7, decimal_places=2)
    state = models.CharField(max_length=100)
    
    # Recommended crops
    recommended_crops = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Recommendation for {self.user.username} - {self.created_at.date()}"
    
    class Meta:
        ordering = ['-created_at']

from django.db import models
from users.models import User
from crops.models import Crop


class Disease(models.Model):
    """Plant disease master data"""
    
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    name = models.CharField(max_length=200)
    scientific_name = models.CharField(max_length=200, blank=True)
    affected_crops = models.ManyToManyField(Crop, related_name='diseases')
    
    description = models.TextField()
    symptoms = models.TextField()
    causes = models.TextField()
    prevention = models.TextField()
    treatment = models.TextField()
    
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    image = models.ImageField(upload_to='diseases/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class DiseasePrediction(models.Model):
    """Disease prediction records"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disease_predictions')
    crop = models.ForeignKey(Crop, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Input image
    plant_image = models.ImageField(upload_to='disease_predictions/')
    
    # Prediction results
    predicted_disease = models.ForeignKey(Disease, on_delete=models.SET_NULL, null=True, blank=True)
    confidence = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    additional_info = models.JSONField(default=dict, blank=True)
    
    # Status
    is_processed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Prediction by {self.user.username} - {self.created_at.date()}"
    
    class Meta:
        ordering = ['-created_at']

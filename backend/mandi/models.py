from django.db import models
from crops.models import Crop


class MandiPrice(models.Model):
    """Market (Mandi) prices for crops"""
    
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='mandi_prices')
    
    # Location
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    market = models.CharField(max_length=200)
    
    # Price details (per quintal)
    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2)
    modal_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Most common price")
    
    # Additional info
    variety = models.CharField(max_length=100, blank=True)
    arrival_quantity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Quantity in quintal")
    
    # Date
    price_date = models.DateField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.crop.name} - {self.market} - {self.price_date}"
    
    class Meta:
        ordering = ['-price_date']
        unique_together = ['crop', 'market', 'price_date', 'variety']


class PriceAlert(models.Model):
    """Price alerts for users"""
    
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='price_alerts')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    
    # Location preferences
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100, blank=True)
    
    # Alert threshold
    target_price = models.DecimalField(max_digits=10, decimal_places=2)
    alert_type = models.CharField(max_length=10, choices=[('above', 'Above'), ('below', 'Below')])
    
    # Status
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.crop.name} - {self.alert_type} {self.target_price}"
    
    class Meta:
        ordering = ['-created_at']

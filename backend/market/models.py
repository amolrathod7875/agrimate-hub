from django.db import models
from users.models import User
from crops.models import Crop


class ProductListing(models.Model):
    """Products listed by farmers for sale"""
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('expired', 'Expired'),
    ]
    
    UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('quintal', 'Quintal'),
        ('ton', 'Ton'),
        ('piece', 'Piece'),
    ]
    
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_listings')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='listings')
    
    # Product details
    title = models.CharField(max_length=200)
    description = models.TextField()
    variety = models.CharField(max_length=100, blank=True)
    
    # Pricing
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Location
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    address = models.TextField()
    
    # Images
    image1 = models.ImageField(upload_to='products/', blank=True, null=True)
    image2 = models.ImageField(upload_to='products/', blank=True, null=True)
    image3 = models.ImageField(upload_to='products/', blank=True, null=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    is_negotiable = models.BooleanField(default=True)
    
    # Timestamps
    available_from = models.DateField()
    available_until = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} by {self.seller.username}"
    
    class Meta:
        ordering = ['-created_at']


class ProductInquiry(models.Model):
    """Buyer inquiries for products"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('replied', 'Replied'),
        ('closed', 'Closed'),
    ]
    
    listing = models.ForeignKey(ProductListing, on_delete=models.CASCADE, related_name='inquiries')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_inquiries')
    
    message = models.TextField()
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    seller_reply = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Inquiry by {self.buyer.username} for {self.listing.title}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Product Inquiries'

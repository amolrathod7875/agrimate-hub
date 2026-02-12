from django.db import models


class GovernmentScheme(models.Model):
    """Government schemes for farmers"""
    
    CATEGORY_CHOICES = [
        ('subsidy', 'Subsidy'),
        ('loan', 'Loan'),
        ('insurance', 'Insurance'),
        ('training', 'Training'),
        ('equipment', 'Equipment'),
        ('other', 'Other'),
    ]
    
    LEVEL_CHOICES = [
        ('central', 'Central Government'),
        ('state', 'State Government'),
        ('district', 'District Level'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    
    description = models.TextField()
    eligibility = models.TextField()
    benefits = models.TextField()
    documents_required = models.TextField()
    application_process = models.TextField()
    
    # Location
    states = models.JSONField(default=list, help_text="List of applicable states")
    
    # URLs
    official_website = models.URLField(blank=True)
    application_link = models.URLField(blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Government Scheme'
        verbose_name_plural = 'Government Schemes'

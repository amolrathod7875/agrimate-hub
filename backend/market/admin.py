from django.contrib import admin
from .models import ProductListing, ProductInquiry


@admin.register(ProductListing)
class ProductListingAdmin(admin.ModelAdmin):
    list_display = ['title', 'seller', 'crop', 'quantity', 'unit', 'price_per_unit', 'status', 'created_at']
    list_filter = ['status', 'state', 'district', 'created_at']
    search_fields = ['title', 'seller__username', 'crop__name']
    date_hierarchy = 'created_at'


@admin.register(ProductInquiry)
class ProductInquiryAdmin(admin.ModelAdmin):
    list_display = ['listing', 'buyer', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['buyer__username', 'listing__title']

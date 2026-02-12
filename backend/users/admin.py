from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, FarmerProfile

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'user_type', 'is_staff']
    list_filter = ['user_type', 'is_staff', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('user_type', 'phone_number')}),
    )

@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'farm_size', 'state', 'district', 'created_at']
    list_filter = ['state', 'soil_type', 'irrigation_type']
    search_fields = ['user__username', 'district', 'village']

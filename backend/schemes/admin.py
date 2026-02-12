from django.contrib import admin
from .models import GovernmentScheme


@admin.register(GovernmentScheme)
class GovernmentSchemeAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'level', 'is_active', 'created_at']
    list_filter = ['category', 'level', 'is_active']
    search_fields = ['name', 'description']
    date_hierarchy = 'created_at'

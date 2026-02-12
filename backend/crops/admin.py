from django.contrib import admin
from .models import Crop, CropRecommendation


@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ['name', 'season', 'duration_days', 'water_requirement']
    list_filter = ['season', 'suitable_soil_types']
    search_fields = ['name', 'scientific_name']


@admin.register(CropRecommendation)
class CropRecommendationAdmin(admin.ModelAdmin):
    list_display = ['user', 'state', 'created_at']
    list_filter = ['state', 'created_at']
    search_fields = ['user__username']

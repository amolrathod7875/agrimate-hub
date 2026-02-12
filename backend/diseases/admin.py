from django.contrib import admin
from .models import Disease, DiseasePrediction


@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = ['name', 'severity', 'created_at']
    list_filter = ['severity', 'affected_crops']
    search_fields = ['name', 'scientific_name']
    filter_horizontal = ['affected_crops']


@admin.register(DiseasePrediction)
class DiseasePredictionAdmin(admin.ModelAdmin):
    list_display = ['user', 'crop', 'predicted_disease', 'confidence', 'is_processed', 'created_at']
    list_filter = ['is_processed', 'predicted_disease', 'created_at']
    search_fields = ['user__username']

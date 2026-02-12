from django.contrib import admin
from .models import MandiPrice, PriceAlert


@admin.register(MandiPrice)
class MandiPriceAdmin(admin.ModelAdmin):
    list_display = ['crop', 'market', 'district', 'state', 'modal_price', 'price_date']
    list_filter = ['state', 'district', 'price_date']
    search_fields = ['crop__name', 'market', 'district']
    date_hierarchy = 'price_date'


@admin.register(PriceAlert)
class PriceAlertAdmin(admin.ModelAdmin):
    list_display = ['user', 'crop', 'state', 'target_price', 'alert_type', 'is_active']
    list_filter = ['alert_type', 'is_active', 'state']
    search_fields = ['user__username', 'crop__name']

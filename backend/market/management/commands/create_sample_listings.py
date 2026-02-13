from django.core.management.base import BaseCommand
from django.utils import timezone

def ensure_str(s):
    return s if s is not None else ''


class Command(BaseCommand):
    help = 'Create sample ProductListing entries for testing nearby markets'

    def handle(self, *args, **options):
        from django.contrib.auth import get_user_model
        from crops.models import Crop
        from market.models import ProductListing

        User = get_user_model()

        # Create or get test farmer
        user, _ = User.objects.get_or_create(username='test_farmer', defaults={'email': 'farmer@example.com', 'user_type': 'farmer'})
        if not user.password:
            user.set_password('testpassword')
            user.save()

        # Create sample crops if not present
        wheat, _ = Crop.objects.get_or_create(name='Wheat', defaults={
            'season': 'rabi', 'duration_days': 120,
            'suitable_soil_types': [], 'ph_min': 6.0, 'ph_max': 8.0,
            'nitrogen_requirement': 50, 'phosphorus_requirement': 20, 'potassium_requirement': 20,
            'temp_min': 10.0, 'temp_max': 35.0, 'rainfall_min': 300, 'rainfall_max': 900,
            'water_requirement': 'Moderate', 'description': 'Sample wheat crop',
        })

        rice, _ = Crop.objects.get_or_create(name='Rice', defaults={
            'season': 'kharif', 'duration_days': 150,
            'suitable_soil_types': [], 'ph_min': 5.5, 'ph_max': 7.5,
            'nitrogen_requirement': 60, 'phosphorus_requirement': 25, 'potassium_requirement': 25,
            'temp_min': 20.0, 'temp_max': 38.0, 'rainfall_min': 800, 'rainfall_max': 2000,
            'water_requirement': 'High', 'description': 'Sample rice crop',
        })

        sample_markets = [
            ('Ahmedabad Mandi', 'Gujarat', 'Ahmedabad'),
            ('Vastrapur Market', 'Gujarat', 'Ahmedabad'),
            ('Maninagar Mandi', 'Gujarat', 'Ahmedabad'),
            ('Gandhinagar Market', 'Gujarat', 'Ahmedabad'),
            ('Asarwa Mandi', 'Gujarat', 'Ahmedabad'),
            # Maharashtra samples
            ('Pune Market Mandi', 'Maharashtra', 'Pune'),
            ('Dhanori Mandi', 'Maharashtra', 'Pune'),
            ('Beed Central Mandi', 'Maharashtra', 'Beed'),
            ('Ashti Mandi', 'Maharashtra', 'Beed'),
        ]

        created = 0
        for i, (market_name, state, district) in enumerate(sample_markets):
            title = f"{market_name} Listing {i+1}"
            listing, created_flag = ProductListing.objects.get_or_create(
                seller=user,
                title=title,
                defaults={
                    'crop': wheat if i % 2 == 0 else rice,
                    'description': f'Sample listing at {market_name}',
                    'variety': 'Local',
                    'quantity': 100.0 + i * 10,
                    'unit': 'kg',
                    'price_per_unit': 1500.00 + i * 10,
                    'state': state,
                    'district': district,
                    'address': f'{market_name}, {district}',
                    'status': 'available',
                    'is_negotiable': True,
                    'available_from': timezone.now().date(),
                }
            )
            if created_flag:
                created += 1

        self.stdout.write(self.style.SUCCESS(f'Created {created} sample listings'))

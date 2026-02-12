"""
Test Crop Recommendation Model
"""
from django.core.management.base import BaseCommand
from crops.recommendation import get_crop_recommendations


class Command(BaseCommand):
    help = 'Test the crop recommendation system'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('\n=== Testing Crop Recommendation System ===\n'))
        
        # Test case 1: Rice-suitable conditions
        self.stdout.write('Test 1: Rice-suitable conditions')
        test_data = {
            'nitrogen': 90,
            'phosphorus': 42,
            'potassium': 43,
            'temperature': 20.8,
            'humidity': 82.0,
            'ph': 6.5,
            'rainfall': 202.9
        }
        
        self.stdout.write(f'Input: N={test_data["nitrogen"]}, P={test_data["phosphorus"]}, K={test_data["potassium"]}')
        self.stdout.write(f'       Temp={test_data["temperature"]}°C, Humidity={test_data["humidity"]}%')
        self.stdout.write(f'       pH={test_data["ph"]}, Rainfall={test_data["rainfall"]}mm\n')
        
        try:
            recommendations = get_crop_recommendations(**test_data)
            
            if recommendations:
                self.stdout.write(self.style.SUCCESS(f'✓ Got {len(recommendations)} recommendations:\n'))
                for i, crop in enumerate(recommendations, 1):
                    self.stdout.write(
                        f'  {i}. {crop["crop_name"]} - '
                        f'Score: {crop["suitability_score"]:.2f}%'
                    )
            else:
                self.stdout.write(self.style.WARNING('⚠ No recommendations returned'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error: {e}'))
        
        # Test case 2: Wheat-suitable conditions
        self.stdout.write('\n\nTest 2: Wheat-suitable conditions')
        test_data2 = {
            'nitrogen': 80,
            'phosphorus': 60,
            'potassium': 60,
            'temperature': 15.0,
            'humidity': 70.0,
            'ph': 7.5,
            'rainfall': 100.0
        }
        
        self.stdout.write(f'Input: N={test_data2["nitrogen"]}, P={test_data2["phosphorus"]}, K={test_data2["potassium"]}')
        self.stdout.write(f'       Temp={test_data2["temperature"]}°C, Humidity={test_data2["humidity"]}%')
        self.stdout.write(f'       pH={test_data2["ph"]}, Rainfall={test_data2["rainfall"]}mm\n')
        
        try:
            recommendations = get_crop_recommendations(**test_data2)
            
            if recommendations:
                self.stdout.write(self.style.SUCCESS(f'✓ Got {len(recommendations)} recommendations:\n'))
                for i, crop in enumerate(recommendations, 1):
                    self.stdout.write(
                        f'  {i}. {crop["crop_name"]} - '
                        f'Score: {crop["suitability_score"]:.2f}%'
                    )
            else:
                self.stdout.write(self.style.WARNING('⚠ No recommendations returned'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error: {e}'))
        
        self.stdout.write(self.style.SUCCESS('\n\n=== Test Complete ===\n'))

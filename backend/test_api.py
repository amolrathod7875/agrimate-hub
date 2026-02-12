"""
Quick test script for ML-powered APIs
Run this to test both crop recommendation and disease prediction
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_crop_recommendation():
    """Test crop recommendation API"""
    print("\n" + "="*60)
    print("Testing Crop Recommendation API")
    print("="*60)
    
    url = f"{BASE_URL}/api/crops/recommendations/"
    
    # Test data (Rice-suitable conditions)
    data = {
        "nitrogen": 90,
        "phosphorus": 42,
        "potassium": 43,
        "temperature": 20.8,
        "humidity": 82.0,
        "ph": 6.5,
        "rainfall": 202.9,
        "state": "Punjab"
    }
    
    print("\nInput Parameters:")
    print(f"  N: {data['nitrogen']}, P: {data['phosphorus']}, K: {data['potassium']}")
    print(f"  Temperature: {data['temperature']}°C, Humidity: {data['humidity']}%")
    print(f"  pH: {data['ph']}, Rainfall: {data['rainfall']}mm")
    print(f"  State: {data['state']}")
    
    try:
        response = requests.post(url, json=data)
        
        if response.status_code == 201:
            result = response.json()
            print("\n✓ Success!")
            print(f"\nRecommendations:")
            
            if 'recommended_crops' in result:
                for i, crop in enumerate(result['recommended_crops'], 1):
                    print(f"  {i}. {crop.get('crop_name', 'Unknown')} - "
                          f"Score: {crop.get('suitability_score', 0):.2f}%")
            
            print(f"\nFull Response:")
            print(json.dumps(result, indent=2))
        else:
            print(f"\n✗ Error: {response.status_code}")
            print(response.text)
    
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: Could not connect to server.")
        print("  Make sure Django server is running: python manage.py runserver")
    except Exception as e:
        print(f"\n✗ Error: {e}")


def test_disease_prediction():
    """Test disease prediction API"""
    print("\n" + "="*60)
    print("Testing Disease Prediction API")
    print("="*60)
    
    print("\nNote: This requires an actual plant image file.")
    print("To test manually:")
    print("  1. Use Postman or curl")
    print("  2. POST to http://127.0.0.1:8000/api/diseases/predictions/")
    print("  3. Upload 'plant_image' as multipart/form-data")
    print("\nExample curl command:")
    print('  curl -X POST http://127.0.0.1:8000/api/diseases/predictions/ \\')
    print('       -F "plant_image=@path/to/image.jpg" \\')
    print('       -F "crop=1"')


def test_api_root():
    """Test API root endpoint"""
    print("\n" + "="*60)
    print("Testing API Root")
    print("="*60)
    
    url = f"{BASE_URL}/"
    
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            result = response.json()
            print("\n✓ API is running!")
            print(f"\nAvailable Endpoints:")
            for name, path in result.get('endpoints', {}).items():
                print(f"  • {name}: {path}")
        else:
            print(f"\n✗ Error: {response.status_code}")
    
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: Django server is not running.")
        print("  Start it with: python manage.py runserver")
    except Exception as e:
        print(f"\n✗ Error: {e}")


if __name__ == "__main__":
    print("\n" + "="*60)
    print("Agri Sahayak API Test Suite")
    print("="*60)
    
    # Test API root
    test_api_root()
    
    # Test crop recommendation
    test_crop_recommendation()
    
    # Test disease prediction info
    test_disease_prediction()
    
    print("\n" + "="*60)
    print("Test Complete!")
    print("="*60 + "\n")

"""
Test the crop recommendation API with your exact values
"""
import requests
import json

# Your exact values
data = {
    "nitrogen": 90,
    "phosphorus": 42,
    "potassium": 43,
    "temperature": 20.87974371,
    "humidity": 82.00274423,
    "ph": 6.502985292,
    "rainfall": 202.9355362,
    "state": "Test"
}

print("Testing Crop Recommendation API")
print("=" * 60)
print("\nInput Data:")
print(json.dumps(data, indent=2))
print("\nMaking 5 API calls with the same data...\n")

url = "http://127.0.0.1:8000/api/crops/recommendations/"

for i in range(5):
    try:
        response = requests.post(url, json=data)
        
        if response.status_code == 201:
            result = response.json()
            print(f"Test {i+1}:")
            
            if 'recommended_crops' in result:
                crops = result['recommended_crops']
                if crops:
                    print(f"  Top prediction: {crops[0].get('crop_name', 'Unknown')}")
                    print(f"  Confidence: {crops[0].get('suitability_score', 0):.2f}%")
                    
                    if len(crops) > 1:
                        print(f"  Other predictions:")
                        for crop in crops[1:]:
                            print(f"    - {crop.get('crop_name')}: {crop.get('suitability_score', 0):.2f}%")
                else:
                    print("  No recommendations returned")
            print()
        else:
            print(f"Test {i+1}: Error {response.status_code}")
            print(response.text)
            break
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Cannot connect to server.")
        print("Make sure Django server is running: python manage.py runserver")
        break
    except Exception as e:
        print(f"ERROR: {e}")
        break

print("=" * 60)

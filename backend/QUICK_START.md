# 🚀 Quick Start Guide - ML Models Integration

## ✅ What's Been Integrated

### 1. Crop Recommendation System
- **File**: `crops/recommendation.py`
- **Model**: `model.pkl` (Random Forest)
- **Status**: ✅ Fully integrated with API

### 2. Disease Prediction System  
- **File**: `diseases/prediction.py`
- **Model**: `plant_disease_model.h5` (CNN)
- **Status**: ✅ Fully integrated with API

## 🎯 Quick Test

### Option 1: Run the test script
```bash
# Windows
test_models.bat

# Or manually
python manage.py test_crop_model
python test_api.py
```

### Option 2: Test via API

**Crop Recommendation:**
```bash
curl -X POST http://127.0.0.1:8000/api/crops/recommendations/ ^
  -H "Content-Type: application/json" ^
  -d "{\"nitrogen\":90,\"phosphorus\":42,\"potassium\":43,\"temperature\":20.8,\"humidity\":82.0,\"ph\":6.5,\"rainfall\":202.9,\"state\":\"Punjab\"}"
```

**Disease Prediction:**
```bash
curl -X POST http://127.0.0.1:8000/api/diseases/predictions/ ^
  -F "plant_image=@path\to\image.jpg"
```

## 📊 Expected Output

### Crop Recommendation Response:
```json
{
  "id": 1,
  "nitrogen": 90,
  "phosphorus": 42,
  "potassium": 43,
  "temperature": 20.8,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9,
  "recommended_crops": [
    {
      "crop_name": "rice",
      "suitability_score": 92.5,
      "confidence": 92.5
    },
    {
      "crop_name": "cotton",
      "suitability_score": 78.3,
      "confidence": 78.3
    }
  ]
}
```

### Disease Prediction Response:
```json
{
  "id": 1,
  "predicted_disease": "Late Blight",
  "confidence": 87.45,
  "additional_info": {
    "crop": "Potato",
    "is_healthy": false,
    "all_predictions": [
      {
        "crop": "Potato",
        "disease": "Late blight",
        "confidence": 87.45,
        "is_healthy": false
      }
    ]
  },
  "notes": "Detected: Late blight in Potato"
}
```

## 🔧 File Structure

```
backend/
├── model.pkl                          # Crop recommendation model
├── plant_disease_model.h5             # Disease prediction model
├── Crop_recommendation.csv            # Training data
├── crops/
│   ├── recommendation.py              # ✨ Crop ML logic
│   └── views.py                       # Uses recommendation.py
├── diseases/
│   ├── prediction.py                  # ✨ Disease ML logic
│   └── views.py                       # Uses prediction.py
├── test_api.py                        # API testing script
└── ML_MODELS_GUIDE.md                 # Full documentation
```

## 🎨 Frontend Integration

### Crop Recommendation Component
```javascript
const getCropRecommendation = async (formData) => {
  const response = await fetch('http://localhost:8000/api/crops/recommendations/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nitrogen: formData.nitrogen,
      phosphorus: formData.phosphorus,
      potassium: formData.potassium,
      temperature: formData.temperature,
      humidity: formData.humidity,
      ph: formData.ph,
      rainfall: formData.rainfall,
      state: formData.state
    })
  });
  const data = await response.json();
  return data.recommended_crops;
};
```

### Disease Prediction Component
```javascript
const predictDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('plant_image', imageFile);
  
  const response = await fetch('http://localhost:8000/api/diseases/predictions/', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  return data;
};
```

## 🐛 Troubleshooting

### Models not loading?
1. Check files exist: `dir model.pkl` and `dir plant_disease_model.h5`
2. Check console when starting server for load messages
3. Verify numpy version: `pip install "numpy<1.24"`

### TensorFlow errors?
```bash
pip install tensorflow-cpu==2.10.0
```

### API returns 500 error?
1. Check Django console for error details
2. Verify all packages installed: `pip install -r requirements.txt`
3. Run migrations: `python manage.py migrate`

## 📚 Resources

- **Full Guide**: [ML_MODELS_GUIDE.md](ML_MODELS_GUIDE.md)
- **API Docs**: [README.md](README.md)
- **Django Admin**: http://127.0.0.1:8000/admin/
- **API Root**: http://127.0.0.1:8000/

## ✨ Features

Both ML models are now:
- ✅ Automatically loaded on server start
- ✅ Integrated with REST API endpoints
- ✅ Returning predictions with confidence scores
- ✅ Handling errors gracefully (fallback to rule-based)
- ✅ Ready for frontend integration

**You're all set! Both features are working! 🎉**

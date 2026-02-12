# ML Models Setup Guide

This guide will help you set up and test the ML models for crop recommendation and disease prediction.

## 📁 Required Files

Ensure these files are in the `backend/` directory:
- ✅ `model.pkl` - Random Forest model for crop recommendation
- ✅ `plant_disease_model.h5` - CNN model for disease prediction
- ✅ `Crop_recommendation.csv` - Training data (optional, only for retraining)

## 🚀 Setup Instructions

### 1. Activate Your Conda Environment

```bash
conda activate your_env_name
```

### 2. Install Dependencies

All required packages are in `requirements.txt`:
```bash
pip install -r requirements.txt
```

Key packages:
- `scikit-learn` - For crop recommendation (Random Forest)
- `tensorflow` - For disease prediction (CNN)
- `numpy`, `pandas` - Data processing
- `Pillow` - Image handling

### 3. Verify Models Are Loaded

Start Django server and check console output:
```bash
cd backend
python manage.py runserver
```

You should see:
```
✓ Crop recommendation model loaded successfully from D:\Agri_sahayak_02\backend\model.pkl
✓ Disease prediction model loaded successfully from D:\Agri_sahayak_02\backend\plant_disease_model.h5
  Model expects input shape: (None, 224, 224, 3)
  Number of classes: 32
```

## 🧪 Testing the Models

### Test Crop Recommendation Model

```bash
python manage.py test_crop_model
```

This will test the model with sample inputs and show recommendations.

### Test via API

**Using curl (PowerShell):**

```powershell
# Test Crop Recommendation
$body = @{
    nitrogen = 90
    phosphorus = 42
    potassium = 43
    temperature = 20.8
    humidity = 82.0
    ph = 6.5
    rainfall = 202.9
    state = "Punjab"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/crops/recommendations/" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -SessionVariable session

# Test Disease Prediction (requires multipart form with image)
# Upload a plant image
curl.exe -X POST http://127.0.0.1:8000/api/diseases/predictions/ `
    -F "plant_image=@path\to\your\plant_image.jpg" `
    -F "crop=1"
```

**Using Python:**

```python
import requests

# Crop Recommendation
url = "http://127.0.0.1:8000/api/crops/recommendations/"
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
response = requests.post(url, json=data)
print(response.json())

# Disease Prediction
url = "http://127.0.0.1:8000/api/diseases/predictions/"
files = {'plant_image': open('plant_image.jpg', 'rb')}
data = {'crop': 1}
response = requests.post(url, files=files, data=data)
print(response.json())
```

## 📊 Model Details

### Crop Recommendation Model (model.pkl)

- **Type**: Random Forest Classifier
- **Framework**: scikit-learn
- **Input Features**: 7 parameters
  - N (Nitrogen): 0-140 kg/acre
  - P (Phosphorus): 5-145 kg/acre
  - K (Potassium): 5-205 kg/acre
  - Temperature: 8-44°C
  - Humidity: 14-100%
  - pH: 3.5-10
  - Rainfall: 20-300mm

- **Output**: Top 5 crop recommendations with confidence scores
- **Crops**: rice, wheat, cotton, maize, sugarcane, chickpea, etc.

### Disease Prediction Model (plant_disease_model.h5)

- **Type**: Convolutional Neural Network (CNN)
- **Framework**: TensorFlow/Keras
- **Input**: RGB images (224x224 pixels)
- **Output**: Disease classification with confidence
- **Supported Crops**: Apple, Corn, Grape, Potato, Rice, Tomato, Wheat
- **Diseases**: ~32 classes including healthy states

## 🔧 Troubleshooting

### Issue: Model not loading

**Solution 1**: Check file paths
```bash
# Verify files exist
dir model.pkl
dir plant_disease_model.h5
```

**Solution 2**: Check permissions
```bash
# Ensure files are readable
icacls model.pkl
```

### Issue: TensorFlow errors

**For CPU-only:**
```bash
pip install tensorflow-cpu==2.10.0
```

**For GPU (CUDA required):**
```bash
pip install tensorflow-gpu==2.10.0
```

### Issue: Numpy version conflict

```bash
pip install "numpy<1.24"
```

## 📈 Model Performance

To retrain the crop recommendation model:

```bash
cd backend
python train_model.py
```

This will:
1. Load `Crop_recommendation.csv`
2. Train a Random Forest model
3. Save as `model.pkl`
4. Display accuracy metrics

## 🔄 Model Updates

### Update Class Names (Disease Model)

If your disease model uses different classes, update in `diseases/prediction.py`:

```python
self.class_names = [
    'Your_Class_1',
    'Your_Class_2',
    # ... add your classes
]
```

### Retrain Models

**Crop Recommendation:**
1. Update `Crop_recommendation.csv` with new data
2. Run `python train_model.py`
3. New `model.pkl` will be created

**Disease Prediction:**
1. Train your CNN model separately
2. Save as `plant_disease_model.h5`
3. Update class names in `diseases/prediction.py`

## 📝 API Endpoints

### Crop Recommendation
- **POST** `/api/crops/recommendations/`
- **Body**: JSON with N, P, K, temperature, humidity, ph, rainfall
- **Response**: List of recommended crops with scores

### Disease Prediction
- **POST** `/api/diseases/predictions/`
- **Body**: Multipart form with plant_image file
- **Response**: Predicted disease with confidence and treatment

## 🎯 Integration with Frontend

Your React frontend should:

1. **Crop Recommendation**: Send soil/climate data to `/api/crops/recommendations/`
2. **Disease Prediction**: Upload plant image to `/api/diseases/predictions/`
3. **Display Results**: Show recommendations with scores/confidence

Both endpoints are now using the actual ML models!

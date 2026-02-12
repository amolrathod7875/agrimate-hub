# Agri Sahayak Backend

Django REST API backend for the Agri Sahayak agricultural assistance platform with integrated ML models.

## Features

- **User Management**: Custom user model with farmer profiles
- **Crop Recommendations**: ✨ **ML-powered** crop suggestions using Random Forest (model.pkl)
- **Disease Prediction**: ✨ **CNN-based** plant disease detection using TensorFlow (plant_disease_model.h5)
- **Government Schemes**: Browse agricultural schemes and subsidies
- **Mandi Prices**: Real-time market prices with price alerts
- **Marketplace**: Buy and sell agricultural produce directly

## Tech Stack

- Django 5.0
- Django REST Framework
- **scikit-learn** - Crop recommendation (Random Forest)
- **TensorFlow/Keras** - Disease prediction (CNN)
- SQLite (development) / PostgreSQL (production recommended)
- Python 3.10+

## Project Structure

```
backend/
├── agri_sahayak/       # Main project settings
├── users/              # User authentication and profiles
├── crops/              # Crop master data and recommendations
├── diseases/           # Disease detection and management
├── schemes/            # Government schemes
├── mandi/              # Market prices and alerts
├── market/             # Marketplace for buying/selling
├── manage.py
└── requirements.txt
```

## Installation

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

**✅ Check Console Output**: You should see confirmation that ML models are loaded:
```
✓ Crop recommendation model loaded successfully
✓ Disease prediction model loaded successfully
```

### 7. Test ML Models (Optional)

```bash
python manage.py test_crop_model
```

See [ML_MODELS_GUIDE.md](ML_MODELS_GUIDE.md) for detailed ML setup and testing.

## API Endpoints

### Users
- `GET/POST /api/users/` - List/create users
- `GET /api/users/me/` - Get current user
- `GET/POST /api/users/profiles/` - Farmer profiles

### Crops
- `GET/POST /api/crops/` - List/create crops
- `GET /api/crops/by_season/?season=kharif` - Filter by season
- `POST /api/crops/recommendations/` - Get crop recommendations

### Diseases
- `GET/POST /api/diseases/` - List/create diseases
- `GET /api/diseases/by_crop/?crop_id=1` - Filter by crop
- `POST /api/diseases/predictions/` - Submit disease prediction

### Government Schemes
- `GET/POST /api/schemes/` - List/create schemes
- `GET /api/schemes/by_category/?category=subsidy` - Filter by category
- `GET /api/schemes/by_state/?state=Punjab` - Filter by state

### Mandi Prices
- `GET/POST /api/mandi/prices/` - List/create prices
- `GET /api/mandi/prices/latest/?crop_id=1` - Latest prices for crop
- `GET /api/mandi/prices/statistics/?crop_id=1` - Price statistics
- `GET/POST /api/mandi/alerts/` - Price alerts

### Market
- `GET/POST /api/market/listings/` - List/create product listings
- `GET /api/market/listings/my_listings/` - User's listings
- `POST /api/market/listings/{id}/mark_sold/` - Mark as sold
- `GET/POST /api/market/inquiries/` - Product inquiries

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` with your superuser credentials.

## ML Models

The backend includes two trained ML models:

1. **model.pkl** - Random Forest for crop recommendation
   - Input: N, P, K, temperature, humidity, pH, rainfall
   - Output: Top 5 crop recommendations with confidence scores

2. **plant_disease_model.h5** - CNN for disease prediction
   - Input: Plant leaf image (224x224 RGB)
   - Output: Disease classification with confidence

**See [ML_MODELS_GUIDE.md](ML_MODELS_GUIDE.md) for complete documentation.**

## Configuration

Key settings in `agri_sahayak/settings.py`:

- **SECRET_KEY**: Change in production
- **DEBUG**: Set to False in production
- **ALLOWED_HOSTS**: Add production domains
- **DATABASES**: Configure PostgreSQL for production
- **CORS_ALLOWED_ORIGINS**: Frontend URL

## Sample Data

To populate the database with sample data, you can use the Django admin panel or create management commands.

## API Authentication

Currently using Session Authentication. For production, consider adding:
- JWT tokens (djangorestframework-simplejwt)
- API key authentication
- OAuth2

## Next Steps

1. Integrate ML models for:
   - Crop recommendation
   - Disease prediction
2. Add real-time price updates
3. Implement notifications system
4. Add image processing for disease detection
5. Integrate payment gateway for marketplace
6. Add search and filtering capabilities
7. Implement caching (Redis)
8. Add automated testing

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
```

### Collecting Static Files
```bash
python manage.py collectstatic
```

## License

MIT

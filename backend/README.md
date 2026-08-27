# AgriMate Hub — Backend

> Django REST API backend for the AgriMate Hub agricultural assistance platform, with integrated machine-learning models for crop recommendation and plant-disease detection.

## Project Overview

Farmers need timely, data-driven guidance on **what to grow** and **what is wrong with their crops**, plus market and scheme information. The backend provides the intelligence layer of AgriMate Hub: it serves structured data through a REST API and runs two trained ML models that turn raw inputs (soil metrics, leaf images) into actionable recommendations. It also integrates with India's Open Government Data (`data.gov.in`) platform to surface live mandi prices.

## Solution

The backend is a **Django 5** project (`agri_sahayak`) composed of focused Django apps, each owning a domain:

- **`users`** — Custom user model (`AUTH_USER_MODEL = 'users.User'`) and farmer profiles, with session-based authentication.
- **`crops`** — Crop master data plus crop recommendation. `crops/recommendation.py` loads `model.pkl` (a scikit-learn **Random Forest**) and predicts the top suitable crops from N, P, K, temperature, humidity, pH, rainfall, and state.
- **`diseases`** — Plant-disease detection. `diseases/prediction.py` loads `plant_disease_model.h5` (a TensorFlow/Keras **CNN**) and classifies leaf images, returning the disease and confidence.
- **`schemes`** — Government schemes/subsidies browseable by category and state.
- **`mandi`** — Mandi (market) prices and price alerts, sourced from the `data.gov.in` mandi resource.
- **`market`** — Marketplace listings and product inquiries for buying/selling produce.

### Key behaviors
- **Model auto-loading on startup** with graceful fallback to rule-based logic when a model or external API is unavailable.
- **CORS** (`django-cors-headers`) trusts the frontend dev origins (`localhost:5173`, `:8080`).
- **External data**: mandi prices are fetched from `data.gov.in` using the configured API key/resource; an optional OpenAI key provides LLM fallback.
- **Media handling**: uploaded leaf images are stored under `MEDIA_ROOT`.

## Tech Stack

- **Python 3.10+**
- **Django 5.0** + **Django REST Framework 3.14+**
- **django-cors-headers** (cross-origin requests)
- **scikit-learn** + **joblib** (Random Forest crop model)
- **TensorFlow < 2.11** + **Keras** + **h5py** (CNN disease model; pinned with `numpy < 1.24` for TF 2.10 compatibility on Windows)
- **Pillow** (image processing), **pandas / NumPy < 1.24 / SciPy** (data)
- **spectral** (hyperspectral utilities), **matplotlib / seaborn / tqdm** (analysis & training tooling)
- **SQLite** (development database; PostgreSQL recommended for production)
- Optional: **FastAPI / uvicorn / python-multipart** (additional API surface), **python-decouple** (`.env` config), **jupyterlab** (notebooks such as `mandai_mart.ipynb`), **requests** (external HTTP)

## Setup and Installation

### Prerequisites
- Python 3.10 or newer
- `pip` and (recommended) a virtual environment

### Steps
```bash
# 1. Move into the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate            # Windows
# source venv/bin/activate       # Linux / macOS

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. (Optional) Create an admin user
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver       # http://localhost:8000
```

On startup you should see confirmation that the ML models loaded:
```
✓ Crop recommendation model loaded successfully
✓ Disease prediction model loaded successfully
```

### Useful scripts
- `setup_db.bat` / `reset_db.bat` — provision / reset the local database (Windows).
- `start_server.bat` — convenience server launcher.
- `test_models.bat`, `test_api.py`, `test_api_consistency.py` — verify ML models and endpoints.
- `python manage.py test_crop_model` — sanity-check the crop model.
- `train_model.py` — retrain/inspect the crop recommendation model.

### Configuration
Key settings live in `agri_sahayak/settings.py`:
- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS` — security basics (change for production).
- `DATABASES` — switch to PostgreSQL for production.
- `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` — frontend URLs.
- `DATA_GOV_API_KEY` / `MANDI_API_KEY` / `MANDI_API_URL` — live price data (or set via `backend/.env`).
- `OPENAI_API_KEY` — optional LLM fallback.

## API Endpoints

Base URL: `http://localhost:8000`

| Area | Endpoint | Methods |
|------|----------|---------|
| Root | `/` | GET (endpoint map) |
| Admin | `/admin/` | GET |
| Users | `/api/users/`, `/api/users/me/`, `/api/users/profiles/` | GET/POST |
| Crops | `/api/crops/`, `/api/crops/by_season/`, `/api/crops/recommendations/` | GET/POST |
| Diseases | `/api/diseases/`, `/api/diseases/by_crop/`, `/api/diseases/predictions/` | GET/POST |
| Schemes | `/api/schemes/`, `/api/schemes/by_category/`, `/api/schemes/by_state/` | GET/POST |
| Mandi | `/api/mandi/prices/`, `/api/mandi/prices/latest/`, `/api/mandi/prices/statistics/`, `/api/mandi/alerts/` | GET/POST |
| Market | `/api/market/listings/`, `/api/market/listings/my_listings/`, `/api/market/inquiries/` | GET/POST |

### Example requests
```bash
# Crop recommendation
curl -X POST http://127.0.0.1:8000/api/crops/recommendations/ \
  -H "Content-Type: application/json" \
  -d "{\"nitrogen\":90,\"phosphorus\":42,\"potassium\":43,\"temperature\":20.8,\"humidity\":82.0,\"ph\":6.5,\"rainfall\":202.9,\"state\":\"Punjab\"}"

# Disease prediction (multipart image upload)
curl -X POST http://127.0.0.1:8000/api/diseases/predictions/ \
  -F "plant_image=@path/to/leaf.jpg"
```

## Notes
- The trained artifacts `model.pkl` and `plant_disease_model.h5` must remain in this directory.
- TensorFlow is pinned to `<2.11` with `numpy<1.24` for Windows GPU support; use `tensorflow-cpu==2.10.0` if you hit GPU/driver issues.
- See `ML_MODELS_GUIDE.md` and `QUICK_START.md` in this folder for deeper ML and integration details.

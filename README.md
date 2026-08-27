# AgriMate Hub

> An AI-powered agricultural assistance platform for Indian farmers, combining crop recommendation, plant-disease detection, market intelligence, and a produce marketplace in a single, accessible web application.

## Project Overview

Indian farmers face fragmented access to agricultural knowledge and services: choosing the right crop for their soil, diagnosing crop diseases early, finding current mandi (market) prices, discovering government schemes, and reaching buyers. **AgriMate Hub** addresses this by unifying these services into one platform with a clean, multilingual-ready interface and a machine-learning backend.

The problem space includes:
- **Crop selection** based on soil nutrients (N, P, K), climate, and rainfall.
- **Early disease detection** from leaf images to prevent crop loss.
- **Market transparency** via live mandi price data and price alerts.
- **Scheme discovery** so farmers can access subsidies and government programs.
- **Direct selling** through a marketplace that connects sellers and buyers.

## Solution

AgriMate Hub is a full-stack web application split into two cooperating components:

- **Frontend** — a React single-page application (SPA) that presents the farmer-facing experience: a landing page, a category-aware dashboard (Agriculture / Horticulture / Floriculture), and feature modules for crop recommendation, disease prediction, government schemes, mandi prices, marketplace selling, and profile management.
- **Backend** — a Django REST API that serves data and runs the ML models. It exposes endpoints for users, crops, disease predictions, schemes, mandi prices/alerts, and marketplace listings, and integrates with the `data.gov.in` Open Government Data API for real-time mandi prices.

### Architecture

```
┌─────────────────────────────────┐         ┌──────────────────────────────────┐
│         Frontend (SPA)          │         │        Backend (Django)          │
│                                 │         │                                  │
│  React + Vite + TypeScript      │  HTTP   │  Django 5 + Django REST Framework│
│  Tailwind CSS + shadcn/ui       │ ──────► │  ML: scikit-learn / TensorFlow   │
│  React Router + TanStack Query  │  JSON   │  SQLite (dev) / PostgreSQL (prod)│
│  Recharts / framer-motion       │ ◄────── │  data.gov.in integration         │
│  (mock data, API-ready)         │         │  CORS-enabled REST API :8000     │
└─────────────────────────────────┘         └──────────────────────────────────┘
```

The frontend runs as a static SPA (typically on `http://localhost:5173` or `:8080`) and communicates with the backend REST API on `http://localhost:8000`. Cross-Origin Resource Sharing (CORS) is configured on the backend to trust the frontend's dev origins. The backend automatically loads the trained ML models on startup and falls back to rule-based logic when a model or external API is unavailable.

**Request flow:**
1. The browser loads the React SPA and renders the landing/dashboard UI.
2. Feature modules call backend REST endpoints (e.g. `POST /api/crops/recommendations/`, `POST /api/diseases/predictions/`).
3. The backend runs the relevant ML model or queries `data.gov.in`, then returns structured JSON (with confidence scores) consumed by the frontend via TanStack Query.

## Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** (build tool / dev server) + `@vitejs/plugin-react-swc`
- **Tailwind CSS** + **shadcn/ui** (built on **Radix UI** primitives)
- **React Router** (client-side routing)
- **TanStack Query** (server-state / data fetching)
- **framer-motion** (animations), **Recharts** (charts), **lucide-react** (icons)
- **react-hook-form** + **zod** (forms & validation)
- **Vitest** + Testing Library (unit tests), **ESLint** (linting)

### Backend
- **Python 3.10+** with **Django 5.0** and **Django REST Framework**
- **django-cors-headers** (CORS)
- **scikit-learn** (Random Forest crop recommendation) + **joblib**
- **TensorFlow / Keras** (CNN plant-disease detection) + **h5py**
- **Pillow** (image handling), **pandas / NumPy / SciPy** (data processing)
- **SQLite** (development DB; PostgreSQL recommended for production)
- Optional: **FastAPI/uvicorn** utilities, **python-decouple** (config), OpenAI fallback

## Setup and Installation

Both components are independent and must be run together for the full experience.

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate            # Windows  (use: source venv/bin/activate on Linux/macOS)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver       # http://localhost:8000
```
See [backend/README.md](backend/README.md) for full details, ML model notes, and API endpoints.

### 2. Frontend
```bash
cd frontend
npm install                      # or: bun install
npm run dev                     # http://localhost:5173
```
See [frontend/README.md](frontend/README.md) for full details and scripts.

> Tip: keep the backend running on `:8000` while developing the frontend so the feature modules can call the REST API. Configure `CORS_ALLOWED_ORIGINS` in `backend/agri_sahayak/settings.py` to match the frontend's dev URL.

## Project Structure
```
agrimate-hub/
├── README.md            # This file (root overview)
├── backend/             # Django REST API + ML models
└── frontend/            # React SPA (Vite + TypeScript)
```

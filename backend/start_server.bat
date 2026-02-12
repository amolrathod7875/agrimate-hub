@echo off
echo ========================================
echo   Agri Sahayak Backend Server
echo ========================================
echo.

REM Check if virtual environment exists
if exist venv\ (
    echo [OK] Virtual environment found
    call venv\Scripts\activate.bat
) else (
    echo [INFO] Virtual environment not found. Creating...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo [INFO] Installing dependencies...
    pip install -r requirements.txt
)

echo.
echo [INFO] Checking ML models...
if exist model.pkl (
    echo [OK] Crop recommendation model found
) else (
    echo [WARNING] model.pkl not found
)

if exist plant_disease_model.h5 (
    echo [OK] Disease prediction model found
) else (
    echo [WARNING] plant_disease_model.h5 not found
)

echo.
echo [INFO] Starting Django development server...
echo.
python manage.py runserver

pause

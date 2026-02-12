@echo off
echo ========================================
echo   Testing ML Models
echo ========================================
echo.

REM Activate virtual environment
if exist venv\ (
    call venv\Scripts\activate.bat
) else (
    echo [ERROR] Virtual environment not found
    echo Run: python -m venv venv
    pause
    exit /b 1
)

echo Testing crop recommendation model...
python manage.py test_crop_model

echo.
echo.
echo Testing API endpoints...
python test_api.py

echo.
pause

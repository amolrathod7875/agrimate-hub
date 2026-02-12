@echo off
echo ========================================
echo   Database Setup and Migrations
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

echo [1/3] Creating migrations...
python manage.py makemigrations

echo.
echo [2/3] Applying migrations...
python manage.py migrate

echo.
echo [3/3] Creating superuser...
echo Enter superuser details:
python manage.py createsuperuser

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo You can now run: python manage.py runserver
echo Or use: start_server.bat
echo.
pause

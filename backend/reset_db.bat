@echo off
echo Resetting database...
echo.

REM Close any Python processes that might have the database locked
taskkill /F /IM python.exe 2>nul

REM Wait a moment
timeout /t 2 /nobreak > nul

REM Delete database
if exist db.sqlite3 (
    del /F db.sqlite3
    echo Database deleted.
) else (
    echo Database not found.
)

echo.
echo Now run: python manage.py migrate
echo.
pause

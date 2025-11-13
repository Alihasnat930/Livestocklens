@echo off
echo ====================================
echo Starting LivestockLens with Neon DB
echo ====================================
echo.

echo Checking environment...
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create .env file with your DATABASE_URL
    pause
    exit /b 1
)

echo Verifying DATABASE_URL...
findstr "DATABASE_URL=postgresql" .env >nul
if errorlevel 1 (
    echo ERROR: DATABASE_URL not properly set in .env file!
    echo Current .env contents:
    type .env
    pause
    exit /b 1
)

echo Environment OK - Starting development server...
call npm run dev

pause

@echo off
echo ====================================
echo Neon Database Setup
echo ====================================
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Updating drizzle-kit...
call npm install drizzle-kit@latest -D
if errorlevel 1 (
    echo WARNING: drizzle-kit update had issues, continuing...
)

echo.
echo Step 3: Pushing database schema to Neon...
call npm run db:push
if errorlevel 1 (
    echo ERROR: Failed to push database schema
    echo.
    echo Troubleshooting:
    echo - Check your .env file has DATABASE_URL set
    echo - Verify your Neon connection string is correct
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo SUCCESS! Database setup complete
echo ====================================
echo.
echo You can now run: npm run dev
echo.
pause

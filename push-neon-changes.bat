@echo off
echo ====================================
echo Push Neon Database Setup to GitHub
echo ====================================
echo.

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Adding all changes...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo Step 3: Committing changes...
git commit -m "feat: Migrate to Neon cloud database

- Add Neon serverless database driver
- Update database configuration for Neon HTTP client
- Add GitHub Actions workflow for preview branches
- Update drizzle-kit configuration
- Add environment variable loading for tsx
- Fix Windows server binding compatibility
- Add setup and start batch files for easy deployment
- Update documentation with Neon setup guide"

if errorlevel 1 (
    echo.
    echo Note: If no changes to commit, this is expected
)

echo.
echo Step 4: Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    echo.
    echo Troubleshooting:
    echo - Check your internet connection
    echo - Verify you have push access to the repository
    echo - Make sure you're authenticated with GitHub
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo SUCCESS! Changes pushed to GitHub
echo ====================================
echo.
echo Your Neon database setup is now on GitHub!
echo The GitHub Actions workflow will create preview branches for PRs.
echo.
pause

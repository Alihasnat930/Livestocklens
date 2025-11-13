# PowerShell script to start development server
Write-Host "Starting Livestock Lens Development Server..." -ForegroundColor Green

# Set environment variables
$env:NODE_ENV = "development"
$env:DATABASE_URL = "postgresql://postgres:password@localhost:5432/livestock_lens"
$env:JWT_SECRET = "livestock-health-meter-secret-key"
$env:PORT = "5000"

# Start the development server
npm run dev
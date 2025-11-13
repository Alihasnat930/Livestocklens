@echo off
echo Starting Livestock Lens Development Server...

rem Set environment variables
set NODE_ENV=development
set DATABASE_URL=postgresql://postgres:password@localhost:5432/livestock_lens
set JWT_SECRET=livestock-health-meter-secret-key
set PORT=5000

rem Start the development server
npm run dev
@echo off
echo 🚀 Setting up SmartDrishti Backend...

REM Navigate to backend directory
cd backend

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file...
    echo PORT=5000 > .env
    echo DATABASE_URL=your_neon_postgres_connection_string_here >> .env
    echo FRONTEND_URL=http://localhost:5173 >> .env
    echo ⚠️  Please update the DATABASE_URL in .env with your Neon PostgreSQL connection string
)

echo ✅ Backend setup complete!
echo.
echo Next steps:
echo 1. Get your Neon PostgreSQL connection string from https://neon.tech/
echo 2. Update DATABASE_URL in backend/.env
echo 3. Run 'npm run dev' to start the backend server
pause
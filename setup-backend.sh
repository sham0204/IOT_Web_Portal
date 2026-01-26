#!/bin/bash

echo "🚀 Setting up SmartDrishti Backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env 2>/dev/null || echo "PORT=5000
DATABASE_URL=your_neon_postgres_connection_string_here
FRONTEND_URL=http://localhost:5173" > .env
    echo "⚠️  Please update the DATABASE_URL in .env with your Neon PostgreSQL connection string"
fi

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Get your Neon PostgreSQL connection string from https://neon.tech/"
echo "2. Update DATABASE_URL in backend/.env"
echo "3. Run 'npm run dev' to start the backend server"
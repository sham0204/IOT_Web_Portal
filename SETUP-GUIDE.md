# SmartDrishti Platform - Complete Setup Guide

## 🎯 Overview
This document provides complete instructions to set up and run the SmartDrishti IoT Learning Platform with both frontend and backend.

## 📋 Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- PostgreSQL database (Neon recommended)

## 🚀 Quick Setup

### Option 1: Automated Setup (Windows)
```batch
# Run the setup script
setup-backend.bat
```

### Option 2: Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
```

#### 2. Configure Environment
Edit `backend/.env`:
```env
PORT=5000
DATABASE_URL=your_neon_postgres_connection_string_here
FRONTEND_URL=http://localhost:5173
```

#### 3. Get Database Connection
1. Visit [Neon PostgreSQL](https://neon.tech/)
2. Sign up and create a new project
3. Copy your connection string
4. Paste it as `DATABASE_URL` in `.env`

#### 4. Start Backend
```bash
npm run dev
```
Backend runs on `http://localhost:5000`

#### 5. Frontend Setup
```bash
cd ../smartdrishti-platform
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🔧 Testing the Setup

### Test Backend API
```bash
cd ..
node test-api.js
```

This will test all major API endpoints and verify the backend is working correctly.

## 📁 Project Structure
```
FrontEnd/
├── backend/                    # Node.js backend server
│   ├── controllers/           # Business logic
│   ├── middleware/            # Middleware (file upload)
│   ├── routes/                # API route definitions
│   ├── uploads/               # Media file storage
│   ├── db.js                  # Database connection
│   ├── server.js              # Main server file
│   ├── .env                   # Environment variables
│   └── package.json           # Dependencies
│
├── smartdrishti-platform/     # React frontend
│   ├── src/
│   │   ├── api.ts             # API client
│   │   ├── components/        # UI components
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   └── App.tsx            # Main app
│   └── package.json           # Dependencies
│
├── setup-backend.bat          # Windows setup script
├── setup-backend.sh           # Linux/Mac setup script
├── test-api.js                # API testing script
├── README.md                  # Main documentation
└── backend/README.md          # Backend documentation
```

## 🎯 Key Features Implemented

### Backend
- ✅ RESTful API with Express.js
- ✅ PostgreSQL database with Neon
- ✅ File upload handling with Multer
- ✅ CORS configuration
- ✅ Error handling and validation
- ✅ Project and step management
- ✅ Media storage and retrieval

### Frontend Integration
- ✅ API client with axios
- ✅ Project creation form connected to backend
- ✅ Project listing with real data
- ✅ Project details with progress tracking
- ✅ Step completion updates
- ✅ Loading and error states

## 📊 Database Schema

### Projects Table
```sql
- id (UUID, primary key)
- title (TEXT)
- difficulty (TEXT)
- estimated_time (TEXT)
- description (TEXT)
- created_at (TIMESTAMP)
```

### Steps Table
```sql
- id (UUID, primary key)
- project_id (UUID, foreign key)
- title (TEXT)
- description (TEXT)
- status (ENUM: not_started, working, completed)
- created_at (TIMESTAMP)
```

### Step Media Table
```sql
- id (UUID, primary key)
- step_id (UUID, foreign key)
- media_type (ENUM: image, video)
- media_url (TEXT)
- created_at (TIMESTAMP)
```

## 🔌 API Endpoints

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Steps
- `POST /api/projects/:projectId/steps` - Add step
- `PUT /api/steps/:id` - Update step
- `DELETE /api/steps/:id` - Delete step

### Media
- `POST /api/steps/:stepId/media` - Upload media
- `DELETE /api/media/:mediaId` - Delete media

### Health
- `GET /api/health` - Server status

## 🎨 Frontend Pages Updated

### ProjectSetupPage.tsx
- Connected to backend API
- Real project creation
- Loading/error states
- Progress calculation

### ProjectDetails.tsx
- Fetch project data from backend
- Real step completion tracking
- Progress visualization
- Media handling (future)

### DemoProjects.tsx
- Backend-powered project listing
- Search and filtering
- Admin controls
- Loading states

## 🛠️ Development Commands

### Backend
```bash
cd backend
npm run dev    # Development with nodemon
npm start      # Production mode
```

### Frontend
```bash
cd smartdrishti-platform
npm run dev    # Development server
npm run build  # Production build
npm run lint   # Code linting
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```
   Error: connect ECONNREFUSED
   ```
   - Verify `DATABASE_URL` in `.env`
   - Check Neon PostgreSQL project status
   - Ensure SSL is enabled in `db.js`

2. **CORS Error**
   ```
   Access to fetch blocked by CORS policy
   ```
   - Check `FRONTEND_URL` in backend `.env`
   - Restart backend server

3. **Port Already in Use**
   ```
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   - Change `PORT` in `.env`
   - Kill existing process: `taskkill /f /im node.exe` (Windows)

4. **API Connection Refused**
   ```
   Network Error: connect ECONNREFUSED
   ```
   - Ensure backend is running
   - Check if port 5000 is accessible

## 📈 Next Steps

### Immediate Improvements
1. Add user authentication
2. Implement media upload in frontend
3. Add project templates
4. Create admin dashboard
5. Add user profiles

### Advanced Features
1. Real-time collaboration
2. Project sharing
3. Community features
4. Analytics dashboard
5. Mobile app

## 📞 Support

For issues and questions:
- Check the documentation in `README.md` and `backend/README.md`
- Run `node test-api.js` to diagnose backend issues
- Review browser console for frontend errors

---

✨ **Happy Coding!** The SmartDrishti platform is ready to help learners master IoT development!
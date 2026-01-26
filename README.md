<<<<<<< HEAD
# SmartDrishti IoT Learning Platform

A comprehensive IoT learning platform that guides users through hands-on projects with step-by-step instructions, progress tracking, and media support.

## 🚀 Features

- **Project Management**: Create, view, and manage IoT projects
- **Step-by-Step Guidance**: Detailed instructions for each project phase
- **Progress Tracking**: Visual progress indicators and completion status
- **Media Support**: Upload photos and videos for each step
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Instant feedback on project progress

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Neon PostgreSQL
- **File Storage**: Local filesystem with Multer
- **API**: RESTful endpoints

## 📁 Project Structure

```
smartdrishti-platform/
├── backend/                    # Node.js backend
│   ├── controllers/           # Business logic
│   ├── middleware/            # Middleware functions
│   ├── routes/                # API routes
│   ├── uploads/               # Uploaded media files
│   ├── db.js                  # Database connection
│   ├── server.js              # Main server file
│   ├── .env                   # Environment variables
│   └── package.json           # Backend dependencies
│
├── smartdrishti-platform/     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── api.ts             # API client
│   │   └── App.tsx            # Main application
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
```

## 🛠️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (Neon recommended)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smartdrishti-platform
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Configure Backend
1. Sign up for [Neon PostgreSQL](https://neon.tech/)
2. Create a new project and get your connection string
3. Edit `backend/.env`:
```env
PORT=5000
DATABASE_URL=your_neon_postgres_connection_string_here
FRONTEND_URL=http://localhost:5173
```

### 4. Start Backend Server
```bash
npm run dev  # Development mode with auto-restart
# or
npm start    # Production mode
```

Backend runs on `http://localhost:5000`

### 5. Setup Frontend
```bash
cd ../smartdrishti-platform
npm install
```

### 6. Start Frontend
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎯 Key Components

### Frontend Pages
- **Project Setup**: Create new IoT projects with guided steps
- **Project Details**: View and track progress on specific projects
- **Demo Projects**: Browse available projects
- **Dashboard**: Overview of all projects and progress

### Backend API Endpoints
- **Projects**: CRUD operations for projects
- **Steps**: Manage project steps and their status
- **Media**: Handle file uploads for project steps

## 🔧 Development Workflow

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes in appropriate directories
3. Test thoroughly
4. Create pull request

### Database Changes
1. Modify schema in `backend/db.js`
2. Update controllers to handle new fields
3. Test API endpoints
4. Update frontend components if needed

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets
- Mobile devices (iOS and Android)

## 🔒 Security Considerations

- CORS is configured for frontend URL only
- File upload validation and size limits
- SQL injection protection through parameterized queries
- Input validation on both frontend and backend

## 📊 Performance Optimization

- Lazy loading of components
- Efficient state management
- Optimized database queries
- Caching strategies (can be added)

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend server is running
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure ports are not blocked

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check Neon PostgreSQL project status
   - Confirm SSL settings

3. **File Upload Problems**
   - Ensure `uploads` directory exists
   - Check file size limits
   - Verify permissions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ for IoT learners everywhere!
=======
# IOT_Web_Portal
SmartDrishti is an IoT learning platform that provides step-by-step project guidance, progress tracking, and real-time device monitoring to help users learn IoT development through hands-on, practical experiences.
>>>>>>> e9fc4d316eeb72ce4b642fed816ffc3ca436b3e2

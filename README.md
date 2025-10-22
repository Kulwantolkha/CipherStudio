# 🚀 CipherStudio

A modern, real-time code editor and collaboration platform built with the MERN stack. Create projects, write code, and see live previews instantly with integrated Sandpack editor.

🌐 **Live Demo**: [https://cipher-studio-murex.vercel.app/](https://cipher-studio-murex.vercel.app/)


![CipherStudio](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![Node](https://img.shields.io/badge/Node-18.x-339933)

---

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 📁 **Project Management** - Create, update, and delete projects
- 📝 **File System** - Full file/folder CRUD operations
- 💻 **Live Code Editor** - Powered by Sandpack with syntax highlighting
- 👀 **Live Preview** - See changes in real-time
- 🎨 **Multiple Languages** - Support for JS, JSX, CSS, HTML, JSON, and more
- 💾 **Auto-Save** - Save all files with one click
- 🌐 **Responsive UI** - Works on desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.x - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Sandpack** - Live code editor
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **nanoid** - Unique ID generation

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- Git installed

### Clone Repository
```bash
git clone https://github.com/yourusername/cipherstudio.git
cd CipherStudio
```

---

## 🔧 Backend Setup

### 1. Navigate to Backend
```bash
cd backend/server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in `backend/server/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cipherstudio
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### 4. Start Backend Server
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend
```bash
cd frontend/cipherStudio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📚 API Documentation

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/user` | Get current user | ✅ |

### Project Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/projects` | Create project | ✅ |
| GET | `/api/projects/user/:userId` | Get user projects | ✅ |
| GET | `/api/projects/:id` | Get project by ID | ✅ |
| PUT | `/api/projects/:id` | Update project | ✅ |
| DELETE | `/api/projects/:id` | Delete project | ✅ |

### File Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/files` | Create file/folder | ✅ |
| GET | `/api/files/project/:projectId` | Get all project files | ✅ |
| GET | `/api/files/folder/:folderId` | Get folder contents | ✅ |
| GET | `/api/files/:id` | Get file by ID | ✅ |
| PUT | `/api/files/:id` | Update file content | ✅ |
| DELETE | `/api/files/:id` | Delete file/folder | ✅ |

---

## 🎯 Usage

### 1. Register/Login
- Click **Login** button in navbar
- Create account or login with existing credentials

### 2. Create Project
- Click **New Project** on home page
- Enter project name
- Project created with default React files

### 3. Edit Code
- Click **Open Editor** on any project
- See live preview as you type
- Click **+ New File** to add more files
- Click **Save All** to persist changes

### 4. Manage Projects
- **View all projects** on home page
- **Delete projects** with Delete button
- **Delete files** in editor

---

## 📁 Project Structure

```
CipherStudio/
├── backend/
│   └── server/
│       ├── config/          # Database configuration
│       ├── controllers/     # Business logic
│       ├── middlewares/     # Auth middleware
│       ├── models/          # Mongoose schemas
│       ├── routes/          # API routes
│       ├── .env            # Environment variables
│       └── app.js          # Express app entry
│
└── frontend/
    └── cipherStudio/
        ├── public/          # Static assets
        └── src/
            ├── components/  # React components
            ├── context/     # Context API
            ├── pages/       # Page components
            └── App.jsx      # Main app component
```

---

## 🔑 Key Features Explained

### Authentication
- JWT tokens stored in localStorage
- Protected routes with middleware
- Auto-login on page refresh
- Secure password hashing with bcrypt

### Project Management
- Unique project slugs generated with nanoid
- Owner-based access control
- Cascade delete (deleting project deletes all files)

### File System
- Hierarchical folder structure
- Recursive folder deletion
- Duplicate name prevention
- File size tracking

### Live Editor
- Real-time preview with Sandpack
- Syntax highlighting for multiple languages
- Tab management
- Error display

---

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables:
   ```
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-secret>
   PORT=5000
   ```

### Frontend (Vercel/Netlify)
1. Build project: `npm run build`
2. Deploy `dist` folder
3. Set base URL to your backend URL

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cipherstudio
JWT_SECRET=your_secret_key_here
```

### Frontend (optional)
Create `frontend/cipherStudio/.env`:
```env
VITE_API_URL=http://localhost:5000
```
---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod --version`
- Verify `.env` file exists with correct values
- Check port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in `app.js`
- Clear browser localStorage and cookies

### Authentication issues
- Clear localStorage
- Check JWT_SECRET matches in backend
- Verify token expiration (default 7 days)

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@kulwantolkha](https://github.com/kulwantolkha)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Sandpack](https://sandpack.codesandbox.io/) - Amazing live code editor
- [MongoDB](https://www.mongodb.com/) - Database
- [React](https://react.dev/) - UI Library
- [Express](https://expressjs.com/) - Backend framework


## 🔮 Future Enhancements

- [ ] Real-time collaboration
- [ ] Theme customization
- [ ] Code sharing via unique links
- [ ] Terminal integration
- [ ] Git integration
- [ ] Export projects as ZIP
- [ ] Dark/Light mode toggle
- [ ] Code snippets library
- [ ] Folder upload
- [ ] Search functionality

---

<div align="center">

Made with ❤️ by Kulwant

</div>
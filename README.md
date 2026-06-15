# Resume Architect

A full-stack web application for building, customizing, and exporting professional resumes. Resume Architect combines an intuitive frontend with a powerful backend to help users create beautiful, ATS-friendly resumes.

## 🌟 Features

- **Resume Builder**: Drag-and-drop interface to create and customize resumes
- **Multiple Templates**: Choose from various professionally-designed resume templates
- **PDF Export**: Generate high-quality PDF resumes ready for job applications
- **User Authentication**: Secure JWT-based authentication system
- **Resume Management**: Save, edit, and manage multiple resumes
- **AI-Powered Suggestions**: Get AI-powered recommendations for resume content
- **Preview Mode**: Real-time preview of your resume as you build it
- **Theme Customization**: Light/dark mode support with customizable themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, Helmet.js, CORS
- **PDF Generation**: PDFKit
- **Validation**: Express Validator
- **Logging**: Morgan

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Routing**: TanStack Router
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Custom React hooks with Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form

## 📁 Project Structure

```
resume-architect/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── app.js             # Express app configuration
│   │   ├── server.js          # Server entry point
│   │   ├── config/            # Database and configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper utilities
│   │   └── validators/        # Input validation schemas
│   └── package.json
│
└── frontend/                   # React + TanStack Start app
    ├── src/
    │   ├── components/        # React components
    │   ├── hooks/             # Custom React hooks
    │   ├── layouts/           # Layout components
    │   ├── lib/               # Utility functions
    │   ├── routes/            # Route definitions
    │   ├── services/          # API service clients
    │   └── store/             # Zustand stores
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resume-architect.git
   cd resume-architect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-architect
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```
The API server will start on `http://localhost:5000`

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```
The frontend will be available on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Resumes
- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create a new resume
- `GET /api/resumes/:id` - Get resume details
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes/:id/export/pdf` - Export resume as PDF

### AI Services
- `POST /api/ai/suggestions` - Get AI-powered content suggestions

## 🔐 Security Features

- JWT-based authentication with secure token handling
- Password encryption using bcryptjs
- CORS protection
- Helmet.js for HTTP headers security
- Input validation and sanitization
- Protected routes with authentication middleware

## 🎨 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📦 Building for Production

**Backend**
```bash
cd backend
npm run start
```

**Frontend**
```bash
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to:
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

If you have any questions or encounter issues, please:
- Check the [Issues](https://github.com/yourusername/resume-architect/issues) page
- Create a new issue with a detailed description
- Contact the development team

## 🎯 Roadmap

- [ ] Collaborative resume editing
- [ ] More template options
- [ ] Integration with job boards
- [ ] Resume optimization scoring
- [ ] Cover letter builder
- [ ] Social media profile links integration

## 👥 Authors

- Your Name - *Prem Patel*

---



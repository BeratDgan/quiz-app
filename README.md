# 🧠 TriviaQuiz - Interactive Quiz Platform

A modern, full-stack trivia quiz application built with React and Node.js, featuring real-time scoring, user authentication, and engaging UI/UX design.

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)

## ✨ Features

### 🎯 Core Features
- **Interactive Quiz System** - Dynamic question loading with timer-based gameplay
- **Real-time Scoring** - Instant feedback with score calculation based on accuracy and speed
- **User Authentication** - Secure JWT-based auth with Google OAuth integration
- **Leaderboard** - Global ranking system showcasing top performers
- **User Profiles** - Personal statistics and quiz history tracking
- **Responsive Design** - Beautiful Material-UI based interface that works on all devices

### 🔧 Technical Features
- **REST API** - Comprehensive backend API with proper error handling
- **Database Integration** - MongoDB for persistent data storage
- **State Management** - React Context API for global state
- **Route Protection** - Secure route guards for authenticated content
- **Modern UI/UX** - Dark theme with smooth animations and transitions

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Material-UI (MUI)** - Component library for consistent design
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Vite** - Fast development build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials (for Google login)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/quiz-app.git
cd quiz-app
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with the following variables:
# DB_CONN=your_mongodb_connection_string
# PORT=3131
# JWT_SECRET=your_jwt_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# SESSION_SECRET=your_session_secret
# FRONTEND_URL=http://localhost:5173

npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Database Setup
The application will automatically create the necessary collections. You can populate the questions database by running:
```bash
cd backend
node importQuestions.js
```

## 🎮 How to Use

1. **Registration/Login** - Create an account or use Google OAuth
2. **Start Quiz** - Click "Start Quiz" to begin a new trivia session
3. **Answer Questions** - Select answers within the time limit (30 seconds per question)
4. **View Results** - See your score, correct/incorrect answers, and detailed breakdown
5. **Check Leaderboard** - Compare your performance with other users
6. **Profile Management** - View your statistics and quiz history

## 🏗️ Project Structure

```
quiz-app/
├── backend/
│   ├── config/
│   │   └── passport.js          # Passport configuration
│   ├── models/
│   │   ├── Users.js             # User model
│   │   ├── questions.js         # Question model
│   │   └── Quizzes.js           # Quiz model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── questions.js         # Question routes
│   │   └── quizzes.js           # Quiz routes
│   ├── app.js                   # Express app configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js         # API configuration
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Quiz.jsx         # Quiz interface
│   │   │   ├── Profile.jsx      # User profile
│   │   │   ├── Leaderboard.jsx  # Global leaderboard
│   │   │   └── AuthCallback.jsx # OAuth callback
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # App entry point
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🔐 Authentication

The application supports two authentication methods:

### Email/Password Authentication
- Secure registration with password hashing
- JWT-based session management
- Password validation and security measures

### Google OAuth Integration
- Seamless Google account integration
- Automatic account linking for existing users
- Secure OAuth 2.0 flow implementation

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback

### Quiz Management
- `POST /api/quizzes/start` - Start a new quiz
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes/:id/answer` - Submit quiz answer
- `GET /api/quizzes/leaderboard` - Get global leaderboard

### User Management
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## 🏆 Scoring System

The scoring algorithm takes into account:
- **Accuracy** - Correct answers receive full points
- **Speed** - Faster answers receive bonus points
- **Difficulty** - Harder questions offer more points
- **Consistency** - Streak bonuses for consecutive correct answers

## 🎨 UI/UX Design

- **Dark Theme** - Modern dark mode design for comfortable viewing
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Engaging transitions and micro-interactions
- **Intuitive Navigation** - Clear user flow and navigation patterns
- **Accessibility** - WCAG compliant design elements

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables
2. Configure MongoDB Atlas
3. Deploy using your preferred platform

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Developer

Created with ❤️ by **Berat Doğan**

- GitHub: [@BeratDgan](https://github.com/BeratDgan)
- LinkedIn: [Berat Doğan](https://linkedin.com/in/beratdogan-)


⭐ **Star this repository if you found it helpful!** ⭐

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import './config/passport.js';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import quizzesRoutes from './routes/quizzes.js';


dotenv.config();


const app = express();

//cors middleware to allow cross-origin requests
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
}));

// Session middleware for passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// express.json() middleware to parse JSON bodies
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/questions', questionRoutes);

app.use('/api/quizzes', quizzesRoutes);

app.use('/api/quizzes', quizzesRoutes);


const PORT = process.env.PORT;

// Set strictQuery to false to suppress deprecation warning
mongoose.set('strictQuery', false);

//Connect to MongoDB using the connection string from .env file
mongoose.connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//promise block to handle the connection
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
}); 


//for checking server working
app.get('/', (req, res) => {
    res.send('API is running');
});

//listen requests coming from the port
//when the server starts, it will send a message to the console
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

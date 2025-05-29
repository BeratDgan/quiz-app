import express from "express";
import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

//register
const router = express.Router();



router.post("/register", async (req, res) => {
  try 
  {
    // body parser middleware to parse JSON bodies
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    // save the user to the database .save() method comes from mongoose
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "register error: ", error: error.message });
  }
});

//login

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }


        //create JWT token 
        // jwt uses user signing algorithm(header) information(payload) and a secret key to sign the token
        const token = jwt.sign({ userId: user._id, email:email }, process.env.JWT_SECRET, {
            // Setted token expiration time to 1 day
            expiresIn: "1d",
        }
    );
        //res.json() is exprress method to send a JSON response 
        res.json({ token, user: { email: user.email, username: user.username, id: user._id } });
    }
    catch (error) {
        res.status(500).json({ message: "Login error: ", error: error.message });
    }
}
);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {      // Generate JWT token for the user
      const token = jwt.sign(
        { 
          userId: req.user._id, 
          email: req.user.email,
          username: req.user.username 
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
        // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        email: req.user.email,
        username: req.user.username,
        id: req.user._id,
        avatar: req.user.avatar
      }))}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// Get user profile with detailed stats
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    // Get recent quiz results for this user
    const Quiz = await import('../models/Quizzes.js').then(module => module.default);
    const recentQuizzes = await Quiz.find({ userId: req.user.userId })
      .sort({ completedAt: -1 })
      .limit(10)
      .select('score timeSpent completedAt');

    const profileData = {
      ...user.toObject(),
      recentQuizzes,
      totalScore: user.totalScore || 0,
      quizzesCompleted: user.quizzesCompleted || 0,
      bestScore: user.bestScore || 0
    };

    res.json(profileData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// Get leaderboard with optional user ranking
router.get('/leaderboard', async (req, res) => {
  try {
    // Get all users sorted by total score
    const allUsers = await User.find()
      .select('username totalScore quizzesCompleted createdAt')
      .sort({ totalScore: -1, createdAt: 1 });

    let userRank = null;
    
    // Check if user is authenticated and get their rank
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userIndex = allUsers.findIndex(user => user._id.toString() === decoded.userId);
        if (userIndex !== -1) {
          userRank = {
            rank: userIndex + 1,
            totalScore: allUsers[userIndex].totalScore || 0,
            username: allUsers[userIndex].username
          };
        }
      } catch (jwtError) {
        // Token is invalid, but we still show leaderboard without user rank
      }
    }

    // Return top 50 users for leaderboard
    const leaderboard = allUsers.slice(0, 50);

    res.json({ 
      leaderboard,
      userRank,
      totalUsers: allUsers.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error: error.message });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}



// exporting the router that contains register and login routes to be used in app.js
export default router;




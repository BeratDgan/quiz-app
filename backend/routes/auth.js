import express from "express";
import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// exporting the router that contains register and login routes to be used in app.js
export default router;

    


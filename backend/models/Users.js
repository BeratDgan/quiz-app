import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password not required for Google OAuth users
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allow null values but ensure uniqueness when present
    },
    avatar: {
        type: String, // Google profile picture URL
    },
    totalScore: {
        type: Number,
        default: 0,
    },
    quizzesCompleted: {
        type: Number,
        default: 0,
    },
    bestScore: {
        type: Number,
        default: 0,
    },    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);
export default User;
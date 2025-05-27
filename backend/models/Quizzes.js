import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({

    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    }],
    correctNumber: { 
        type: Number,
        default: 0
    },
    wrongNumber: { 
        type: Number,
        default: 0
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        userAnswer: { type: String, required: true },
        grade: { type: Number, required: true }, // between 0-1 
        time: { type: Number, required: true }, 
        score: { type: Number, required: true }
    }],
    totalScore: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalWrong: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
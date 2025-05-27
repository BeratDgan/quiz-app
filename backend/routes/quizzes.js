import express from 'express';
import Quiz from '../models/Quizzes.js';

// Create a new router instance
const router = express.Router();

// title questions createdBy createdAt
// send quiz results 
router.post('/quizsend', async (req, res) => {
    try {
    const { title, questions, createdBy } = req.body;
    const newQuiz = new Quiz({
        title,
        questions,
        createdBy
    });
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
);

router.get('/quizfetch', async (req, res) => {
    try {
        const { quizId } = req.body;
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
});

export default router;
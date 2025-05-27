import express from 'express';
import Question from '../models/questions.js';


// Create a new router instance
const router = express.Router();


router.get('/random', async (req, res) => {
  try {
    let count = parseInt(req.query.count) || 10;
    const total = await Question.countDocuments();
    const random = Math.max(0, Math.floor(Math.random() * (total - count + 1)));
    const questions = await Question.find().skip(random).limit(count);
    if (!questions.length) return res.status(404).json({ message: 'No questions found' });
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
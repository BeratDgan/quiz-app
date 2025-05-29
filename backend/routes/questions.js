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
    
    // Format questions with mixed options for frontend
    const formattedQuestions = questions.map(q => ({
      _id: q._id,
      category: q.category,
      difficulty: q.difficulty,
      question: q.question,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
      options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
    }));
    
    res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
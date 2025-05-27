import express from 'express';
import Question from '../models/questions.js';


// Create a new router instance
const router = express.Router();


router.get('/questionfetch', async (req, res) => {
  try {

    // Generate a random number between 0 and 49 (assuming there are at least 50 questions)
    const random = Math.floor(Math.random() * 50);
    // Fetch a random question from the database
    const question = await Question.findOne().skip(random).exec();

    // If no question is found, return a 404 error
    if (!question) {
      return res.status(404).json({ message: 'No questions found' });
    }
    // Return the question as a JSON response
    res.status(200).json(question);
    
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
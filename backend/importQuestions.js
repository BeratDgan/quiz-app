import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import Question from './models/questions.js';

// Load environment variables from .env file
dotenv.config();

const DB_CONN = process.env.DB_CONN;

async function fetchAndSaveQuestions(){

    try {
    // with axios.get() get request to open trivia database
    const response = await axios.get('https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple');
    // with .data access to whole data and then .results to get the questions as an array
    const questions = response.data.results;

    // Format the questions to match the schema
    const formattedQuestions = questions.map(q => ({
      category: q.category,
      type: q.type,
      difficulty: q.difficulty,
      question: q.question,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers
    }));
    
    // save to MongoDB
    await Question.insertMany(formattedQuestions);
    console.log('Questions imported successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Connect to MongoDB
mongoose.connect(DB_CONN)
  .then(() => {
    console.log('MongoDB connected');
    fetchAndSaveQuestions();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
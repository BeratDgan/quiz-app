import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Question from './models/questions.js';

dotenv.config();

const MONGODB_URI = process.env.DB_CONN;

async function clearQuestions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    const result = await Question.deleteMany({});
    console.log(`Questions collection cleared! Deleted ${result.deletedCount} documents.`);
    process.exit();
  } catch (err) {
    console.error('Error clearing questions:', err);
    process.exit(1);
  }
}

clearQuestions();
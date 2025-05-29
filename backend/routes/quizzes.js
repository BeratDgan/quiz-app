import express from 'express';
import Quiz from '../models/Quizzes.js';
import Question from '../models/questions.js';
import User from '../models/Users.js';

// Create a new router instance
const router = express.Router();



router.get('/quizfetch/:quizId', async (req, res) => {
    try {
        console.log('Quiz fetch request received for ID:', req.params.quizId);
        const { quizId } = req.params;
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


router.post('/start', async (req, res) => {
  try {
    console.log('Quiz start request received:', req.body);
    const { createdBy } = req.body;
    const count = 10;
    const total = await Question.countDocuments();
    const random = Math.max(0, Math.floor(Math.random() * (total - count + 1)));
    const questions = await Question.find().skip(random).limit(count);

    if (!questions.length) return res.status(404).json({ message: 'No questions found' });

    const questionIds = questions.map(q => q._id);
    const quiz = new Quiz({  questions: questionIds, createdBy });
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.patch('/:quizId/answer', async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questionId, userAnswer, time } = req.body;
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // grade calculation
    const grade = (userAnswer === question.correct_answer) ? 1 : 0; // istersen kısmi de ekle
    const n = 100 * grade;
    const k = 0.2;
    const e = 2.71828;
    const score = n * Math.pow(e, -k * time);    // add to answers array
    quiz.answers.push({ questionId, userAnswer, grade, time, score });
    // update totals
    quiz.totalScore += score;
    if (grade === 1) quiz.totalCorrect += 1;
    else quiz.totalWrong += 1;
    
    // Check if quiz is completed
    const isQuizCompleted = quiz.answers.length === quiz.questions.length;
    
    if (isQuizCompleted) {
      // Update user statistics
      await User.findByIdAndUpdate(quiz.createdBy, {
        $inc: { 
          totalScore: quiz.totalScore,
          quizzesCompleted: 1
        },
        $max: { bestScore: quiz.totalScore }
      });
    }
    
    await quiz.save();

    res.status(200).json({ grade, score, totalScore: quiz.totalScore, totalCorrect: quiz.totalCorrect, totalWrong: quiz.totalWrong });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
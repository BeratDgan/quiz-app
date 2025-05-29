import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Fade,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Home as HomeIcon,
  ArrowForward as NextIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../api/index.js';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#f59e0b',
    },
    background: {
      default: '#0f0f23',
      paper: '#1a1a2e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

const Quiz = () => {
  const navigate = useNavigate();
  const { user, updateUser, isAuthenticated, loading: authLoading } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState({
    totalScore: 0,
    totalCorrect: 0,
    totalWrong: 0,
    answers: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleNextQuestionRef = useRef();
  // Initialize quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        // Wait for auth context to be ready
        if (authLoading) {
          console.log('Auth context still loading...');
          return;
        }
        
        console.log('InitializeQuiz called with:', { isAuthenticated: isAuthenticated(), user, authLoading });
        
        if (!isAuthenticated() || !user) {
          console.log('Authentication check failed:', { isAuthenticated: isAuthenticated(), user });
          navigate('/login');
          return;
        }

        console.log('Starting quiz with user:', user);
        console.log('User ID:', user._id || user.id);
        console.log('Token:', localStorage.getItem('token'));
        
        // Get user ID - try different possible fields
        let userId = user._id || user.id || user.userId;
        if (!userId) {
          console.error('No user ID found in user object:', user);
          setError('User authentication error. Please login again.');
          setLoading(false);
          return;
        }
        
        console.log('Using user ID:', userId);
        
        // Start a new quiz
        const quizResponse = await quizAPI.startQuiz(userId);
        console.log('Quiz response:', quizResponse);
        
        if (!quizResponse.data) {
          console.error('No quiz data received');
          setError('Failed to create quiz. Please try again.');
          setLoading(false);
          return;
        }
        
        const newQuiz = quizResponse.data;
        setQuiz(newQuiz);

        console.log('Fetching quiz details for quiz ID:', newQuiz._id);
        // Fetch quiz details with questions
        const quizDetailsResponse = await quizAPI.getQuiz(newQuiz._id);
        console.log('Quiz details response:', quizDetailsResponse);
        
        if (!quizDetailsResponse.data) {
          console.error('No quiz details received');
          setError('Failed to load quiz details. Please try again.');
          setLoading(false);
          return;
        }
          const quizData = quizDetailsResponse.data;
        
        // Validate quiz data structure
        if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
          console.error('Invalid quiz data structure:', quizData);
          setError('Quiz has no questions. Please try again.');
          setLoading(false);
          return;
        }
        
        // Prepare questions without correct answers (security measure)
        const questionsWithoutAnswers = quizData.questions.map(q => {
          if (!q.question || !q.incorrect_answers || !q.correct_answer) {
            console.error('Invalid question structure:', q);
            return null;
          }
          
          return {
            _id: q._id,
            category: q.category,
            difficulty: q.difficulty,
            question: q.question,
            // Mix correct and incorrect answers randomly
            options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
          };
        }).filter(q => q !== null); // Remove any invalid questions

        if (questionsWithoutAnswers.length === 0) {
          console.error('No valid questions found');
          setError('No valid questions found. Please try again.');
          setLoading(false);
          return;
        }

        console.log('Prepared questions:', questionsWithoutAnswers);
        setQuestions(questionsWithoutAnswers);
        setQuestionStartTime(Date.now());
        setLoading(false);
        console.log('Quiz initialization completed successfully');
      } catch (error) {
        console.error('Error initializing quiz:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError('Failed to load quiz. Please try again.');
        setLoading(false);
      }
    };    initializeQuiz();
  }, [navigate, user, isAuthenticated, authLoading]);

  // Timer effect
  useEffect(() => {
    if (loading || quizCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out using ref
          setTimeout(() => {
            if (handleNextQuestionRef.current) {
              handleNextQuestionRef.current(true);
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, quizCompleted]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };  const handleNextQuestion = useCallback(async (timeExpired = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const timeTaken = (Date.now() - questionStartTime) / 1000; // Convert to seconds
      const answer = timeExpired ? '' : selectedAnswer; // Empty answer if time expired

      // Submit answer to backend
      const response = await quizAPI.answerQuestion(quiz._id, {
        questionId: currentQuestion._id,
        userAnswer: answer,
        time: timeTaken
      });

      const answerResult = response.data;
      
      // Store result for current question
      setResults(prev => ({
        ...prev,
        totalScore: answerResult.totalScore,
        totalCorrect: answerResult.totalCorrect,
        totalWrong: answerResult.totalWrong,
        answers: [...prev.answers, {
          question: currentQuestion.question,
          userAnswer: answer,
          isCorrect: answerResult.grade === 1,
          score: answerResult.score,
          timeTaken
        }]
      }));

      // Move to next question or complete quiz
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer('');
        setTimeLeft(30);
        setQuestionStartTime(Date.now());      } else {
        // Quiz completed
        setQuizCompleted(true);
        
        // Update user stats in context
        if (updateUser && user) {
          updateUser({
            ...user,
            totalScore: (user.totalScore || 0) + (answerResult.totalScore || 0),
            quizzesCompleted: (user.quizzesCompleted || 0) + 1,
            bestScore: Math.max(user.bestScore || 0, answerResult.totalScore || 0)
          });
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }  }, [quiz?._id, questions, currentQuestionIndex, selectedAnswer, questionStartTime, isSubmitting, updateUser, user]);

  // Update the ref with the current function
  handleNextQuestionRef.current = handleNextQuestion;

  const handleRestartQuiz = () => {
    window.location.reload(); // Reload to start fresh
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box textAlign="center">
            <LinearProgress sx={{ mb: 2, width: 300 }} />
            <Typography variant="body2" color="text.secondary">
              Loading quiz...
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Container maxWidth="sm">
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" color="error" gutterBottom>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {error}
              </Typography>
              <Button variant="contained" onClick={handleBackToHome}>
                Back to Home
              </Button>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  if (quizCompleted) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            py: 4,
          }}
        >
          <Container maxWidth="md">
            <Fade in timeout={1000}>
              <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
                <QuizIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Quiz Completed!
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Great job! Here are your results:
            </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, my: 4 }}>
                  <Chip 
                    icon={<CheckIcon />}
                    label={`Correct: ${results.totalCorrect}`}
                    color="success"
                    size="large"
                  />
                  <Chip 
                    icon={<CancelIcon />}
                    label={`Wrong: ${results.totalWrong}`}
                    color="error"
                    size="large"
                  />
                  <Chip 
                    label={`Score: ${Math.round(results.totalScore)}`}
                    color="primary"
                    size="large"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                  <Button 
                    variant="contained" 
                    onClick={handleRestartQuiz}
                    startIcon={<QuizIcon />}
                  >
                    Take Another Quiz
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleBackToHome}
                    startIcon={<HomeIcon />}
                  >
                    Back to Home
                  </Button>
                </Box>
              </Paper>
            </Fade>

            {/* Detailed Results */}
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', mb: 2 }}>
              Question Results:
            </Typography>
            {results.answers.map((answer, index) => (
              <Fade in timeout={1000 + index * 100} key={index}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {answer.isCorrect ? (
                        <CheckIcon sx={{ color: 'success.main', mt: 0.5 }} />
                      ) : (
                        <CancelIcon sx={{ color: 'error.main', mt: 0.5 }} />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Q{index + 1}:</strong> {answer.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your answer: {answer.userAnswer || 'No answer (time expired)'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Chip 
                            size="small" 
                            label={`${Math.round(answer.score)} points`}
                            color={answer.isCorrect ? 'success' : 'default'}
                          />
                          <Chip 
                            size="small" 
                            label={`${answer.timeTaken.toFixed(1)}s`}
                            color="info"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Top Navigation */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: 'rgba(15, 15, 35, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleBackToHome} sx={{ color: 'white' }}>
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TimerIcon sx={{ color: timeLeft <= 10 ? 'error.main' : 'text.secondary' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: timeLeft <= 10 ? 'error.main' : 'text.primary',
                fontWeight: 600,
                minWidth: 40
              }}
            >
              {timeLeft}s
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          pt: 10,
          pb: 4,
        }}
      >
        <Container maxWidth="md">
          {/* Progress Bar */}
          <Box sx={{ mb: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(45deg, #6366f1 30%, #f59e0b 90%)',
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Progress: {Math.round(progress)}%
            </Typography>
          </Box>

          <Fade in timeout={500}>
            <Paper sx={{ p: 4 }}>
              {/* Question Info */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={currentQuestion.category} 
                    size="small" 
                    color="primary"
                  />
                  <Chip 
                    label={currentQuestion.difficulty} 
                    size="small" 
                    color="secondary"
                  />
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                  sx={{ fontWeight: 600, lineHeight: 1.4 }}
                />
              </Box>

              {/* Answer Options */}
              <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={<span dangerouslySetInnerHTML={{ __html: option }} />}
                    sx={{
                      mb: 1,
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderColor: 'primary.main',
                      },
                      '& .MuiFormControlLabel-label': {
                        fontSize: '1.1rem',
                      }
                    }}
                  />
                ))}
              </RadioGroup>

              {/* Submit Button */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleNextQuestion(false)}
                  disabled={!selectedAnswer || isSubmitting}
                  endIcon={<NextIcon />}
                  sx={{
                    px: 6,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'rgba(99, 102, 241, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 
                   currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Quiz;

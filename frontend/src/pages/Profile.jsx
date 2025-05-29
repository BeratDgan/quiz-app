import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
  Alert,
  CircularProgress,
  Divider,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Quiz as QuizIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(26, 26, 46, 0.8)',
        },
      },
    },
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
  },
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3131/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          throw new Error('Failed to load profile data');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, navigate]);

  const calculateLevel = (score) => {
    return Math.floor(score / 100) + 1;
  };

  const calculateProgress = (score) => {
    const currentLevelScore = score % 100;
    return currentLevelScore;
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Navigation Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: 'rgba(15, 15, 35, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          pt: 10,
          pb: 4
        }}
      >
        <Container maxWidth="lg">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              {/* Header */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mb: 4,
                  background: 'rgba(26, 26, 46, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 3,
                      background: 'linear-gradient(45deg, #6366f1 30%, #f59e0b 90%)',
                      fontSize: '2rem'
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {user?.username}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                      <Chip
                        icon={<EmailIcon />}
                        label={user?.email}
                        variant="outlined"
                        sx={{ borderColor: 'primary.main' }}
                      />
                      <Chip
                        icon={<CalendarIcon />}
                        label={`Member since: ${formatDate(user?.createdAt)}`}
                        variant="outlined"
                        sx={{ borderColor: 'secondary.main' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Stats Grid */}
              <Grid container spacing={3}>
                {/* Total Score */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <StarIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                      <Typography variant="h4" component="div" gutterBottom>
                        {profileData?.totalScore || 0}
                      </Typography>                      <Typography variant="body1" color="text.secondary">
                        Total Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Level */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h4" component="div" gutterBottom>
                        {calculateLevel(profileData?.totalScore || 0)}
                      </Typography>                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Level
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(profileData?.totalScore || 0)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(45deg, #6366f1 30%, #f59e0b 90%)',
                            }
                          }}
                        />                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {calculateProgress(profileData?.totalScore || 0)}/100 points
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Quizzes Completed */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <QuizIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                      <Typography variant="h4" component="div" gutterBottom>
                        {profileData?.quizzesCompleted || 0}
                      </Typography>                      <Typography variant="body1" color="text.secondary">
                        Completed Quizzes
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Quiz History */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ p: 3 }}>                      <Typography variant="h5" gutterBottom>
                        Quiz History
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      {profileData?.recentQuizzes && profileData.recentQuizzes.length > 0 ? (
                        <Box>
                          {profileData.recentQuizzes.map((quiz, index) => (
                            <Box
                              key={quiz._id || index}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                mb: 2,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}
                            >
                              <Box>
                                <Typography variant="h6">
                                  Quiz #{index + 1}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(quiz.completedAt)}
                                </Typography>
                              </Box>
                              <Box textAlign="right">                                <Chip
                                  label={`${quiz.score} points`}
                                  color={quiz.score >= 80 ? 'success' : quiz.score >= 60 ? 'warning' : 'error'}
                                  sx={{ mb: 1 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {quiz.timeSpent}s
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box textAlign="center" py={4}>
                          <QuizIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            You haven't taken any quizzes yet
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<QuizIcon />}
                            onClick={() => navigate('/quiz')}
                            sx={{ mt: 2, background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)' }}
                          >                            Take Your First Quiz
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ p: 3 }}>                      <Typography variant="h6" gutterBottom>
                        Quick Actions
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<QuizIcon />}
                          onClick={() => navigate('/quiz')}
                          sx={{ background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)', '&:hover': { boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}
                        >                          Take Quiz
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<TrophyIcon />}
                          onClick={() => navigate('/leaderboard')}
                          sx={{ borderColor: 'secondary.main', color: 'secondary.main', '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.1)', transform: 'translateY(-2px)' }, transition: 'all 0.3s ease' }}
                        >                          Leaderboard
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  Badge,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  WorkspacePremium as PremiumIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3131/api/auth/leaderboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
        setUserRank(data.userRank);
      } else {
        throw new Error('Failed to load leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <TrophyIcon sx={{ color: '#FFD700', fontSize: '2rem' }} />;
      case 2:
        return <TrophyIcon sx={{ color: '#C0C0C0', fontSize: '1.8rem' }} />;
      case 3:
        return <TrophyIcon sx={{ color: '#CD7F32', fontSize: '1.6rem' }} />;
      default:
        return (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {rank}
          </Box>
        );
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return 'rgba(255, 255, 255, 0.7)';
    }
  };

  const formatDate = (dateString) => {    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
            Leaderboard
          </Typography>
          <IconButton
            color="inherit"
            onClick={fetchLeaderboard}
            disabled={loading}
          >
            <RefreshIcon />
          </IconButton>
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
        <Container maxWidth="md">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <Button color="inherit" size="small" onClick={fetchLeaderboard}>                  Try Again
                </Button>
              }
            >
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
                  borderRadius: 3,
                  textAlign: 'center'
                }}
              >
                <TrophyIcon sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom>                  Best Players
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Top performers in the quiz world
                </Typography>
              </Paper>

              {/* User's Current Rank */}
              {isAuthenticated && userRank && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 4,
                    background: 'rgba(99, 102, 241, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: 3
                  }}
                >                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Your Ranking
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      {getRankIcon(userRank.rank)}
                      <Box>
                        <Typography variant="h6">{user?.username}</Typography>                        <Typography variant="body2" color="text.secondary">
                          {userRank.totalScore} points
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`#${userRank.rank}`}
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </Paper>
              )}

              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
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
                >                  <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 4 }}>
                    Champions Podium
                  </Typography>
                  
                  <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="end" 
                    gap={2}
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {/* Second Place */}
                    {leaderboard[1] && (
                      <Box textAlign="center" sx={{ order: { xs: 2, sm: 1 } }}>
                        <Box
                          sx={{
                            height: 120,
                            width: 100,
                            background: 'linear-gradient(45deg, #C0C0C0 30%, #E8E8E8 90%)',
                            borderRadius: '12px 12px 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              mb: 1,
                              background: 'linear-gradient(45deg, #6366f1 30%, #f59e0b 90%)',
                            }}
                          >
                            {leaderboard[1].username?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold' }}>
                            #{2}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1" noWrap sx={{ maxWidth: 100 }}>
                          {leaderboard[1].username}
                        </Typography>                        <Typography variant="body2" color="text.secondary">
                          {leaderboard[1].totalScore} points
                        </Typography>
                      </Box>
                    )}

                    {/* First Place */}
                    {leaderboard[0] && (
                      <Box textAlign="center" sx={{ order: { xs: 1, sm: 2 } }}>
                        <Box
                          sx={{
                            height: 140,
                            width: 120,
                            background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
                            borderRadius: '12px 12px 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2,
                            position: 'relative'
                          }}
                        >
                          <PremiumIcon 
                            sx={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8, 
                              color: '#8B4513', 
                              fontSize: 20 
                            }} 
                          />
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              mb: 1,
                              background: 'linear-gradient(45deg, #6366f1 30%, #f59e0b 90%)',
                            }}
                          >
                            {leaderboard[0].username?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: 'black', fontWeight: 'bold' }}>
                            #{1}
                          </Typography>
                        </Box>
                        <Typography variant="h6" noWrap sx={{ maxWidth: 120 }}>
                          {leaderboard[0].username}
                        </Typography>                        <Typography variant="body2" color="text.secondary">
                          {leaderboard[0].totalScore} points
                        </Typography>
                      </Box>
                    )}

                    {/* Third Place */}
                    {leaderboard[2] && (
                      <Box textAlign="center" sx={{ order: { xs: 3, sm: 3 } }}>
                        <Box
                          sx={{
                            height: 100,
                            width: 90,
                            background: 'linear-gradient(45deg, #CD7F32 30%, #D2691E 90%)',
                            borderRadius: '12px 12px 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              mb: 1,
                              background: 'linear-gradient(45deg, #6366f1 30%, #f59e0b 90%)',
                            }}
                          >
                            {leaderboard[2].username?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                            #{3}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1" noWrap sx={{ maxWidth: 90 }}>
                          {leaderboard[2].username}
                        </Typography>                        <Typography variant="body2" color="text.secondary">
                          {leaderboard[2].totalScore} points
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              )}

              {/* Full Leaderboard */}
              <Paper
                elevation={0}
                sx={{
                  background: 'rgba(26, 26, 46, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3
                }}
              >
                <Box sx={{ p: 3 }}>                  <Typography variant="h5" gutterBottom>
                    Full Rankings
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Box>

                {leaderboard.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {leaderboard.map((player, index) => (
                      <ListItem
                        key={player._id || index}
                        sx={{
                          py: 2,
                          px: 3,
                          borderBottom: index < leaderboard.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                          backgroundColor: user?.username === player.username ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={getRankIcon(index + 1)}
                            overlap="circular"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                          >
                            <Avatar
                              sx={{
                                background: 'linear-gradient(45deg, #6366f1 30%, #f59e0b 90%)',
                                width: 48,
                                height: 48,
                              }}
                            >
                              {player.username?.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="h6" sx={{ color: getRankColor(index + 1) }}>
                                {player.username}
                              </Typography>
                              {user?.username === player.username && (
                                <Chip size="small" label="You" color="primary" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Total Score: {player.totalScore}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Quizzes: {player.quizzesCompleted || 0} • Member since: {formatDate(player.createdAt)}
                              </Typography>
                            </Box>
                          }
                        />

                        <Box textAlign="right">
                          <Typography variant="h5" sx={{ color: getRankColor(index + 1), fontWeight: 'bold' }}>
                            #{index + 1}
                          </Typography>
                          <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                            <StarIcon sx={{ color: 'secondary.main', fontSize: '1rem' }} />
                            <Typography variant="body2" color="text.secondary">
                              {player.totalScore}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={8}>
                    <TrophyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Leaderboard is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Take your first quiz to appear on the leaderboard!
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/quiz')}
                      sx={{
                        background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                      }}
                    >                      Start Taking Quizzes
                    </Button>
                  </Box>
                )}
              </Paper>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Leaderboard;

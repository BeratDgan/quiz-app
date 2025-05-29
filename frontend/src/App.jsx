import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Fade,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Leaderboard as LeaderboardIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AuthCallback from './pages/AuthCallback';

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
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
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
  },
});

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleStartQuiz = () => {
    if (!isAuthenticated()) {
      // User not logged in, redirect to login
      navigate('/login');
    } else {
      // User logged in, start quiz
      navigate('/quiz');
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
    handleMenuClose();
  };

  return (
    <>
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
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            Trivia Quiz
          </Typography>
          
          {isAuthenticated() ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Welcome, {user?.username}!
              </Typography>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleProfile}>
                  <PersonIcon sx={{ mr: 2 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLeaderboard}>
                  <LeaderboardIcon sx={{ mr: 2 }} />
                  Leaderboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{ 
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                Login
              </Button>
              <Button 
                variant="outlined"
                startIcon={<RegisterIcon />}
                onClick={() => navigate('/register')}
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': { 
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)'
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          padding: 0
        }}
      >
        {/* Background Effects */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            left: '-10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <Container 
          maxWidth={false}
          sx={{ 
            position: 'relative', 
            pt: 16, 
            pb: 8,
            px: { xs: 2, sm: 4, md: 8 },
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
          }}
        >
          {/* Hero Section */}
          <Fade in timeout={1000}>
            <Box 
              textAlign="center" 
              sx={{ 
                maxWidth: 800, 
                mx: 'auto',
                width: '100%'
              }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #6366f1 30%, #f59e0b 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
                }}
              >
                Trivia Quiz Challenge
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary" 
                gutterBottom 
                sx={{ 
                  mb: 6, 
                  mx: 'auto',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  lineHeight: 1.6
                }}
              >
                Test your knowledge and challenge yourself with our exciting quiz platform!
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                justifyContent: 'center', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center'
              }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<QuizIcon />}
                  onClick={handleStartQuiz}
                  sx={{ 
                    px: 6, 
                    py: 2,
                    background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    fontSize: '1.1rem',
                    minWidth: 200,
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Start Quiz
                </Button>
                
                {isAuthenticated() && (
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<LeaderboardIcon />}
                    onClick={() => navigate('/leaderboard')}
                    sx={{ 
                      px: 6, 
                      py: 2,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: '1.1rem',
                      minWidth: 200,
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}                    >
                      Leaderboard
                    </Button>
                )}
                
                {!isAuthenticated() && (
                  <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                      px: 6, 
                      py: 2,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: '1.1rem',
                      minWidth: 200,
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    How to Play
                  </Button>
                )}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App

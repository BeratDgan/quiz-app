import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=Google login failed');
      return;
    }

    if (token) {
      try {
        // Decode token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.userId,
          email: payload.email,
          username: payload.username
        };
        
        login(token, user);
        navigate('/');
      } catch (error) {
        console.error('Token decode error:', error);
        navigate('/login?error=Login failed');
      }
    } else {
        navigate('/login?error=Token not found');
    }
  }, [searchParams, login, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      }}
    >
      <CircularProgress size={60} sx={{ color: '#6366f1', mb: 3 }} />      <Typography variant="h6" sx={{ color: 'white' }}>
        Logging in...
      </Typography>
    </Box>
  );
};

export default AuthCallback;

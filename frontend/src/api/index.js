import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3131/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3131';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Quiz API calls
export const quizAPI = {
  startQuiz: (userId) => api.post('/quizzes/start', { createdBy: userId }),
  getQuiz: (quizId) => api.get(`/quizzes/quizfetch/${quizId}`),
  answerQuestion: (quizId, answerData) => api.patch(`/quizzes/${quizId}/answer`, answerData),
};

// Questions API calls
export const questionAPI = {
  getRandomQuestions: (count = 10) => api.get(`/questions/random?count=${count}`),
};

// OAuth URLs
export const oauthURL = {
  google: `${BACKEND_URL}/api/auth/google`
};

export default api;

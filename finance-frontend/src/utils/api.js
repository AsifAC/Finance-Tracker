import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV 
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      error.userMessage = 'Cannot connect to backend server. Please make sure the backend is running on http://localhost:5000';
    } else if (error.code === 'ETIMEDOUT') {
      error.userMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.response) {
      error.userMessage = error.response.data?.error || `Server error: ${error.response.status}`;
    } else if (error.request) {
      error.userMessage = 'No response from server. Please check if the backend is running.';
    } else {
      error.userMessage = error.message || 'Unknown error occurred.';
    }
    
    return Promise.reject(error);
  }
);

export default api;


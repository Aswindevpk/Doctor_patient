import axios from 'axios';

const API_URL = 'https://localhost:8000/api/'; // Replace with your Django API base URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach the access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

  
export default api;
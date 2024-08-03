// api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/'; // Replace with your Django API base URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const formApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  }
});

const attachTokenToRequest = (config) => {
  const token = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token.access}`;
  }
  return config;
};

// Request interceptor to attach the access token to headers
api.interceptors.request.use(attachTokenToRequest, (error) => Promise.reject(error));
formApi.interceptors.request.use(attachTokenToRequest, (error) => Promise.reject(error));

export { api, formApi };

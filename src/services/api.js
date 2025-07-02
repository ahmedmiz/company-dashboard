import axios from 'axios';


// API Service
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_BASE_URL,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `${token}`;

    }
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

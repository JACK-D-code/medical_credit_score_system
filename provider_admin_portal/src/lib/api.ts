import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect based on current URL path scope
            if (window.location.pathname.includes('/admin')) {
                window.location.href = '/admin-login';
            } else {
                window.location.href = '/provider-login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

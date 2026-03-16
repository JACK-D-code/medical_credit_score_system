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
        const originalRequest = error.config;

        // Prevent redirect loop if the user is already on the login page or trying to log in
        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest.url?.includes('/auth/login')
        ) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/patient-login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    sendOtp: (identifier: string) => api.post('/auth/send-otp', { identifier }),
    verifyOtp: (identifier: string, otp: string) => api.post('/auth/verify-otp', { identifier, otp }),
};

export default api;

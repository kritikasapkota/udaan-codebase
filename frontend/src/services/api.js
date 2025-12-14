import axios from 'axios';

// Get API URL from environment or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/me', userData),
};

// FLIGHTS
export const flightService = {
  search: (params) => api.get('/flights/search', { params }),
  getById: (id) => api.get(`/flights/${id}`),
};

// BOOKINGS
export const bookingService = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancelBooking: (pnr) => api.put(`/bookings/${pnr}/cancel`),
  downloadTicket: async (pnr) => {
    const response = await api.get(`/bookings/${pnr}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// WALLET
export const walletService = {
  getBalance: () => api.get('/wallet'),
  addFunds: (amount) => api.post('/wallet/add', { amount }),
  getTransactions: () => api.get('/wallet/history'),
};

export default api;

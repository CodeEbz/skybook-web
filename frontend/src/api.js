import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api' });

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

export const getFlights = () => API.get('/flights');
export const getOrigins = () => API.get('/flights/origins');
export const getDestinations = () => API.get('/flights/destinations');
export const addFlight = (data) => API.post('/flights', data);
export const deleteFlight = (id) => API.delete(`/flights/${id}`);

export const getMyBookings = () => API.get('/bookings/my');
export const getAvailableSeats = (flightId) => API.get(`/bookings/seats/${flightId}`);
export const createBooking = (data) => API.post('/bookings', data);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

export const findBooking = (id) => API.get(`/checkin/${id}`);
export const confirmCheckIn = (id) => API.put(`/checkin/${id}/confirm`);

export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);

export const getAllBookings = () => API.get('/admin/bookings');
export const getAllUsers = () => API.get('/admin/users');

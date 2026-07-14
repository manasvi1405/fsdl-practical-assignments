import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Plan
export const createPlan = (data) => API.post('/plan/create', data);
export const getPlan = () => API.get('/plan');

// Tasks
export const updateTask = (taskId, data) => API.put(`/task/${taskId}`, data);
export const rescheduleTasks = () => API.post('/task/reschedule');
export const getTodayTasks = () => API.get('/task/today');
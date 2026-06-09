import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  signin: (data) => api.post('/auth/signin', data),
  verify: () => api.get('/auth/verify'),
};

// User API
export const userAPI = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Assessment API
export const assessmentAPI = {
  getAll: () => api.get('/assessments'),
  getById: (id) => api.get(`/assessments/${id}`),
  create: (data) => api.post('/assessments', data),
  update: (id, data) => api.put(`/assessments/${id}`, data),
  delete: (id) => api.delete(`/assessments/${id}`),
};

// Submission API
export const submissionAPI = {
  getAll: () => api.get('/submissions'),
  create: (data) => api.post('/submissions', data),
  update: (id, data) => api.put(`/submissions/${id}`, data),
};

// Stats API
export const statsAPI = {
  getStudentStats: () => api.get('/stats/student'),
  getInstructorStats: () => api.get('/stats/instructor'),
  getAdminStats: () => api.get('/stats/admin'),
};

// Profile API
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/password', data),
};

export default api;

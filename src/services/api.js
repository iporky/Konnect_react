import axios from 'axios';

// Create base axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Note: Normally set by the server in the response, adding here per request.
    'Access-Control-Allow-Origin': '*',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export the base API instance
export default api;

// Import and re-export specialized APIs
export { chatAPI } from './chatAPI';
export { buzzAPI } from './buzzAPI';
export { utilsAPI } from './utilsAPI';
export { buzzImagesAPI } from './buzzImagesAPI';
export { questionsAPI } from './questionsAPI';
export { usersAPI } from './usersAPI';
export { businessCardsAPI } from './businessCardsAPI';
export { feedbacksAPI } from './feedbacksAPI';

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await api.post('/api/auth/login', formData);
    return response.data;
  },

  signup: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key]);
    });
    
    const response = await api.post('/api/auth/signup', formData);
    return response.data;
  },

  googleLogin: async (accessToken) => {
    const response = await api.post('/api/auth/google', {
      access_token: accessToken
    });
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/api/auth/verify');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
};

// User/Profile API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });
    
    const response = await api.put('/api/user/profile', formData);
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/api/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Feedback API
export const feedbackAPI = {
  submitFeedback: async (feedbackData) => {
    const formData = new FormData();
    Object.keys(feedbackData).forEach(key => {
      formData.append(key, feedbackData[key]);
    });
    
    const response = await api.post('/api/feedback', formData);
    return response.data;
  },

  getFeedback: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/api/feedback?${params.toString()}`);
    return response.data;
  },
};

// Library API
export const libraryAPI = {
  getCourses: async () => {
    const response = await api.get('/api/library/courses');
    return response.data;
  },

  getCourse: async (courseId) => {
    const response = await api.get(`/api/library/courses/${courseId}`);
    return response.data;
  },

  updateProgress: async (courseId, lessonId, progress) => {
    const response = await api.post(`/api/library/courses/${courseId}/progress`, {
      lessonId,
      progress,
    });
    return response.data;
  },

  toggleBookmark: async (courseId) => {
    const response = await api.post(`/api/library/courses/${courseId}/bookmark`);
    return response.data;
  },
};

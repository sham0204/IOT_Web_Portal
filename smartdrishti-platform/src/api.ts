import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string; role?: string }) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    // Clear local storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return { message: 'Logged out successfully' };
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  },
};

// Project API functions
export const projectAPI = {
  getProjects: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  getProjectById: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  create: async (projectData: any) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },

  createProject: async (projectData: any) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },

  update: async (id: string, projectData: any) => {
    const response = await apiClient.put(`/projects/${id}`, projectData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};

// IoT API functions
export const iotAPI = {
  getDevices: async () => {
    const response = await apiClient.get('/iot/devices');
    return response.data;
  },

  getDeviceById: async (deviceId: string) => {
    const response = await apiClient.get(`/iot/devices/${deviceId}`);
    return response.data;
  },

  getSensorData: async (deviceId: string, hours: number = 24) => {
    const response = await apiClient.get(`/iot/sensor-data/${deviceId}?hours=${hours}`);
    return response.data;
  },

  getLatestSensorData: async (deviceId: string) => {
    const response = await apiClient.get(`/iot/sensor-data/latest/${deviceId}`);
    return response.data;
  },

  getDeviceStatus: async (deviceId: string) => {
    const response = await apiClient.get(`/iot/devices/${deviceId}/status`);
    return response.data;
  },

  predictDeviceFailure: async (deviceId: string) => {
    const response = await apiClient.get(`/iot/devices/${deviceId}/predict-failure`);
    return response.data;
  },
};

// Step API functions
export const stepAPI = {
  getSteps: async (projectId: string) => {
    const response = await apiClient.get(`/projects/${projectId}/steps`);
    return response.data;
  },
  getStep: async (projectId: string, stepId: string) => {
    const response = await apiClient.get(`/projects/${projectId}/steps/${stepId}`);
    return response.data;
  },
  
  create: async (projectId: string, stepData: any) => {
    const response = await apiClient.post(`/projects/${projectId}/steps`, stepData);
    return response.data;
  },

  update: async (stepId: string, stepData: any) => {
    const response = await apiClient.put(`/steps/${stepId}`, stepData);
    return response.data;
  },

  updateStep: async (stepId: string, stepData: any) => {
    const response = await apiClient.put(`/steps/${stepId}`, stepData);
    return response.data;
  },

  delete: async (stepId: string) => {
    const response = await apiClient.delete(`/steps/${stepId}`);
    return response.data;
  },

  uploadMedia: async (stepId: string, formData: FormData) => {
    const response = await apiClient.post(`/steps/${stepId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Export the base client for direct usage if needed
export default apiClient;
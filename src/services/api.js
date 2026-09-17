// frontend/src/services/api.js
import axios from 'axios';

import { APP_CONFIG } from '../config/index.js';

const API_URL = APP_CONFIG.apiBaseUrl;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token
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

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      //  No redirigir si estamos en login o si es una petición que no requiere auth
      if (currentPath.includes('/login')) {
        return Promise.reject(error);
      }
      
      //  No redirigir si la petición es a /auth/me (para no crear bucle)
      if (error.config?.url?.includes('/auth/me')) {
        return Promise.reject(error);
      }
      
      console.warn('⚠️ Token expirado o inválido, redirigiendo al login...');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permisos');
      localStorage.removeItem('tema_actual');
      
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
// frontend/src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5290/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log('✅ INTERCEPTOR RESPUESTA - Status:', response.status);
    console.log('✅ INTERCEPTOR RESPUESTA - Headers:', response.headers);
    console.log('✅ INTERCEPTOR RESPUESTA - Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ INTERCEPTOR ERROR - Status:', error.response?.status);
    console.error('❌ INTERCEPTOR ERROR - Message:', error.message);
    console.error('❌ INTERCEPTOR ERROR - Code:', error.code);
    console.error('❌ INTERCEPTOR ERROR - Full error:', error);
    
    // ⚠️ SOLO redirigir si NO estamos en la página de login
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      // Si estamos en login, NO redirigir
      if (currentPath !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
    (config) => {
        console.log('🔵 REQUEST INTERCEPTOR - Método:', config.method.toUpperCase());
        console.log('🔵 REQUEST INTERCEPTOR - URL:', config.url);
        console.log('🔵 REQUEST INTERCEPTOR - BaseURL:', config.baseURL);
        console.log('🔵 REQUEST INTERCEPTOR - Full URL:', config.baseURL + config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // console.log('🔍 Token en request:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
        // console.log('🔍 Request:', config.method.toUpperCase(), config.url, config.data);
        return config;
    },
    (error) => Promise.reject(error)
);

// console.log('🔍 API baseURL:', api.defaults.baseURL);

export default api;
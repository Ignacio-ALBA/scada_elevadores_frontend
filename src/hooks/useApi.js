// frontend/src/hooks/useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  // baseURL: APP_CONFIG.apiBaseUrl,
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
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

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api({ method, url, data });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Error en la petición';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
};
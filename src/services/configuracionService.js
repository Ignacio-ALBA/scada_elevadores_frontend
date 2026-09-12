// frontend/src/services/configuracionService.js
import api from './api';

export const configuracionService = {
    // Configuraciones Generales (Empresa)
    getGenerales: async () => {
        const response = await api.get('/configuraciones/generales');
        return response.data;
    },
    
    updateGenerales: async (config) => {
        const response = await api.put('/configuraciones/generales', config);
        return response.data;
    },
    
    // Configuraciones del Sistema - PÚBLICO (sin autenticación)
    getSistemaPublic: async () => {
        // Usamos fetch directo porque no necesita token
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5290/api';
        const response = await fetch(`${API_URL}/configuraciones/sistema/public`);
        if (!response.ok) {
            throw new Error('Error al cargar configuración del sistema');
        }
        const result = await response.json();
        // Extraer .data de la respuesta envuelta
        return result.data || result;
    },
    
    // Configuraciones del Sistema - PROTEGIDO (requiere autenticación)
    getSistema: async () => {
        const response = await api.get('/configuraciones/sistema');
        return response.data;
    },
    
    updateSistema: async (config) => {
        const response = await api.put('/configuraciones/sistema', config);
        return response.data;
    },
    
    // Colores
    getColores: async () => {
        const response = await api.get('/configuraciones/colores');
        return response.data;
    },
    
    updateColores: async (colores) => {
        const response = await api.put('/configuraciones/colores', colores);
        return response.data;
    },
};
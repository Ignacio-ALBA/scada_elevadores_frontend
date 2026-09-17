// frontend/src/services/eventoService.js
import api from './api';

export const eventoServices = {
    // Obtener eventos por elevador
    getByElevador: async (elevadorId, limit = 5) => {
        const response = await api.get(`/eventos/elevador/${elevadorId}?limit=${limit}`);
        return response.data;
    },
    
    // Obtener todos los eventos
    getAll: async (params = {}) => {
        const response = await api.get('/eventos/', { params });
        return response.data;
    },
    
    // Obtener eventos filtrados
    getFiltered: async (params = {}) => {
        const response = await api.get('/eventos/filtered', { params });
        return response.data;
    }
};
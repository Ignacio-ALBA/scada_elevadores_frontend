// frontend/src/services/elevadorService.js
import api from './api';

export const elevadorService = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.edificio_id) queryParams.append('edificio_id', params.edificio_id);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/elevadores/?${queryParams.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/elevadores/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/elevadores/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/elevadores/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/elevadores/${id}`);
        return response.data;
    },
};
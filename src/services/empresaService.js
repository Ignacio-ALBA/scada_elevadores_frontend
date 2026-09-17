// frontend/src/services/empresaService.js
import api from './api';

export const empresaService = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/empresa/?${queryParams.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/empresa/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/empresa/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/empresa/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/empresa/${id}`);
        return response.data;
    },

    getFirst: async () => {
        const response = await api.get('/empresa/');
        if (response.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    },
};
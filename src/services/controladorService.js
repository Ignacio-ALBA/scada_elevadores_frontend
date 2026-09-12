// frontend/src/services/controladorService.js
import api from './api';

export const controladorService = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.edificio_id) queryParams.append('edificio_id', params.edificio_id);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/controladores/?${queryParams.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/controladores/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/controladores/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/controladores/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/controladores/${id}`);
        return response.data;
    },
};
// frontend/src/services/cabinaService.js
import api from './api';

export const cabinaService = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.elevador_id) queryParams.append('elevador_id', params.elevador_id);
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/cabinas/?${queryParams.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/cabinas/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/cabinas/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/cabinas/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/cabinas/${id}`);
        return response.data;
    },
};
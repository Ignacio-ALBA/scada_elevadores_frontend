// frontend/src/services/parametroCabinaService.js
import api from './api';

export const parametroCabinaService = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.cabina_id) queryParams.append('cabina_id', params.cabina_id);
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/parametros-cabina/?${queryParams.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/parametros-cabina/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/parametros-cabina/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/parametros-cabina/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/parametros-cabina/${id}`);
        return response.data;
    },

    getByConfiguracion: async (configId) => {
        const response = await api.get(`/parametros-cabina/configuracion/${configId}`);
        return response.data;
    },
};
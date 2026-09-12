// frontend/src/services/parametroElevadorService.js
import api from './api';

export const parametroElevadorService = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.elevador_id) queryParams.append('elevador_id', params.elevador_id);
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/parametros-elevador/?${queryParams.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/parametros-elevador/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/parametros-elevador/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/parametros-elevador/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/parametros-elevador/${id}`);
        return response.data;
    },

    getByConfiguracion: async (configId) => {
        const response = await api.get(`/parametros-elevador/configuracion/${configId}`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/parametros-elevador/${id}`, data);
        return response.data;
    },
};
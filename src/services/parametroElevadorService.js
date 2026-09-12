// frontend/src/services/parametroElevadorService.js
import api from './api';

export const parametroElevadorService = {
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.elevador_id) queryParams.append('elevador_id', params.elevador_id);
            if (params.activo !== undefined) queryParams.append('activo', params.activo);
            if (params.limit) queryParams.append('limit', params.limit);
            else queryParams.append('limit', 10);
            if (params.page) queryParams.append('page', params.page);
            else queryParams.append('page', 1);
            
            const response = await api.get(`/parametros-elevador/?${queryParams.toString()}`);
            
            // Patrón: response.data = { success, data: { data: [...], totalCount, ... } }
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                return response.data.data.data;
            }
            
            // Fallback: si response.data es un array (compatibilidad)
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            console.warn('⚠️ parametroElevadorService.getAll() - estructura inesperada:', response.data);
            return [];
        } catch (error) {
            console.error('❌ Error en parametroElevadorService.getAll():', error);
            throw error;
        }
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
// frontend/src/services/controladorService.js
import api from './api';

export const controladorService = {
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.activo !== undefined) queryParams.append('activo', params.activo);
            if (params.edificio_id) queryParams.append('edificio_id', params.edificio_id);
            if (params.limit) queryParams.append('limit', params.limit);
            else queryParams.append('limit', 10);
            if (params.page) queryParams.append('page', params.page);
            else queryParams.append('page', 1);
            
            const response = await api.get(`/controladores/?${queryParams.toString()}`);
            
            // Patrón: response.data = { success, data: { data: [...], totalCount, ... } }
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                return response.data.data.data;
            }
            
            // Fallback: si response.data es un array (compatibilidad)
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            console.warn('⚠️ controladorService.getAll() - estructura inesperada:', response.data);
            return [];
        } catch (error) {
            console.error('❌ Error en controladorService.getAll():', error);
            throw error;
        }
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
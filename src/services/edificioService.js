import api from './api';

export const edificioService = {
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.activo !== undefined) queryParams.append('activo', params.activo);
            if (params.empresa_id) queryParams.append('empresa_id', params.empresa_id);
            if (params.limit) queryParams.append('limit', params.limit);
            else queryParams.append('limit', 10);
            if (params.page) queryParams.append('page', params.page);
            else queryParams.append('page', 1);
            
            const response = await api.get(`/edificios/?${queryParams.toString()}`);
            
            // Patrón: response.data = { success, data: { data: [...], totalCount, ... } }
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                return response.data.data.data;
            }
            
            // Fallback: si response.data es un array (compatibilidad)
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            console.warn('⚠️ edificioService.getAll() - estructura inesperada:', response.data);
            return [];
        } catch (error) {
            console.error('❌ Error en edificioService.getAll():', error);
            throw error;
        }
    },

    getById: async (id) => {
        const response = await api.get(`/edificios/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/edificios/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/edificios/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/edificios/${id}`);
        return response.data;
    },
};
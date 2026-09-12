// frontend/src/services/alarmasService.js
import api from './api';

export const alarmasService = {
    // Obtener todas las alarmas
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.limit) queryParams.append('limit', params.limit);
            else queryParams.append('limit', 10);
            if (params.page) queryParams.append('page', params.page);
            else queryParams.append('page', 1);
            if (params.activo !== undefined) queryParams.append('activo', params.activo);
            
            const response = await api.get(`/alarmas/?${queryParams.toString()}`);
            
            // Patrón: response.data = { success, data: { data: [...], totalCount, ... } }
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                return response.data.data.data;
            }
            
            // Fallback: si response.data es un array (compatibilidad)
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            console.warn('⚠️ alarmasService.getAll() - estructura inesperada:', response.data);
            return [];
        } catch (error) {
            console.error('❌ Error en alarmasService.getAll():', error);
            throw error;
        }
    },

    // Obtener alarmas activas
    getActivas: async (params = {}) => {
        const response = await api.get('/alarmas/activas', { params });
        return response.data;
    },

    // Obtener una alarma por ID
    getById: async (id) => {
        const response = await api.get(`/alarmas/${id}`);
        return response.data;
    },

    // Crear una alarma
    create: async (data) => {
        const response = await api.post('/alarmas/', data);
        return response.data;
    },

    // Confirmar alarma
    confirmar: async (id, data = {}) => {
        const response = await api.patch(`/alarmas/${id}/confirmar`, data);
        return response.data;
    },

    // Resolver alarma
    resolver: async (id, data = {}) => {
        const response = await api.patch(`/alarmas/${id}/resolver`, data);
        return response.data;
    },

    // Eliminar alarma
    delete: async (id) => {
        const response = await api.delete(`/alarmas/${id}`);
        return response.data;
    },

    // Actualizar alarma
    update: async (id, data) => {
        const response = await api.put(`/alarmas/${id}`, data);
        return response.data;
    },

    // Obtener estadísticas de alarmas
    getEstadisticas: async (params = {}) => {
        const response = await api.get('/alarmas/estadisticas', { params });
        return response.data;
    }
};
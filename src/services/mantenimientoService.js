// frontend/src/services/mantenimientoService.js
import api from './api';

export const mantenimientoService = {
    // Obtener todos los mantenimientos
    getAll: async (params = {}) => {
        const response = await api.get('/mantenimiento/', { params });
        return response.data;
    },

    // Obtener mantenimiento por ID
    getById: async (id) => {
        const response = await api.get(`/mantenimiento/${id}`);
        return response.data;
    },

    // Crear un mantenimiento
    create: async (data) => {
        const response = await api.post('/mantenimiento/', data);
        return response.data;
    },

    // Actualizar un mantenimiento
    update: async (id, data) => {
        const response = await api.put(`/mantenimiento/${id}`, data);
        return response.data;
    },

    // Completar un mantenimiento
    completar: async (id, data = {}) => {
        const response = await api.patch(`/mantenimiento/${id}/completar`, data);
        return response.data;
    },

    // Cancelar un mantenimiento
    cancelar: async (id, data = {}) => {
        const response = await api.patch(`/mantenimiento/${id}/cancelar`, data);
        return response.data;
    },

    // Obtener mantenimientos por elevador
    getByElevador: async (elevadorId, params = {}) => {
        const response = await api.get(`/mantenimiento/elevador/${elevadorId}`, { params });
        return response.data;
    },

    // Obtener estadísticas de mantenimiento
    getEstadisticas: async (params = {}) => {
        // console.log('🔍 [Service] getEstadisticas - URL:', '/mantenimiento/estadisticas');
        // console.log('🔍 [Service] getEstadisticas - Params:', params);
        try {
            const response = await api.get('/mantenimiento/estadisticas', { params });
            // console.log('🔍 [Service] getEstadisticas - Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('🔍 [Service] getEstadisticas - Error:', error);
            throw error;
        }
    },

    // Eliminar un mantenimiento
    delete: async (id) => {
        const response = await api.delete(`/mantenimiento/${id}`);
        return response.data;  // Devolver data
    },
};
// frontend/src/services/alarmasService.js
import api from './api';

export const alarmasService = {
    // Obtener todas las alarmas
    getAll: async (params = {}) => {
        const response = await api.get('/alarmas/', { params });
        return response.data;
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
    },

    // Obtener alarmas por elevador
    getByElevador: async (elevadorId, limit = 5) => {
        const response = await api.get(`/alarmas/elevador/${elevadorId}?limit=${limit}`);
        return response.data;
    },
};
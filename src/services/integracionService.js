import api from './api';

export const integracionService = {
    // Obtener todas las integraciones
    getAll: async () => {
        const response = await api.get('/integraciones/');
        return response.data;
    },

    // Obtener una integración por ID
    getById: async (id) => {
        const response = await api.get(`/integraciones/${id}`);
        return response.data;
    },

    // Crear una nueva integración
    create: async (data) => {
        const response = await api.post('/integraciones/', data);
        return response.data;
    },

    // Actualizar una integración
    update: async (id, data) => {
        const response = await api.put(`/integraciones/${id}`, data);
        return response.data;
    },

    // Eliminar una integración
    delete: async (id) => {
        const response = await api.delete(`/integraciones/${id}`);
        return response.data;
    },

    // Activar/Desactivar una integración
    toggle: async (id) => {
        const response = await api.patch(`/integraciones/${id}/toggle`);
        return response.data;
    },
};
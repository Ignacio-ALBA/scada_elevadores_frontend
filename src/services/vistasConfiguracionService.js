// frontend/src/services/vistasConfiguracionService.js
import api from './api';

export const vistasConfiguracionService = {
    // Obtener todas las vistas
    getAll: async (params = {}) => {
        const response = await api.get('/vistas-configuracion/', { params });
        return response.data;
    },

    // Obtener vistas activas
    getActivas: async () => {
        const response = await api.get('/vistas-configuracion/activas');
        return response.data;
    },

    // Obtener una vista por ID
    getById: async (id) => {
        const response = await api.get(`/vistas-configuracion/${id}`);
        return response.data;
    },

    // Crear una vista
    create: async (data) => {
        const response = await api.post('/vistas-configuracion/', data);
        return response.data;
    },

    // Actualizar una vista
    update: async (id, data) => {
        const response = await api.put(`/vistas-configuracion/${id}`, data);
        return response.data;
    },

    // Desactivar una vista
    delete: async (id) => {
        const response = await api.delete(`/vistas-configuracion/${id}`);
        return response.data;
    },

    // Reactivar una vista
    reactivar: async (id) => {
        const response = await api.patch(`/vistas-configuracion/${id}/reactivar`);
        return response.data;
    },

    // Subir imagen para icono de vista
    uploadIcono: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/vistas-configuracion/upload-icono', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
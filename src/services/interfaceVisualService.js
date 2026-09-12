import api from './api';

export const interfaceVisualService = {
    // Obtener todas las interfaces
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.tipo) queryParams.append('tipo', params.tipo);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/interfaces-visuales/?${queryParams.toString()}`);
        return response.data.data || response.data;
    },

    // Obtener una interfaz por ID
    getById: async (id) => {
        const response = await api.get(`/interfaces-visuales/${id}`);
        return response.data.data || response.data;
    },

    // Crear una nueva interfaz
    create: async (data) => {
        const response = await api.post('/interfaces-visuales/', data);
        return response.data;
    },

    // Actualizar una interfaz
    update: async (id, data) => {
        const response = await api.put(`/interfaces-visuales/${id}`, data);
        return response.data;
    },

    // Eliminar (desactivar) una interfaz
    delete: async (id) => {
        const response = await api.delete(`/interfaces-visuales/${id}`);
        return response.data;
    },
};
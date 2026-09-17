import api from './api';

export const variableScadaService = {
    // Obtener todas las variables
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.plc) queryParams.append('plc', params.plc);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/variables-scada/?${queryParams.toString()}`);
        const paginated = response.data?.data;
        return {
            data: paginated?.data || [],
            totalCount: paginated?.totalCount || 0,
            pageNumber: paginated?.pageNumber || 1,
            pageSize: paginated?.pageSize || 10,
            totalPages: paginated?.totalPages || 0
        };
    },

    // Obtener una variable por ID
    getById: async (id) => {
        const response = await api.get(`/variables-scada/${id}`);
        return response.data;
    },

    // Crear una nueva variable
    create: async (data) => {
        const response = await api.post('/variables-scada/', data);
        return response.data;
    },

    // Actualizar una variable
    update: async (id, data) => {
        const response = await api.put(`/variables-scada/${id}`, data);
        return response.data;
    },

    // Eliminar (desactivar) una variable
    delete: async (id) => {
        const response = await api.delete(`/variables-scada/${id}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/variables-scada/${id}`);
        return response.data;
    },
};
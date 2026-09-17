import api from './api';

export const edificioService = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.empresa_id) queryParams.append('empresa_id', params.empresa_id);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/edificios/?${queryParams.toString()}`);
        const paginated = response.data?.data;
        return {
            data: paginated?.data || [],
            totalCount: paginated?.totalCount || 0,
            pageNumber: paginated?.pageNumber || 1,
            pageSize: paginated?.pageSize || 10,
            totalPages: paginated?.totalPages || 0
        };
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
// frontend/src/services/tiposAlarmaService.js
import api from './api';

export const tiposAlarmaService = {
    getAll: async (params = {}) => {
        const response = await api.get('/tipos-alarma/');
        const paginated = response.data?.data;
        return {
            data: paginated?.data || [],
            totalCount: paginated?.totalCount || 0,
            pageNumber: paginated?.pageNumber || 1,
            pageSize: paginated?.pageSize || 10,
            totalPages: paginated?.totalPages || 0
        };
    }
};
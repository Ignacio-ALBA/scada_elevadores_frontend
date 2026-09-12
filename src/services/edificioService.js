import api from './api';

export const edificioService = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.empresa_id) queryParams.append('empresa_id', params.empresa_id);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/edificios/?${queryParams.toString()}`);
        
        // Manejar respuesta paginada (ResponseDto<PaginatedResponseDto<T>>)
        if (response.data?.data) {
            const paginatedData = response.data.data;
            
            // Si data es un array, es respuesta paginada
            if (Array.isArray(paginatedData)) {
                return paginatedData;
            }
            
            // Si data es un objeto con propiedad 'data' (PaginatedResponseDto)
            if (paginatedData.data && Array.isArray(paginatedData.data)) {
                return paginatedData.data;
            }
        }
        
        // Fallback: si response.data es un array (compatibilidad)
        if (Array.isArray(response.data)) {
            return response.data;
        }
        
        console.warn('⚠️ edificioService.getAll() - estructura inesperada:', response.data);
        return [];
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
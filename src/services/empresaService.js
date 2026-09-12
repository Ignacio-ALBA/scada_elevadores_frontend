// frontend/src/services/empresaService.js
import api from './api';

export const empresaService = {
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            
            // Parámetros de paginación
            if (params.limit) queryParams.append('limit', params.limit);
            else queryParams.append('limit', 10);
            
            if (params.page) queryParams.append('page', params.page);
            else queryParams.append('page', 1);
            
            // Filtros
            if (params.activo !== undefined) queryParams.append('activo', params.activo);
            
            const url = `/empresas?${queryParams.toString()}`;
            console.log('🌐 Haciendo GET request a:', url);
            
            const response = await api.get(url);
            console.log('✅ Response recibida:', response);
            console.log('✅ Response.data:', response.data);
            console.log('✅ Response.data.data:', response.data?.data);
            console.log('✅ Response.data.data.data:', response.data?.data?.data);
            
            // Manejar estructura paginada
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                console.log('✨ Empresas (estructura paginada):', response.data.data.data);
                return response.data.data.data;
            }
            
            // Fallback para estructura simple
            if (Array.isArray(response.data)) {
                console.log('✨ Empresas (estructura simple):', response.data);
                return response.data;
            }
            
            console.warn('⚠️ No se encontraron datos válidos', response.data);
            return [];
        } catch (error) {
            console.error('❌ ERROR en empresaService.getAll():', error);
            console.error('❌ Error.message:', error.message);
            console.error('❌ Error.response:', error.response);
            throw error;
        }
    },

    getById: async (id) => {
        const response = await api.get(`/empresas/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/empresas', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/empresas/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/empresas/${id}`);
        return response.data;
    },

    getFirst: async () => {
        const response = await api.get('/empresas');
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data[0];
        }
        if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            return response.data.data[0];
        }
        return null;
    },
};
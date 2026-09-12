// frontend/src/services/tiposAlarmaService.js
import api from './api';

export const tiposAlarmaService = {
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.limit) queryParams.append('limit', params.limit);
            else queryParams.append('limit', 10);
            if (params.page) queryParams.append('page', params.page);
            else queryParams.append('page', 1);
            if (params.activo !== undefined) queryParams.append('activo', params.activo);
            
            const response = await api.get(`/tipos-alarma/?${queryParams.toString()}`);
            
            // Patrón: response.data = { success, data: { data: [...], totalCount, ... } }
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                return response.data.data.data;
            }
            
            // Fallback: si response.data es un array (compatibilidad)
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            console.warn('⚠️ tiposAlarmaService.getAll() - estructura inesperada:', response.data);
            return [];
        } catch (error) {
            console.error('❌ Error en tiposAlarmaService.getAll():', error);
            throw error;
        }
    }
};
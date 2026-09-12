import api from './api';

export const integracionService = {
    // Obtener todas las integraciones
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.limit) queryParams.append('limit', params.limit);
            else queryParams.append('limit', 10);
            if (params.page) queryParams.append('page', params.page);
            else queryParams.append('page', 1);
            if (params.activo !== undefined) queryParams.append('activo', params.activo);
            
            const response = await api.get(`/integraciones/?${queryParams.toString()}`);
            
            // Patrón: response.data = { success, data: { data: [...], totalCount, ... } }
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                return response.data.data.data;
            }
            
            // Fallback: si response.data es un array (compatibilidad)
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            console.warn('⚠️ integracionService.getAll() - estructura inesperada:', response.data);
            return [];
        } catch (error) {
            console.error('❌ Error en integracionService.getAll():', error);
            throw error;
        }
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
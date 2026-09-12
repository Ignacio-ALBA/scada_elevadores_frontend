import api from './api';

export const variableScadaService = {
    // Obtener todas las variables
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.activo !== undefined) queryParams.append('activo', params.activo);
            if (params.plc) queryParams.append('plc', params.plc);
            if (params.limit) queryParams.append('limit', params.limit);
            else queryParams.append('limit', 10);
            if (params.page) queryParams.append('page', params.page);
            else queryParams.append('page', 1);
            
            const response = await api.get(`/variables-scada/?${queryParams.toString()}`);
            
            // Patrón: response.data = { success, data: { data: [...], totalCount, ... } }
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                return response.data.data.data;
            }
            
            // Fallback: si response.data es un array (compatibilidad)
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            console.warn('⚠️ variableScadaService.getAll() - estructura inesperada:', response.data);
            return [];
        } catch (error) {
            console.error('❌ Error en variableScadaService.getAll():', error);
            throw error;
        }
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
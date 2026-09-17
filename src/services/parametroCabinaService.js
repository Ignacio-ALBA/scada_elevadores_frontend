// frontend/src/services/parametroCabinaService.js
import api from './api';

export const parametroCabinaService = {
    getAll: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.cabina_id) queryParams.append('cabina_id', params.cabina_id);
        if (params.activo !== undefined) queryParams.append('activo', params.activo);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const response = await api.get(`/parametros-cabina/?${queryParams.toString()}`);
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
        const response = await api.get(`/parametros-cabina/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/parametros-cabina/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/parametros-cabina/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/parametros-cabina/${id}`);
        return response.data;
    },

    // VERSIÓN SIMPLE - Obtener todos y filtrar en frontend
    getByConfiguracion: async (configId) => {
        try {
            // Primero obtener las cabinas de la configuración
            const configResponse = await api.get(`/configuracion-ig/${configId}`);
            const config = configResponse.data;
            
            // Si no tiene cabinas, retornar array vacío
            if (!config.cabinas || config.cabinas.length === 0) {
                return [];
            }
            
            // Obtener IDs de cabinas
            const cabinasIds = config.cabinas.map(c => c.id_cabina);
            
            // Obtener TODOS los parámetros y filtrar
            const result = await parametroCabinaService.getAll({ activo: true });
            const filtered = result.data.filter(p => cabinasIds.includes(p.id_cabina));
            
            return filtered;
        } catch (error) {
            console.warn(`⚠️ Error obteniendo parámetros para configuración ${configId}:`, error.message);
            return [];
        }
    },
};
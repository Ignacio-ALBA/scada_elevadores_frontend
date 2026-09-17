    // frontend/src/services/eventosService.js
    import api from './api';

    export const eventosService = {
    // Obtener todos los eventos
    getAll: async (params = {}) => {
        const response = await api.get('/eventos/', { params });
        const paginated = response.data?.data;
        return {
            data: paginated?.data || [],
            totalCount: paginated?.totalCount || 0,
            pageNumber: paginated?.pageNumber || 1,
            pageSize: paginated?.pageSize || 10,
            totalPages: paginated?.totalPages || 0
        };
    },

    //  Obtener eventos con filtros (igual que Reportes)
    getAllWithFilters: async (fecha_desde, fecha_hasta, limit, offset, tipo) => {
        const params = { limit, offset };
        if (fecha_desde) params.fecha_desde = fecha_desde;
        if (fecha_hasta) params.fecha_hasta = fecha_hasta;
        if (tipo && tipo !== 'todos') params.tipo = tipo;
        const response = await api.get('/eventos/filtered', { params });
        const paginated = response.data?.data;
        return {
            data: paginated?.data || [],
            eventos: paginated?.data || [],
            totalCount: paginated?.totalCount || 0,
            total: paginated?.totalCount || 0,
            pageNumber: paginated?.pageNumber || 1,
            pageSize: paginated?.pageSize || 10,
            totalPages: paginated?.totalPages || 0
        };
    },

        // Obtener un evento por ID
        getById: async (id) => {
            const response = await api.get(`/eventos/${id}`);
            return response.data;
        },

        // Crear un evento
        create: async (data) => {
            const response = await api.post('/eventos/', data);
            return response.data;
        },

        // Obtener eventos por elevador
        getByElevador: async (elevadorId, params = {}) => {
            const response = await api.get(`/eventos/elevador/${elevadorId}`, { params });
            return response.data;
        },

        // Obtener estadísticas de eventos
        getEstadisticas: async (params = {}) => {
            const response = await api.get('/eventos/estadisticas', { params });
            return response.data;
        },

        // Eliminar un evento
        delete: async (id) => {
            const response = await api.delete(`/eventos/${id}`);
            return response.data;
        }
    };
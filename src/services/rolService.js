// frontend/src/services/rolService.js
import api from './api';

// Mapear camelCase (Backend .NET) a snake_case (Frontend)
const mapCamelToSnake = (camelObj) => {
    if (!camelObj) return null;
    const mapped = {
        id_rol: camelObj.idRol,
        nombre: camelObj.nombre,
        nivel_jerarquia: camelObj.nivelJerarquia,
        descripcion: camelObj.descripcion,
        activo: camelObj.activo,
        fecha_registro: camelObj.fechaRegistro,
        fecha_modificacion: camelObj.fechaModificacion,
        // Mantener también campos camelCase por si acaso
        ...camelObj
    };
    return mapped;
};

export const rolService = {
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
            
            const url = `/roles?${queryParams.toString()}`;
            console.log('🌐 Haciendo GET request a:', url);
            
            const response = await api.get(url);
            console.log('✅ Response recibida:', response);
            console.log('✅ Response.data.data:', response.data?.data);
            
            if (response.data?.data) {
                const paginatedData = response.data.data;
                
                // Mapear cada rol
                const mapped = paginatedData.map ? paginatedData.map(r => mapCamelToSnake(r)) : [];
                console.log('✨ Roles mapeados:', mapped);
                
                // Retornar con info de paginación
                return {
                    data: mapped,
                    totalCount: response.data.totalCount || mapped.length,
                    pageNumber: response.data.pageNumber || 1,
                    pageSize: response.data.pageSize || params.limit || 10,
                    totalPages: response.data.totalPages || 1
                };
            }
            console.warn('⚠️ No se encontraron datos en response.data.data', response.data);
            return {
                data: [],
                totalCount: 0,
                pageNumber: 1,
                pageSize: 10,
                totalPages: 0
            };
        } catch (error) {
            console.error('❌ ERROR en rolService.getAll():', error);
            throw error;
        }
    },

    getById: async (id) => {
        const response = await api.get(`/roles/${id}`);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    create: async (data) => {
        const response = await api.post('/roles', data);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    update: async (id, data) => {
        const response = await api.put(`/roles/${id}`, data);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    delete: async (id) => {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    },
};

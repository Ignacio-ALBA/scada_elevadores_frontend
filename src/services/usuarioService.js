// frontend/src/services/usuarioService.js
import api from './api';

// Mapear camelCase (Backend .NET) a snake_case (Frontend)
const mapCamelToSnake = (camelObj) => {
    if (!camelObj) return null;
    const mapped = {
        id_usuario: camelObj.idUsuario,
        id_rol: camelObj.idRol,
        nombre: camelObj.nombre,
        apellido_paterno: camelObj.apellidoPaterno,
        apellido_materno: camelObj.apellidoMaterno,
        username: camelObj.username,
        correo: camelObj.correo,
        telefono: camelObj.telefono,
        direccion: camelObj.direccion,
        activo: camelObj.activo,
        fecha_registro: camelObj.fechaRegistro,
        fecha_modificacion: camelObj.fechaModificacion,
        ultimo_acceso: camelObj.ultimoAcceso,
        intentos_fallidos: camelObj.intentosFallidos,
        bloqueado_hasta: camelObj.bloqueadoHasta,
        // Mantener también campos camelCase por si acaso
        ...camelObj
    };
    return mapped;
};

export const usuarioService = {
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
            if (params.id_rol) queryParams.append('idRol', params.id_rol);
            
            const url = `/usuarios?${queryParams.toString()}`;
            console.log('🌐 Haciendo GET request a:', url);
            
            const response = await api.get(url);
            console.log('✅ Response recibida:', response);
            console.log('✅ Response.data.data:', response.data?.data);
            
            if (response.data?.data) {
                const paginatedData = response.data.data;
                
                // paginatedData es un objeto con estructura: { data: [...usuarios], totalCount, pageNumber, etc }
                const usuariosArray = paginatedData.data || [];
                
                // Mapear cada usuario
                const mapped = usuariosArray.map(u => mapCamelToSnake(u));
                console.log('✨ Usuarios mapeados:', mapped);
                
                // Retornar con info de paginación
                return {
                    data: mapped,
                    totalCount: paginatedData.totalCount || 0,
                    pageNumber: paginatedData.pageNumber || 1,
                    pageSize: paginatedData.pageSize || params.limit || 10,
                    totalPages: paginatedData.totalPages || 1
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
            console.error('❌ ERROR en usuarioService.getAll():', error);
            throw error;
        }
    },

    getById: async (id) => {
        const response = await api.get(`/usuarios/${id}`);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    getByUsername: async (username) => {
        const response = await api.get(`/usuarios/username/${username}`);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    create: async (data) => {
        const response = await api.post('/usuarios', data);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    update: async (id, data) => {
        const response = await api.put(`/usuarios/${id}`, data);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    delete: async (id) => {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    },
};

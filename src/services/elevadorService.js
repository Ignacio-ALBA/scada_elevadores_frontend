// frontend/src/services/elevadorService.js
import api from './api';

// Mapear camelCase (Backend) a snake_case (Frontend)
const mapCamelToSnake = (camelObj) => {
    if (!camelObj) return null;
    const mapped = {
        id_elevador: camelObj.idElevador,
        codigo: camelObj.codigo,
        nombre: camelObj.nombre,
        tipo: camelObj.tipo,
        capacidad_personas: camelObj.capacidadPersonas,
        capacidad_kg: camelObj.capacidadKg,
        velocidad_nominal: camelObj.velocidadNominal,
        estado_operativo: camelObj.estadoOperativo,
        activo: camelObj.activo,
        nombre_corto: camelObj.nombreCorto,
        fecha_modificacion: camelObj.fechaModificacion,
        id_edificio: camelObj.idEdificio,
        modelo: camelObj.modelo,
        fabricante: camelObj.fabricante,
        piso_maximo: camelObj.pisoMaximo,
        piso_minimo: camelObj.pisoMinimo,
        anio_fabricacion: camelObj.anioFabricacion,
        fecha_instalacion: camelObj.fechaInstalacion,
        ultimo_mantenimiento: camelObj.ultimoMantenimiento,
        proximo_mantenimiento: camelObj.proximoMantenimiento,
        // Mantener también campos camelCase por si acaso
        ...camelObj
    };
    console.log('Elevador mapeado:', mapped); // Debug
    return mapped;
};

export const elevadorService = {
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
            if (params.edificio_id) queryParams.append('edificio_id', params.edificio_id);
            
            const url = `/elevadores?${queryParams.toString()}`;
            console.log('🌐 Haciendo GET request a:', url);
            
            const response = await api.get(url);
            console.log('✅ Response recibida:', response);
            console.log('✅ Response.data:', response.data);
            console.log('✅ Response.data.data:', response.data?.data);
            console.log('✅ Response.data.data.data:', response.data?.data?.data);
            
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                const mapped = response.data.data.data.map(e => mapCamelToSnake(e));
                console.log('✨ Elevadores mapeados:', mapped);
                return mapped;
            }
            console.warn('⚠️ No se encontraron datos en response.data.data.data', response.data);
            return [];
        } catch (error) {
            console.error('❌ ERROR en elevadorService.getAll():', error);
            console.error('❌ Error.message:', error.message);
            console.error('❌ Error.response:', error.response);
            console.error('❌ Error.code:', error.code);
            throw error;
        }
    },

    getById: async (id) => {
        const response = await api.get(`/elevadores/${id}`);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    create: async (data) => {
        const response = await api.post('/elevadores', data);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    update: async (id, data) => {
        const response = await api.put(`/elevadores/${id}`, data);
        return mapCamelToSnake(response.data?.data || response.data);
    },

    delete: async (id) => {
        const response = await api.delete(`/elevadores/${id}`);
        return response.data;
    },
};
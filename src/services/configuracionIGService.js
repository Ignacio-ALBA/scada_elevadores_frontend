// frontend/src/services/configuracionIGService.js
import api from './api';

export const configuracionIGService = {
    // Obtener todas las configuraciones
    getAll: async (params = {}) => {
        // console.log('🔍 Service - getAll con params:', params);
        const response = await api.get('/configuracion-ig/', { params });
        // console.log('🔍 Service - Respuesta recibida:', response.data);
        return response.data;
    },
    
    // Obtener una configuración por ID
    getById: async (id) => {
        const response = await api.get(`/configuracion-ig/${id}`);
        return response.data;
    },
    
    // Crear una configuración
    create: async (data) => {
        const response = await api.post('/configuracion-ig/', data);
        return response.data;
    },
    
    // Actualizar una configuración
    update: async (id, data) => {
        const response = await api.put(`/configuracion-ig/${id}`, data);
        return response.data;
    },
    
    // Eliminar (desactivar) una configuración
    delete: async (id) => {
        const response = await api.delete(`/configuracion-ig/${id}`);
        return response.data;
    },
    
    // Obtener interfaces activas para el menú
    getInterfacesActivas: async () => {
        const response = await api.get('/configuracion-ig/interfaces/activas');
        return response.data;
    },
    
    // Obtener datos completos de una interfaz
    getDatosInterfaz: async (configId) => {
        const response = await api.get(`/configuracion-ig/interfaces/${configId}/datos`);
        return response.data;
    },
    
    // Obtener elevadores disponibles
    getElevadoresDisponibles: async () => {
        const response = await api.get('/configuracion-ig/elevadores/disponibles');
        return response.data;
    },
    
    // Obtener cabinas de un elevador
    getCabinasPorElevador: async (elevadorId) => {
        const response = await api.get(`/configuracion-ig/cabinas/por-elevador/${elevadorId}`);
        return response.data;
    },

    updateOrden: async (id, orden) => {
        const response = await api.patch(`/configuracion-ig/${id}/orden`, { orden });
        return response.data;
    },

    reordenar: async (configuraciones) => {
        const response = await api.patch('/configuracion-ig/reordenar', { configuraciones });
        return response.data;
    },

    toggle: async (id) => {
        const response = await api.patch(`/configuracion-ig/${id}/toggle`);
        return response.data;
    },

    getDatosInterfaz: async (configId) => {
        const response = await api.get(`/configuracion-ig/interfaces/${configId}/datos`);
        return response.data;
    },
};
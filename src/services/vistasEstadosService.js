// frontend/src/services/vistasEstadosService.js
import api from './api';

export const vistasEstadosService = {
  // ============================================
  // ESTADOS CONFIGURABLES
  // ============================================
  
  // Obtener todos los estados
  getEstados: async (activo = null) => {
    try {
      const params = activo !== null ? { activo } : {};
      const response = await api.get('/vistas-estados/estados', { params });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estados:', error);
      return [];
    }
  },

  // Obtener un estado por ID
  getEstado: async (id) => {
    try {
      const response = await api.get(`/vistas-estados/estados/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estado:', error);
      return null;
    }
  },

  // Crear un estado
  createEstado: async (data) => {
    try {
      const response = await api.post('/vistas-estados/estados', data);
      return response.data;
    } catch (error) {
      console.error('Error creando estado:', error);
      throw error;
    }
  },

  // Actualizar un estado
  updateEstado: async (id, data) => {
    try {
      const response = await api.put(`/vistas-estados/estados/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando estado:', error);
      throw error;
    }
  },

  // Eliminar un estado
  deleteEstado: async (id) => {
    try {
      const response = await api.delete(`/vistas-estados/estados/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando estado:', error);
      throw error;
    }
  },

  // Reactivar un estado
  reactivarEstado: async (id) => {
    try {
      const response = await api.patch(`/vistas-estados/estados/${id}/reactivar`);
      return response.data;
    } catch (error) {
      console.error('Error reactivando estado:', error);
      throw error;
    }
  },

  // ============================================
  // ICONOS DE VISTA MEJORADA
  // ============================================

  // Obtener todos los iconos
  getIconos: async (vista = 'mejorada') => {
    try {
      const response = await api.get('/vistas-estados/iconos', { params: { vista } });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo iconos:', error);
      return [];
    }
  },

  // Obtener iconos por tipo
  getIconosPorTipo: async (tipo, vista = 'mejorada') => {
    try {
      const response = await api.get(`/vistas-estados/iconos/tipo/${tipo}`, { params: { vista } });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo iconos por tipo:', error);
      return [];
    }
  },

  // Crear un icono
  createIcono: async (data) => {
    try {
      const response = await api.post('/vistas-estados/iconos', data);
      return response.data;
    } catch (error) {
      console.error('Error creando icono:', error);
      throw error;
    }
  },

  // Actualizar un icono
  updateIcono: async (id, data) => {
    try {
      const response = await api.put(`/vistas-estados/iconos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando icono:', error);
      throw error;
    }
  },

  // Eliminar un icono
  deleteIcono: async (id) => {
    try {
      const response = await api.delete(`/vistas-estados/iconos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando icono:', error);
      throw error;
    }
  },

  // Subir imagen de icono (256x256)
  uploadIcono: async (file, tipo, nombre, vista = 'mejorada') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(
        `/vistas-estados/iconos/upload?tipo=${tipo}&nombre=${encodeURIComponent(nombre)}&vista=${vista}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (error) {
      console.error('Error subiendo icono:', error);
      throw error;
    }
  },
};
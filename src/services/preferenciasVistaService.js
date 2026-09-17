// frontend/src/services/preferenciasVistaService.js
import api from './api';

export const preferenciasVistaService = {
  // Obtener preferencias de un usuario para una vista específica
  getPreferencias: async (idUsuario, idVista) => {
    try {
      const response = await api.get(`/preferencias-vista/usuario/${idUsuario}/vista/${idVista}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo preferencias de vista:', error);
      return null;
    }
  },

  // Guardar preferencias
  guardarPreferencias: async (idUsuario, idVista, data) => {
    try {
      const response = await api.post(`/preferencias-vista`, {
        id_usuario: idUsuario,
        id_vista: idVista,
        ...data
      });
      return response.data;
    } catch (error) {
      console.error('Error guardando preferencias de vista:', error);
      return null;
    }
  },

  // Actualizar preferencias
  actualizarPreferencias: async (idUsuario, idVista, data) => {
    try {
      const response = await api.put(`/preferencias-vista/usuario/${idUsuario}/vista/${idVista}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando preferencias de vista:', error);
      return null;
    }
  },

  actualizarPosiciones: async (idUsuario, idVista, posiciones) => {
    try {
      const response = await api.put(
        `/preferencias-vista/usuario/${idUsuario}/vista/${idVista}/posiciones`,
        { posiciones_minimalista: posiciones }
      );
      return response.data;
    } catch (error) {
      console.error('Error actualizando posiciones:', error);
      return null;
    }
  }
};
import api from './api';
import { API_URL } from '../config';  // 

export const logsService = {
  // Obtener logs con paginación y filtros
  async getLogs(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.tipo && params.tipo !== 'todos') queryParams.append('tipo', params.tipo);
      if (params.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
      if (params.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
      if (params.usuario) queryParams.append('usuario', params.usuario);

      const url = `${API_URL}/logs?${queryParams.toString()}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error en getLogs:', error);
      throw error;
    }
  },

  // Obtener estadísticas de logs
  async getStats(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
      if (params.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);

      const url = `${API_URL}/logs/stats?${queryParams.toString()}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error en getStats:', error);
      // Retornar valores por defecto
      return {
        total: 0,
        login_exitosos: 0,
        logout: 0,
        navegaciones: 0,
        acciones: 0,
        errores: 0,
      };
    }
  },

  // Obtener un log específico
  async getLogById(id) {
    try {
      const response = await api.get(`${API_URL}/logs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error en getLogById:', error);
      throw error;
    }
  },

  // Exportar logs a CSV
  async exportCSV(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
      if (params.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
      if (params.tipo && params.tipo !== 'todos') queryParams.append('tipo', params.tipo);
      if (params.usuario) queryParams.append('usuario', params.usuario);

      const url = `${API_URL}/logs/export/csv?${queryParams.toString()}`;
      const response = await api.get(url, { responseType: 'blob' });
      
      // Descargar archivo
      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error en exportCSV:', error);
      throw error;
    }
  },

  // Exportar logs a PDF
  async exportPDF(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.fecha_desde) queryParams.append('fecha_desde', params.fecha_desde);
      if (params.fecha_hasta) queryParams.append('fecha_hasta', params.fecha_hasta);
      if (params.tipo && params.tipo !== 'todos') queryParams.append('tipo', params.tipo);
      if (params.usuario) queryParams.append('usuario', params.usuario);

      const url = `${API_URL}/logs/export/pdf?${queryParams.toString()}`;
      const response = await api.get(url, { responseType: 'blob' });
      
      // Descargar archivo
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `logs_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error en exportPDF:', error);
      throw error;
    }
  },
};

export default logsService;
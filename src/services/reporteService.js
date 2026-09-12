// frontend/src/services/reporteService.js
import api from './api';

export const reporteService = {
  // ✅ Obtener estadísticas con filtros
  getStats: async (fecha_desde, fecha_hasta) => {
    const params = {};
    if (fecha_desde) params.fecha_desde = fecha_desde;
    if (fecha_hasta) params.fecha_hasta = fecha_hasta;
    const response = await api.get('/reportes/stats', { params });
    return response.data;
  },

  // ✅ Obtener eventos con filtros
  getEventos: async (fecha_desde, fecha_hasta, limit, offset, tipo) => {
    const params = { limit, offset };
    if (fecha_desde) params.fecha_desde = fecha_desde;
    if (fecha_hasta) params.fecha_hasta = fecha_hasta;
    if (tipo && tipo !== 'todos') params.tipo = tipo;
    const response = await api.get('/reportes/eventos', { params });
    return response.data;
  },

  // ✅ Exportar CSV con filtros
  exportCSV: async (fecha_desde, fecha_hasta) => {
    const params = {};
    if (fecha_desde) params.fecha_desde = fecha_desde;
    if (fecha_hasta) params.fecha_hasta = fecha_hasta;
    const response = await api.get('/reportes/export/csv', { 
      params,
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_eventos_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { count: 0 };
  },

  // ✅ Exportar PDF con filtros
  exportPDF: async (fecha_desde, fecha_hasta) => {
    const params = {};
    if (fecha_desde) params.fecha_desde = fecha_desde;
    if (fecha_hasta) params.fecha_hasta = fecha_hasta;
    const response = await api.get('/reportes/export/pdf', { 
      params,
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_eventos_${new Date().toISOString().slice(0,10)}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return { count: 0 };
  }
};
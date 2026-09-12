// frontend/src/services/dashboardService.js
import api from './api';

export const dashboardService = {
  // Obtener tendencia de actividad (eventos, alarmas, mantenimientos)
  getTendencia: async (dias = 7) => {
    try {
      // Obtener eventos de los últimos N días
      const eventos = await api.get('/eventos/', { 
        params: { limit: 1000, dias: dias }
      });
      
      // Obtener alarmas de los últimos N días
      const alarmas = await api.get('/alarmas/', { 
        params: { limit: 1000, dias: dias }
      });
      
      // Obtener mantenimientos de los últimos N días
      const mantenimientos = await api.get('/mantenimiento/', { 
        params: { limit: 1000, dias: dias }
      });
      
      // Procesar datos por día
      const diasMap = {};
      const hoy = new Date();
      
      for (let i = 0; i < dias; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - i);
        const key = fecha.toISOString().split('T')[0];
        diasMap[key] = {
          fecha: key,
          eventos: 0,
          alarmas: 0,
          mantenimientos: 0,
          label: `Día ${dias - i}`
        };
      }
      
      // Contar eventos por día
      eventos.data.forEach(e => {
        const fecha = new Date(e.fecha_hora || e.created_at);
        const key = fecha.toISOString().split('T')[0];
        if (diasMap[key]) {
          diasMap[key].eventos++;
        }
      });
      
      // Contar alarmas por día
      alarmas.data.forEach(a => {
        const fecha = new Date(a.timestamp || a.created_at);
        const key = fecha.toISOString().split('T')[0];
        if (diasMap[key]) {
          diasMap[key].alarmas++;
        }
      });
      
      // Contar mantenimientos por día
      mantenimientos.data.forEach(m => {
        const fecha = new Date(m.fecha_programada || m.created_at);
        const key = fecha.toISOString().split('T')[0];
        if (diasMap[key]) {
          diasMap[key].mantenimientos++;
        }
      });
      
      // Convertir a array ordenado
      return Object.values(diasMap).sort((a, b) => a.fecha.localeCompare(b.fecha));
      
    } catch (error) {
      console.error('Error cargando tendencia:', error);
      // Fallback con datos mock si falla
      return getMockTrendData(dias);
    }
  }
};

// Fallback con datos mock
const getMockTrendData = (dias) => {
  return Array.from({ length: dias }, (_, i) => ({
    fecha: new Date(Date.now() - (dias - i) * 86400000).toISOString().split('T')[0],
    label: `Día ${i + 1}`,
    eventos: Math.floor(Math.random() * 20 + 5),
    alarmas: Math.floor(Math.random() * 10 + 2),
    mantenimientos: Math.floor(Math.random() * 5 + 1)
  }));
};
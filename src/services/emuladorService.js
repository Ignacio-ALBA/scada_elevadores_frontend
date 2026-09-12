import axios from 'axios';
import api from './api';

const EMULADOR_URL = import.meta.env.VITE_EMULADOR_URL || 'http://localhost:8001';

const emuladorApi = axios.create({
  baseURL: EMULADOR_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const emuladorService = {
  // Obtener todos los datos
  obtenerDatos: async (plc) => {
    try {
      const url = `${EMULADOR_URL}/api/datos${plc ? `?plc=${plc}` : ''}`;
      
      // ✅ Timeout de 5 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⏰ Timeout en solicitud al emulador');
        throw new Error('Timeout');
      }
      console.error('❌ Error en emuladorService.obtenerDatos:', error);
      throw error;
    }
  },

  // Obtener lista de PLCs
  obtenerPLCs: async () => {
    try {
      const response = await fetch(`${EMULADOR_URL}/api/plcs`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('❌ Error en emuladorService.obtenerPLCs:', error);
      throw error;
    }
  },

  // Obtener registros de un PLC
  obtenerRegistros: async (plc) => {
    try {
      const response = await fetch(`${EMULADOR_URL}/api/registros?plc=${plc}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('❌ Error en emuladorService.obtenerRegistros:', error);
      throw error;
    }
  },

  // Obtener un registro específico
  obtenerRegistro: async (plc, direccion) => {
    try {
      const response = await fetch(`${EMULADOR_URL}/api/registro?plc=${plc}&direccion=${direccion}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('❌ Error en emuladorService.obtenerRegistro:', error);
      throw error;
    }
  },


  // Health check
  healthCheck: async () => {
    const response = await emuladorApi.get('/api/health');
    return response.data;
  },
};
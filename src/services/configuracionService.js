// frontend/src/services/configuracionService.js
import api from './api';
import { APP_CONFIG } from '../config/index.js';

export const configuracionService = {
    // Configuraciones Generales (Empresa)
    getGenerales: async () => {
        const response = await api.get('/configuraciones/generales');
        return response.data;
    },
    
    updateGenerales: async (config) => {
        const response = await api.put('/configuraciones/generales', config);
        return response.data;
    },
    
    // Configuraciones del Sistema - PÚBLICO (sin autenticación)
    getSistemaPublic: async () => {
        // Usamos fetch directo porque no necesita token
        const response = await fetch(`${APP_CONFIG.apiBaseUrl}/configuraciones/sistema/public`);
        if (!response.ok) {
            throw new Error('Error al cargar configuración del sistema');
        }
        return response.json();
    },
    
    // Configuraciones del Sistema - PROTEGIDO (requiere autenticación)
    getSistema: async () => {
        try {
            const response = await api.get('/configuraciones/sistema');
            // console.log(' [configuracionService] getSistema response:', response.data);
            // console.log(' [configuracionService] nombre_interfaz_vistas:', response.data.nombre_interfaz_vistas);
            return response.data;
        } catch (error) {
            console.error('Error cargando configuración del sistema:', error);
            return {};
        }
    },
    
    updateSistema: async (config) => {
        const response = await api.put('/configuraciones/sistema', config);
        return response.data;
    },
    
    // Colores
    getColores: async () => {
        const response = await api.get('/configuraciones/colores');
        return response.data;
    },
    
    updateColores: async (colores) => {
        const response = await api.put('/configuraciones/colores', colores);
        return response.data;
    },
};

const getFondoLoginImages = async () => {
  try {
    const response = await api.get('/configuraciones/fondo-login-images');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo imágenes de fondo:', error);
    return [];
  }
};
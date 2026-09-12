// frontend/src/hooks/useNombreInterfaz.js
import { useState, useEffect } from 'react';
import { configuracionService } from '../services/configuracionService';

// Nombres por defecto (fallback)
const DEFAULT_NAMES = {
  'dashboard': 'Dashboard',
  'alarmas': 'Alarmas',
  'cabinas': 'Cabinas',
  'edificios': 'Edificios',
  'elevadores': 'Elevadores',
  'empresas': 'Empresas',
  'eventos': 'Eventos',
  'mantenimiento': 'Mantenimiento',
  'monitor': 'Monitor SCADA',
  'privilegios': 'Privilegios',
  'reportes': 'Reportes',
  'usuarios': 'Usuarios',
  'configuraciones': 'Configuraciones',
  'integraciones': 'Integraciones',
  'parametros_elevador': 'Parámetros IG Elevador',
  'parametros_cabina': 'Parámetros IG Cabina',
  'interfaces_visuales': 'Interfaces Visuales',
  'visualizacion': 'Visualización',
  'variables_scada': 'Variables SCADA',
  'roles': 'Roles',
  'permisos': 'Permisos',
  'controladores': 'Controladores',
  'catalogo': 'Catálogo',
  'catalogos': 'Catálogos',
  'catalogo_alba': 'Catálogo ALBA',
  'configuracion_ig': 'Administración IG',
  'vinculacion_parametros': 'Vinculación Parámetros',
  'ms_parametros': 'MS Parámetros',
  'interfaces_graficas': 'Interfaces Gráficas',
  'elevadores_graficos': 'Elevadores Gráficos',
  'cabinas_graficos': 'Cabinas Gráficos',
  'logs': 'Log',
};

export const useNombreInterfaz = (clave) => {
  const [nombre, setNombre] = useState(DEFAULT_NAMES[clave] || clave);

  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const sistema = await configuracionService.getSistema();
        const key = `nombre_interfaz_${clave}`;
        setNombre(sistema[key] || DEFAULT_NAMES[clave] || clave);
      } catch (error) {
        console.error(`Error cargando nombre para "${clave}":`, error);
        setNombre(DEFAULT_NAMES[clave] || clave);
      }
    };
    cargarNombre();
  }, [clave]);

  return nombre;
};
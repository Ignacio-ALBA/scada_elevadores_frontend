// src/context/PermisoContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const PermisoContext = createContext();

// Definición de permisos por rol (frontend) - FALLBACK si no hay BD
const PERMISOS_POR_ROL = {
  1: { // SuperAdmin - TODO
    dashboard: { ver: true, crear: true, editar: true, eliminar: true },
    interfaces_graficas: { ver: true, crear: true, editar: true, eliminar: true },
    elevadores_graficos: { ver: true, crear: true, editar: true, eliminar: true },
    cabinas_graficos: { ver: true, crear: true, editar: true, eliminar: true },
    alarmas: { ver: true, crear: true, editar: true, eliminar: true },
    eventos: { ver: true, crear: true, editar: true, eliminar: true },
    mantenimiento: { ver: true, crear: true, editar: true, eliminar: true },
    reportes_grupo: { ver: true, crear: true, editar: true, eliminar: true },
    reportes_alarmas: { ver: true, crear: true, editar: true, eliminar: true },
    reportes_eventos: { ver: true, crear: true, editar: true, eliminar: true },
    reportes_mantenimiento: { ver: true, crear: true, editar: true, eliminar: true },
    reportes_generales: { ver: true, crear: true, editar: true, eliminar: true },
    reportes_log: { ver: true, crear: true, editar: true, eliminar: true },
    catalogo_alba: { ver: true, crear: true, editar: true, eliminar: true },
    empresas: { ver: true, crear: true, editar: true, eliminar: true },
    edificios: { ver: true, crear: true, editar: true, eliminar: true },
    elevadores: { ver: true, crear: true, editar: true, eliminar: true },
    controladores: { ver: true, crear: true, editar: true, eliminar: true },
    configuraciones: { ver: true, crear: true, editar: true, eliminar: true },
    usuarios: { ver: true, crear: true, editar: true, eliminar: true },
    roles: { ver: true, crear: true, editar: true, eliminar: true },
    permisos: { ver: true, crear: true, editar: true, eliminar: true },
    monitor: { ver: true, crear: true, editar: true, eliminar: true },
    privilegios: { ver: true, crear: true, editar: true, eliminar: true },
    variables_scada: { ver: true, crear: true, editar: true, eliminar: true },
    integraciones: { ver: true, crear: true, editar: true, eliminar: true },
    interfaces_visuales: { ver: true, crear: true, editar: true, eliminar: true },
    interfaces_graficas_catalogo: { ver: true, crear: true, editar: true, eliminar: true },
    catalogos: { ver: true, crear: true, editar: true, eliminar: true },
    elevadores_catalogo: { ver: true, crear: true, editar: true, eliminar: true },
    parametros_elevador: { ver: true, crear: true, editar: true, eliminar: true },
    cabinas_catalogo: { ver: true, crear: true, editar: true, eliminar: true },
    parametros_cabina: { ver: true, crear: true, editar: true, eliminar: true },
    usuarios_catalogo: { ver: true, crear: true, editar: true, eliminar: true },
    configuracion_ig: { ver: true, crear: true, editar: true, eliminar: true },
    cabinas: { ver: true, crear: true, editar: true, eliminar: true },
  },
  2: { // Admin - casi todo, sin eliminar
    dashboard: { ver: true, crear: true, editar: true, eliminar: false },
    interfaces_graficas: { ver: true, crear: true, editar: true, eliminar: false },
    elevadores_graficos: { ver: true, crear: true, editar: true, eliminar: false },
    cabinas_graficos: { ver: true, crear: true, editar: true, eliminar: false },
    alarmas: { ver: true, crear: true, editar: true, eliminar: false },
    eventos: { ver: true, crear: true, editar: true, eliminar: false },
    mantenimiento: { ver: true, crear: true, editar: true, eliminar: false },
    reportes_grupo: { ver: true, crear: true, editar: true, eliminar: false },
    reportes_alarmas: { ver: true, crear: true, editar: true, eliminar: false },
    reportes_eventos: { ver: true, crear: true, editar: true, eliminar: false },
    reportes_mantenimiento: { ver: true, crear: true, editar: true, eliminar: false },
    reportes_generales: { ver: true, crear: true, editar: true, eliminar: false },
    reportes_log: { ver: true, crear: true, editar: true, eliminar: false },
    catalogo_alba: { ver: true, crear: true, editar: true, eliminar: false },
    empresas: { ver: true, crear: true, editar: true, eliminar: false },
    edificios: { ver: true, crear: true, editar: true, eliminar: false },
    elevadores: { ver: true, crear: true, editar: true, eliminar: false },
    controladores: { ver: true, crear: true, editar: true, eliminar: false },
    configuraciones: { ver: true, crear: true, editar: true, eliminar: false },
    usuarios: { ver: true, crear: true, editar: true, eliminar: false },
    roles: { ver: true, crear: true, editar: true, eliminar: false },
    permisos: { ver: true, crear: true, editar: true, eliminar: false },
    monitor: { ver: true, crear: true, editar: true, eliminar: false },
    privilegios: { ver: true, crear: true, editar: true, eliminar: false },
    variables_scada: { ver: true, crear: true, editar: true, eliminar: false },
    integraciones: { ver: true, crear: true, editar: true, eliminar: false },
    interfaces_visuales: { ver: true, crear: true, editar: true, eliminar: false },
    interfaces_graficas_catalogo: { ver: true, crear: true, editar: true, eliminar: false },
    catalogos: { ver: true, crear: true, editar: true, eliminar: false },
    elevadores_catalogo: { ver: true, crear: true, editar: true, eliminar: false },
    parametros_elevador: { ver: true, crear: true, editar: true, eliminar: false },
    cabinas_catalogo: { ver: true, crear: true, editar: true, eliminar: false },
    parametros_cabina: { ver: true, crear: true, editar: true, eliminar: false },
    usuarios_catalogo: { ver: true, crear: true, editar: true, eliminar: false },
    cabinas: { ver: true, crear: true, editar: true, eliminar: false },
  },
  3: { // Supervisor - solo lectura
    dashboard: { ver: true, crear: false, editar: false, eliminar: false },
    interfaces_graficas: { ver: true, crear: false, editar: false, eliminar: false },
    elevadores_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    cabinas_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    alarmas: { ver: true, crear: false, editar: false, eliminar: false },
    eventos: { ver: true, crear: false, editar: false, eliminar: false },
    mantenimiento: { ver: true, crear: false, editar: false, eliminar: false },
    reportes_grupo: { ver: true, crear: false, editar: false, eliminar: false },
    reportes_alarmas: { ver: true, crear: false, editar: false, eliminar: false },
    reportes_eventos: { ver: true, crear: false, editar: false, eliminar: false },
    reportes_mantenimiento: { ver: true, crear: false, editar: false, eliminar: false },
    reportes_generales: { ver: true, crear: false, editar: false, eliminar: false },
    reportes_log: { ver: true, crear: false, editar: false, eliminar: false },
  },
  4: { // Operador - solo lectura limitada
    dashboard: { ver: true, crear: false, editar: false, eliminar: false },
    elevadores_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    cabinas_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    alarmas: { ver: true, crear: false, editar: false, eliminar: false },
    eventos: { ver: true, crear: false, editar: false, eliminar: false },
  },
  5: { // Mantenimiento
    dashboard: { ver: true, crear: false, editar: false, eliminar: false },
    elevadores_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    cabinas_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    mantenimiento: { ver: true, crear: true, editar: true, eliminar: false },
    reportes_grupo: { ver: true, crear: false, editar: false, eliminar: false },
    reportes_mantenimiento: { ver: true, crear: false, editar: false, eliminar: false },
  },
};

export const PermisoProvider = ({ children }) => {
  const [permisos, setPermisos] = useState({ modulos: {} });
  const [loading, setLoading] = useState(true);
  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    const loadPermisos = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const rolId = user.rol || user.rol_id;
        
        // console.log('🔍 PermisoContext - user:', user);
        // console.log('🔍 PermisoContext - rolId:', rolId);
        
        if (rolId) {
          setUserRol(rolId);
          // console.log}(`🔍 PermisoContext - Cargando permisos para rol: ${rolId}`);
          
          try {
            // const response = await api.get(`/permisos/rol/${rolId}`);
            // const response = await api.get(`/permisos/rol-contexto/${rolId}`);
            const response = await api.get(`/permisos/rol/${rolId}`);
            // console.log('🔍 PermisoContext - Permisos recibidos de BD:', response.data);

            // console.log('🔍 PermisoContext - Permisos recibidos de BD:', response.data);
            // console.log('🔍 PermisoContext - Módulos disponibles en BD:', Object.keys(response.data.modulos || {}));
            
            // Si la BD devuelve permisos, usarlos
            if (response.data && response.data.modulos) {
              setPermisos(response.data);
            } else {
              // Fallback a permisos locales
              // console.warn('⚠️ PermisoContext - Usando permisos locales (fallback)');
              console.warn('⚠️ PermisoContext - Usando permisos locales (fallback)');
              const permisosLocales = PERMISOS_POR_ROL[rolId] || PERMISOS_POR_ROL[1];
              setPermisos({ modulos: permisosLocales });
            }
          } catch (error) {
            // console.error('❌ PermisoContext - Error cargando permisos de BD:', error);
            // Fallback a permisos locales
            // console.warn('⚠️ PermisoContext - Usando permisos locales (fallback por error)');
            const permisosLocales = PERMISOS_POR_ROL[rolId] || PERMISOS_POR_ROL[1];
            setPermisos({ modulos: permisosLocales });
          }
        } else {
          // console.warn('🔍 PermisoContext - Usuario sin rol, usando permisos de SuperAdmin');
          setUserRol(1);
          setPermisos({ modulos: PERMISOS_POR_ROL[1] });
        }
      } catch (error) {
        console.error('❌ PermisoContext - Error general cargando permisos:', error);
        console.warn('⚠️ PermisoContext - Usando permisos locales (fallback por error)');
        // setPermisos({ modulos: {} });
        const permisosLocales = PERMISOS_POR_ROL[rolId] || PERMISOS_POR_ROL[1];
        setPermisos({ modulos: permisosLocales });
      } finally {
        setLoading(false);
      }
    };

    loadPermisos();
  }, []);

  const tienePermiso = (modulo, accion = 'ver') => {
    if (!permisos || !permisos.modulos) return false;
    const moduloPermisos = permisos.modulos[modulo];
    if (!moduloPermisos) return false;
    return moduloPermisos[accion] === true;
  };

  const puedeVer = (modulo) => tienePermiso(modulo, 'ver');
  const puedeCrear = (modulo) => tienePermiso(modulo, 'crear');
  const puedeEditar = (modulo) => tienePermiso(modulo, 'editar');
  const puedeEliminar = (modulo) => tienePermiso(modulo, 'eliminar');

  return (
    <PermisoContext.Provider value={{
      permisos,
      loading,
      userRol,
      tienePermiso,
      puedeVer,
      puedeCrear,
      puedeEditar,
      puedeEliminar
    }}>
      {children}
    </PermisoContext.Provider>
  );
};

export const usePermisos = () => {
  const context = useContext(PermisoContext);
  if (!context) {
    throw new Error('usePermisos debe usarse dentro de PermisoProvider');
  }
  return context;
};
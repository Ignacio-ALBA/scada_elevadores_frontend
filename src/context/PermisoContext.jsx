// src/context/PermisoContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const PermisoContext = createContext();

export const PERMISOS_POR_ROL = {
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
    estilos: { ver: true, crear: true, editar: true, eliminar: true },
    iconos: { ver: true, crear: true, editar: true, eliminar: true },
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
    estilos: { ver: true, crear: true, editar: true, eliminar: false },
    iconos: { ver: true, crear: true, editar: true, eliminar: false },
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
    estilos: { ver: true, crear: false, editar: false, eliminar: false },
    iconos: { ver: true, crear: false, editar: false, eliminar: false },
  },
  4: { // Operador - solo lectura limitada
    dashboard: { ver: true, crear: false, editar: false, eliminar: false },
    elevadores_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    cabinas_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    alarmas: { ver: true, crear: false, editar: false, eliminar: false },
    eventos: { ver: true, crear: false, editar: false, eliminar: false },
    estilos: { ver: true, crear: false, editar: false, eliminar: false },
    iconos: { ver: true, crear: false, editar: false, eliminar: false },
  },
  5: { // Mantenimiento
    dashboard: { ver: true, crear: false, editar: false, eliminar: false },
    elevadores_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    cabinas_graficos: { ver: true, crear: false, editar: false, eliminar: false },
    mantenimiento: { ver: true, crear: true, editar: true, eliminar: false },
    reportes_grupo: { ver: true, crear: false, editar: false, eliminar: false },
    reportes_mantenimiento: { ver: true, crear: false, editar: false, eliminar: false },
    estilos: { ver: true, crear: false, editar: false, eliminar: false },
    iconos: { ver: true, crear: false, editar: false, eliminar: false },
  },
};

export const PermisoProvider = ({ children }) => {
  const [permisos, setPermisos] = useState({ modulos: {} });
  const [loading, setLoading] = useState(true);
  const [userRol, setUserRol] = useState(null);

  const loadPermisos = useCallback(async () => {
    // console.log(' [PermisoContext] loadPermisos iniciado');
    try {
      setLoading(true);
      
      if (window.location.pathname.includes('/login')) {
        // console.log(' [PermisoContext] En login, omitiendo carga de permisos');
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        // console.log(' [PermisoContext] No hay token, omitiendo');
        setLoading(false);
        return;
      }
      
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.warn('⚠️ [PermisoContext] No hay user en localStorage');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const rolId = user.rol || user.rol_id || user.id_rol || 1;
      
      // console.log(' [PermisoContext] user:', user);
      // console.log(' [PermisoContext] rolId:', rolId);
      
      setUserRol(rolId);
      
      let modulos = {};
      let permisosCargados = false;
      
      try {
        const response = await api.get(`/permisos/rol/${rolId}`);
        // console.log(' [PermisoContext] response desde API:', response.data);
        
        if (response.data && response.data.modulos) {
          modulos = response.data.modulos;
        } else if (Array.isArray(response.data)) {
          response.data.forEach(permiso => {
            if (permiso.modulo_clave) {
              modulos[permiso.modulo_clave] = {
                ver: permiso.puede_ver || false,
                crear: permiso.puede_crear || false,
                editar: permiso.puede_editar || false,
                eliminar: permiso.puede_eliminar || false
              };
            }
          });
        }
        
        if (Object.keys(modulos).length > 0) {
          permisosCargados = true;
          // console.log(' [PermisoContext] Permisos cargados desde API');
          // console.log(' [PermisoContext] modulos:', modulos);
          // console.log(' [PermisoContext] ¿Tiene iconos?', modulos.iconos);
        }
      } catch (error) {
        console.warn('⚠️ [PermisoContext] Error cargando permisos desde API:', error);
        const cached = localStorage.getItem('permisos');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.modulos) {
              modulos = parsed.modulos;
              permisosCargados = true;
              // console.log(' [PermisoContext] Permisos cargados desde caché (fallback)');
            }
          } catch (e) {}
        }
      }
      
      if (!permisosCargados) {
        console.warn('⚠️ [PermisoContext] Usando fallback SuperAdmin');
        modulos = PERMISOS_POR_ROL[1];
      }
      
      const permisosData = { modulos };
      setPermisos(permisosData);
      localStorage.setItem('permisos', JSON.stringify(permisosData));
      // console.log(' [PermisoContext] Permisos guardados en estado y localStorage');
      
      setLoading(false);
    } catch (error) {
      console.error('❌ [PermisoContext] Error general:', error);
      const fallback = { modulos: PERMISOS_POR_ROL[1] };
      setPermisos(fallback);
      localStorage.setItem('permisos', JSON.stringify(fallback));
      setUserRol(1);
      setLoading(false);
    }
  }, []);

  // useEffect principal: cargar permisos al montar el componente
  useEffect(() => {
    loadPermisos();
  }, [loadPermisos]);

  // useEffect adicional: escuchar eventos de login/logout
  useEffect(() => {
    const handleLogin = (event) => {
      // console.log(' [PermisoContext] Evento auth:login recibido!', event.detail);
      // Recargar permisos después del login
      loadPermisos();
    };

    const handleLogout = () => {
      // console.log(' [PermisoContext] Evento auth:logout recibido');
      setPermisos({ modulos: {} });
      localStorage.removeItem('permisos');
      setUserRol(null);
    };

    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [loadPermisos]);

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
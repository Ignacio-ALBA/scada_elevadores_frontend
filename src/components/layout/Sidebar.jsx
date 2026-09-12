// frontend/src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePermisos } from '../../context/PermisoContext';
import { useAuth } from '../../context/AuthContext';
import { interfaceVisualService } from '../../services/interfaceVisualService';
import { configuracionService } from '../../services/configuracionService';

// ============================================
// SVG ICONOS INLINE (todos)
// ============================================

const IconDashboard = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
  </svg>
);

const IconElevator = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
  </svg>
);

const IconBell = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
  </svg>
);

const IconClock = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8.414V6a1 1 0 10-2 0v5a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 10.414z"/>
  </svg>
);

const IconTools = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
    <path d="M7 6h6v1H7zM7 8h6v1H7zM7 10h6v1H7z"/>
  </svg>
);

const IconFile = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
  </svg>
);

const IconCog = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
  </svg>
);

const IconPlug = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
    <path d="M7 6h6v1H7zM7 8h6v1H7zM7 10h6v1H7z"/>
  </svg>
);

const IconBook = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385V4.804z"/>
  </svg>
);

const IconMicrochip = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
    <path d="M7 6h6v1H7zM7 8h6v1H7zM7 10h6v1H7z"/>
  </svg>
);

const IconUserTag = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
  </svg>
);

const IconLock = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm0 2a2 2 0 012 2v2H8V6a2 2 0 012-2z"/>
  </svg>
);

const IconEye = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3C5 3 1 7 1 10c0 3 4 7 9 7s9-4 9-7c0-3-4-7-9-7zm0 12c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
    <path d="M10 7a3 3 0 100 6 3 3 0 000-6z"/>
  </svg>
);

const IconChartBar = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
  </svg>
);

const IconSignOut = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm2 1v12h10V4H5z"/>
    <path d="M10 7a1 1 0 00-1 1v1H7a1 1 0 000 2h2v1a1 1 0 002 0v-1h2a1 1 0 000-2h-2V8a1 1 0 00-1-1z"/>
  </svg>
);

const IconChevronDown = () => (
  <svg className="w-3 h-3 transition-transform" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
  </svg>
);

const IconBuilding = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
    <path d="M8 6h4v1H8zM8 8h4v1H8zM8 10h4v1H8z"/>
  </svg>
);

const IconCabina = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
    <path d="M8 8a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1V8z"/>
  </svg>
);

const IconLink = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z"/>
    <path d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 005.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z"/>
  </svg>
);

// ============================================
// MAPA DE NOMBRES POR DEFECTO (si no hay configuración)
// ============================================
const DEFAULT_NAMES = {
  // Sistema
  'dashboard': 'Dashboard',
  'monitor': 'Monitor SCADA',
  'interfaces_visuales': 'Interfaces Visuales',
  'visualizacion': 'Visualización',
  
  // Módulos principales
  'elevadores': 'Elevadores',
  'alarmas': 'Alarmas',
  'eventos': 'Eventos',
  'mantenimiento': 'Mantenimiento',
  'reportes': 'Reportes',
  'usuarios': 'Usuarios',
  'privilegios': 'Privilegios',
  'configuraciones': 'Configuraciones',
  'integraciones': 'Integraciones',
  
  // Catálogos
  'catalogo': 'Catálogo',
  'catalogos': 'Catálogos',
  'catalogo_alba': 'Catálogo ALBA',
  'empresas': 'Empresas',
  'edificios': 'Edificios',
  'cabinas': 'Cabinas',
  'controladores': 'Controladores',
  
  // Parámetros
  'parametros_elevador': 'Parámetros IG Elevador',
  'parametros_cabina': 'Parámetros IG Cabina',
  
  // Catálogo - subitems
  'catalogo_elevadores': 'Elevadores',
  'catalogo_cabinas': 'Cabinas',
  'catalogo_controladores': 'Controladores',
  'catalogo_variables_scada': 'Variables SCADA',
  'catalogo_usuarios': 'Usuarios',
  'catalogo_roles': 'Roles',
  'catalogo_permisos': 'Permisos',
  
  // Otros
  'interfaces_graficas': 'Interfaces Gráficas',
  'elevadores_graficos': 'Elevadores Gráficos',
  'cabinas_graficos': 'Cabinas Gráficos',
  'variables_scada': 'Variables SCADA',
  'reportes_grupo': 'Reportes',
  'reportes_alarmas': 'Alarmas',
  'reportes_eventos': 'Eventos',
  'reportes_mantenimiento': 'Mantenimiento',
  'reportes_generales': 'Reportes',
  'reportes_log': 'Log',
  'interfaces_graficas_catalogo': 'Interfaces Gráficas',
  'configuracion_ig': 'Administración IG',
  'vinculacion_parametros': 'Vinculación Parámetros',
  'ms_parametros': 'MS Parámetros',
  'roles': 'Roles',
  'permisos': 'Permisos',
};

// ============================================
// DEFINICIÓN DEL MENÚ CON RUTAS CORRECTAS
// ============================================

const ALL_MENU_ITEMS = [
  // ============================================
  // 1. DASHBOARD
  // ============================================
  { clave: 'dashboard', nombre: 'Dashboard', ruta: '/dashboard', icono: IconDashboard },

  // ============================================
  // 2. INTERFACES GRÁFICAS
  // ============================================
  // { 
  //   clave: 'interfaces_graficas',
  //   nombre: 'Interfaces Gráficas',
  //   ruta: '#',
  //   icono: IconEye,
  //   children: [
  //     { clave: 'elevadores_graficos', nombre: 'Elevadores Gráficos', ruta: '/elevadores-graficos', icono: IconElevator },
  //   ]
  // },
  { 
    clave: 'elevadores_graficos',
    nombre: 'Elevadores Gráficos',
    ruta: '/elevadores-graficos',
    icono: IconElevator,
  },

  // ============================================
  // 3. ALARMAS
  // ============================================
  { clave: 'alarmas', nombre: 'Alarmas', ruta: '/alarmas', icono: IconBell },

  // ============================================
  // 4. EVENTOS
  // ============================================
  { clave: 'eventos', nombre: 'Eventos', ruta: '/eventos', icono: IconClock },

  // ============================================
  // 5. MANTENIMIENTO
  // ============================================
  { clave: 'mantenimiento', nombre: 'Mantenimiento', ruta: '/mantenimiento', icono: IconTools },

  // ============================================
  // 6. REPORTES
  // ============================================
  { 
    clave: 'reportes_grupo',
    nombre: 'Reportes',
    ruta: '#',
    icono: IconFile,
    children: [
      { clave: 'reportes_alarmas', nombre: 'Alarmas', ruta: '/reportes/alarmas', icono: IconBell },
      { clave: 'reportes_eventos', nombre: 'Eventos', ruta: '/reportes/eventos', icono: IconClock },
      { clave: 'reportes_mantenimiento', nombre: 'Mantenimiento', ruta: '/reportes/mantenimiento', icono: IconTools },
      { clave: 'reportes_generales', nombre: 'Reportes', ruta: '/reportes', icono: IconFile },
      { clave: 'reportes_log', nombre: 'Log', ruta: '/reportes/log', icono: IconClock },
    ]
  },

  // ============================================
  // 7. CATÁLOGOS
  // ============================================
  { 
    clave: 'catalogos',
    nombre: 'Catálogos',
    ruta: '#',
    icono: IconBook,
    children: [
      { clave: 'catalogo_elevadores', nombre: 'Elevadores', ruta: '/elevadores', icono: IconElevator },
      { clave: 'parametros_elevador', nombre: 'Parámetros IG Elevador', ruta: '/parametros-elevador', icono: IconMicrochip },
      { clave: 'catalogo_cabinas', nombre: 'Cabinas', ruta: '/cabinas', icono: IconCabina },
      { clave: 'parametros_cabina', nombre: 'Parámetros IG Cabina', ruta: '/parametros-cabina', icono: IconMicrochip },
      { clave: 'catalogo_usuarios', nombre: 'Usuarios', ruta: '/usuarios', icono: IconUsers },
    ]
  },

  // ============================================
  // 8. CATÁLOGO ALBA
  // ============================================
  { 
    clave: 'catalogo_alba',
    nombre: 'Catálogo ALBA',
    ruta: '#',
    icono: IconBook,
    children: [
      { clave: 'empresas', nombre: 'Empresas', ruta: '/empresas', icono: IconUsers },
      { clave: 'edificios', nombre: 'Edificios', ruta: '/edificios', icono: IconBuilding },
      { clave: 'elevadores', nombre: 'Elevadores', ruta: '/elevadores', icono: IconElevator },
      { clave: 'catalogo_cabinas', nombre: 'Cabinas', ruta: '/cabinas', icono: IconCabina },
      { clave: 'configuraciones', nombre: 'Configuraciones', ruta: '/configuraciones', icono: IconCog },
      { clave: 'usuarios', nombre: 'Usuarios', ruta: '/usuarios', icono: IconUsers },
      { clave: 'roles', nombre: 'Roles', ruta: '/roles', icono: IconUserTag },
      { clave: 'permisos', nombre: 'Permisos', ruta: '/permisos', icono: IconLock },
      { clave: 'privilegios', nombre: 'Privilegios', ruta: '/privilegios', icono: IconLock },
      { clave: 'monitor', nombre: 'Monitor SCADA', ruta: '/monitor', icono: IconEye },
      { clave: 'variables_scada', nombre: 'Variables SCADA', ruta: '/variables-scada', icono: IconChartBar },
      { clave: 'configuracion_ig', nombre: 'Administración IG', ruta: '/configuracion-ig', icono: IconCog },
      // { clave: 'vinculacion_parametros', nombre: 'Vinculación Parámetros', ruta: '/vinculacion-parametros', icono: IconLink },
      { clave: 'ms_parametros', nombre: 'MS Parámetros', ruta: '/ms-parametros', icono: IconChartBar },
    ]
  },
];

// ============================================
// COMPONENTE SIDEBAR - VERSIÓN CON INTERFACES DINÁMICAS
// ============================================

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { permisos, loading: permisosLoading, userRol } = usePermisos();
  const [menuItems, setMenuItems] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [interfacesDinamicas, setInterfacesDinamicas] = useState([]);
  const [configEmpresa, setConfigEmpresa] = useState({});
  const [configSistema, setConfigSistema] = useState({});
  const [nombresConfigurados, setNombresConfigurados] = useState({});

  // Cargar configuraciones
  useEffect(() => {
    const cargarConfiguraciones = async () => {
      try {
        const [empresa, sistema] = await Promise.all([
          configuracionService.getGenerales(),
          configuracionService.getSistema()
        ]);
        setConfigEmpresa(empresa || {});
        setConfigSistema(sistema || {});
        
        const nombres = {};
        Object.keys(DEFAULT_NAMES).forEach(key => {
          const configKey = `nombre_interfaz_${key}`;
          nombres[key] = sistema[configKey] || DEFAULT_NAMES[key] || key;
        });
        setNombresConfigurados(nombres);
      } catch (error) {
        console.error('Error cargando configuraciones:', error);
        setNombresConfigurados(DEFAULT_NAMES);
      }
    };
    cargarConfiguraciones();
  }, []);

  const getNombreInterfaz = (clave) => {
    // console.log('🔍 getNombreInterfaz - buscando clave:', clave);
    if (nombresConfigurados[clave]) {
      return nombresConfigurados[clave];
    }
    if (DEFAULT_NAMES[clave]) {
      return DEFAULT_NAMES[clave];
    }
    return clave;
  };

  // Cargar interfaces dinámicas
  useEffect(() => {
    const cargarInterfaces = async () => {
      try {
        const data = await interfaceVisualService.getAll({ activo: true });
        const items = data.map(iface => ({
          clave: `interface_${iface.id_interface}`,
          nombre: iface.titulo || iface.nombre,
          ruta: `/interfaces/${iface.id_interface}`,
          icono: IconEye,
          es_dinamica: true,
        }));
        setInterfacesDinamicas(items);
      } catch (error) {
        console.error('Error cargando interfaces:', error);
      }
    };
    cargarInterfaces();
  }, []);

  const tienePermiso = (clave) => {
    if (!permisos || !permisos.modulos) {
      return false;
    }
    if (userRol === 1) {
      return true;
    }
    const moduloPermisos = permisos.modulos[clave];
    if (!moduloPermisos) {
      return false;
    }
    return moduloPermisos.ver === true;
  };

  // Filtrar menú basado en permisos
  useEffect(() => {
    if (!permisos || !permisos.modulos || userRol === null) {
      return;
    }
    
    // console.log('🔍 Sidebar - userRol:', userRol);
    // console.log('🔍 Sidebar - Modulos disponibles:', Object.keys(permisos.modulos || {}));
    
    // Filtrar items del menú
    const filtered = ALL_MENU_ITEMS.filter(item => {
      const hasPermission = tienePermiso(item.clave);
      
      if (item.children) {
        const filteredChildren = item.children.filter(child => tienePermiso(child.clave));
        return filteredChildren.length > 0;
      }
      
      return hasPermission;
    });
    
    // Si hay interfaces dinámicas y el usuario tiene permisos, agregarlas
    if (interfacesDinamicas.length > 0) {
      // Buscar el grupo "Interfaces Visuales" en Catálogo ALBA
      const catalogoAlba = filtered.find(item => item.clave === 'catalogo_alba');
      if (catalogoAlba && catalogoAlba.children) {
        // Agregar las interfaces dinámicas como hijos de "Interfaces Visuales" dentro de Catálogo ALBA
        const interfacesVisualesItem = catalogoAlba.children.find(
          child => child.clave === 'interfaces_visuales'
        );
        
        if (interfacesVisualesItem) {
          // Las interfaces dinámicas se mostrarán dentro de "Interfaces Visuales"
          // No necesitamos hacer nada especial porque ya está en el menú
        }
      }
    }
    
    // console.log('🔍 Sidebar - Items filtrados:', filtered.map(i => i.clave));
    setMenuItems(filtered);
  }, [permisos, userRol, interfacesDinamicas]);

  useEffect(() => {
    const handleNombresActualizados = (event) => {
      const { nombres } = event.detail;
      const nuevosNombres = {};
      Object.keys(nombres).forEach(key => {
        if (key.startsWith('nombre_interfaz_')) {
          const shortKey = key.replace('nombre_interfaz_', '');
          nuevosNombres[shortKey] = nombres[key];
        }
      });
      setNombresConfigurados(prev => ({ ...prev, ...nuevosNombres }));
    };

    window.addEventListener('nombresInterfazActualizados', handleNombresActualizados);
    
    return () => {
      window.removeEventListener('nombresInterfazActualizados', handleNombresActualizados);
    };
  }, []);

  // Si userRol es null, mostrar mensaje de carga
  if (userRol === null) {
    return (
      <aside className={`bg-primary-500 text-gray-300 h-screen fixed left-0 top-0 z-50 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'w-60 translate-x-0' : 'w-60 -translate-x-full'
      }`}>
        <div className="flex items-center gap-3 py-6 px-4 border-b border-white/10">
          <span className="text-3xl">🏢</span>
          <span className="text-xl font-bold text-white">SmartLift</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <span className="text-white/50 text-sm">Cargando permisos...</span>
          </div>
        </div>
      </aside>
    );
  }

  const toggleMenu = (clave) => {
    setExpandedMenus(prev => ({
      ...prev,
      [clave]: !prev[clave]
    }));
  };

  const isActive = (ruta) => {
    if (ruta === '/dashboard' && location.pathname === '/') return true;
    if (ruta === '#') return false;
    return location.pathname === ruta || location.pathname.startsWith(ruta + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Función para renderizar los hijos de un menú (incluyendo interfaces dinámicas)
  const renderChildren = (children, parentClave) => {
    // Si es el grupo "interfaces_visuales" dentro de Catálogo ALBA, agregar interfaces dinámicas
    const isInterfacesVisuales = parentClave === 'catalogo_alba' && 
      children.some(child => child.clave === 'interfaces_visuales');
    
    // Si es Interfaces Visuales, agregar las interfaces dinámicas como hijos adicionales
    if (isInterfacesVisuales) {
      const staticChildren = children.filter(child => child.clave !== 'interfaces_visuales');
      const interfacesVisualesChild = children.find(child => child.clave === 'interfaces_visuales');
      
      // Crear una lista con el item estático + las interfaces dinámicas
      const allChildren = [...staticChildren];
      
      // Si existe el item "Interfaces Visuales" estático, mantenerlo
      if (interfacesVisualesChild) {
        allChildren.push(interfacesVisualesChild);
      }
      
      // Agregar interfaces dinámicas
      interfacesDinamicas.forEach(iface => {
        allChildren.push({
          clave: iface.clave,
          nombre: iface.nombre,
          ruta: iface.ruta,
          icono: iface.icono,
          es_dinamica: true,
        });
      });
      
      return allChildren;
    }
    
    return children;
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside 
        className={`bg-primary-500 text-gray-300 h-screen fixed left-0 top-0 z-50 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${
          isOpen ? 'w-60 translate-x-0' : 'w-60 -translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 py-6 px-4 border-b border-white/10">
          {configEmpresa.logotipo_sidebar_empresa ? (
            <img 
              src={configEmpresa.logotipo_sidebar_empresa} 
              alt="Logo" 
              className="h-10 w-10 object-contain rounded-lg"
            />
          ) : (
            <span className="text-3xl">🏢</span>
          )}
          <span className={`text-xl font-bold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {configEmpresa.nombre_corto_empresa || 'SmartLift'}
          </span>
        </div>

        {/* Menu */}
        <nav className="flex-1 mt-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.clave}>
              {item.children ? (
                // Menú con submenús
                <div>
                  <div
                    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all ${
                      isActive(item.ruta) 
                        ? 'bg-primary-700 text-white shadow-lg' 
                        : 'hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => toggleMenu(item.clave)}
                  >
                    <item.icono />
                    <span className={`ml-3 flex-1 text-sm font-medium transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                      {getNombreInterfaz(item.clave)}
                    </span>
                    <IconChevronDown className={`${expandedMenus[item.clave] ? 'rotate-180' : ''} transition-transform duration-200`} />
                  </div>
                  {expandedMenus[item.clave] && isOpen && (
                    <div className="bg-white/5 rounded-lg mt-1 py-1">
                      {renderChildren(item.children, item.clave).map((child) => (
                        <Link
                          key={child.clave}
                          to={child.ruta}
                          className={`flex items-center px-4 py-2.5 pl-12 text-sm rounded-lg transition-all ${
                            location.pathname === child.ruta 
                              ? 'bg-primary-700 text-white' 
                              : 'hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <child.icono />
                          <span className="ml-3">
                            {child.es_dinamica ? child.nombre : getNombreInterfaz(child.clave)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Menú normal
                <Link
                  to={item.ruta}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                    isActive(item.ruta) 
                      ? 'bg-primary-700 text-white shadow-lg' 
                      : 'hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icono />
                  <span className={`ml-3 text-sm font-medium transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {getNombreInterfaz(item.clave)}
                  </span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-4 px-4 border-t border-white/10 flex flex-col gap-2 text-gray-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {configSistema.logotipo_sidebar ? (
                <img 
                  src={configSistema.logotipo_sidebar} 
                  alt="Sistema" 
                  className="h-5 w-5 object-contain"
                />
              ) : (
                <span className="text-sm">🏢</span>
              )}
              <span className={`text-xs transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                {configSistema.nombre_corto_sistema || 'SmartLift'}
              </span>
            </div>
            <span className={`text-xs transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              {configSistema.version_sistema || 'v1.0.0'}
            </span>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={handleLogout}
              className="text-white hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-white/10 w-full flex items-center justify-center gap-2 text-sm"
              title="Cerrar sesión"
            >
              <IconSignOut />
              <span className={`text-xs transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                Cerrar sesión
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

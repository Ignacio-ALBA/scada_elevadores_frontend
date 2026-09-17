// frontend/src/components/layout/Sidebar.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePermisos, PERMISOS_POR_ROL } from '../../context/PermisoContext';
import { useAuth } from '../../context/AuthContext';
import { interfaceVisualService } from '../../services/interfaceVisualService';
import { configuracionService } from '../../services/configuracionService';
import { useSafeTheme } from '../../hooks/useSafeTheme';
import api from '../../services/api';

// ============================================
//  FUNCIONES DE UTILIDAD - PARSEAR JSON
// ============================================

const getRealValue = (val) => {
  if (!val) return null;
  
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object' && parsed.value) {
        return parsed.value;
      }
      return val;
    } catch (e) {
      return val;
    }
  }
  
  if (typeof val === 'object' && val !== null) {
    if (val.value) {
      return val.value;
    }
    if (val.type === 'gradient' && val.gradient) {
      const dir = val.gradient.direction || 'to right';
      const colors = val.gradient.colors || ['#3b82f6', '#8b5cf6'];
      return `linear-gradient(${dir}, ${colors.join(', ')})`;
    }
    return null;
  }
  
  return val;
};

const getBackgroundValue = (val) => {
  if (!val) return null;
  
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object') {
        if (parsed.value) {
          return parsed.value;
        }
        if (parsed.type === 'gradient' && parsed.gradient) {
          const dir = parsed.gradient.direction || 'to right';
          const colors = parsed.gradient.colors || ['#3b82f6', '#8b5cf6'];
          return `linear-gradient(${dir}, ${colors.join(', ')})`;
        }
        if (parsed.type === 'rgba' && parsed.value) {
          return `rgba(${parsed.value}, ${parsed.opacity || 1})`;
        }
      }
      return val;
    } catch (e) {
      return val;
    }
  }
  
  if (typeof val === 'object' && val !== null) {
    if (val.value) {
      return val.value;
    }
    if (val.type === 'gradient' && val.gradient) {
      const dir = val.gradient.direction || 'to right';
      const colors = val.gradient.colors || ['#3b82f6', '#8b5cf6'];
      return `linear-gradient(${dir}, ${colors.join(', ')})`;
    }
    if (val.type === 'rgba' && val.value) {
      return `rgba(${val.value}, ${val.opacity || 1})`;
    }
    return null;
  }
  
  return val;
};

// ============================================
// SVG ICONOS INLINE
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

const IconPaint = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
    <path d="M17 4a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V5a1 1 0 011-1h1z"/>
  </svg>
);


// ============================================
// MAPA DE NOMBRES POR DEFECTO
// ============================================
const DEFAULT_NAMES = {
  'dashboard': 'Dashboard',
  'interfaces_graficas': 'Interfaces Gráficas',
  'elevadores_graficos': 'Elevadores Gráficos',
  'cabinas_graficos': 'Cabinas Gráficos',
  'alarmas': 'Alarmas',
  'eventos': 'Eventos',
  'mantenimiento': 'Mantenimiento',
  'reportes_grupo': 'Reportes',
  'reportes_alarmas': 'Alarmas',
  'reportes_eventos': 'Eventos',
  'reportes_mantenimiento': 'Mantenimiento',
  'reportes_generales': 'Reportes',
  'reportes_log': 'Log',
  'catalogo_alba': 'Catálogo ALBA',
  'empresas': 'Empresas',
  'edificios': 'Edificios',
  'elevadores': 'Elevadores',
  'controladores': 'Controladores',
  'configuraciones': 'Configuraciones',
  'usuarios': 'Usuarios',
  'roles': 'Roles',
  'permisos': 'Permisos',
  'monitor': 'Monitor SCADA',
  'privilegios': 'Privilegios',
  'variables_scada': 'Variables SCADA',
  'integraciones': 'Integraciones',
  'interfaces_visuales': 'Interfaces Visuales',
  'interfaces_graficas_catalogo': 'Interfaces Gráficas',
  'catalogos': 'Catálogos',
  'elevadores_catalogo': 'Elevadores',
  'parametros_elevador': 'Parámetros IG Elevador',
  'cabinas_catalogo': 'Cabinas',
  'parametros_cabina': 'Parámetros IG Cabina',
  'usuarios_catalogo': 'Usuarios',
  'cabinas': 'Cabinas',
  'ms_parametros': 'Monitor IG',
  'configuracion_ig': 'Administración IG',
  'vinculacion_parametros': 'Vinculación Parámetros',
  'estilos': 'Estilos',
  'vistas': 'Vistas',
};

// ============================================
// DEFINICIÓN DEL MENÚ
// ============================================
const ALL_MENU_ITEMS = [
  { clave: 'dashboard', nombre: 'Dashboard', ruta: '/dashboard', icono: IconDashboard },
  { 
    clave: 'interfaces_graficas',
    nombre: 'Interfaces Gráficas',
    ruta: '#',
    icono: IconEye,
    children: [
      { clave: 'elevadores_graficos', nombre: 'Elevadores Gráficos', ruta: '/elevadores-graficos', icono: IconElevator },
    ]
  },
  { clave: 'alarmas', nombre: 'Alarmas', ruta: '/alarmas', icono: IconBell },
  { clave: 'eventos', nombre: 'Eventos', ruta: '/eventos', icono: IconClock },
  { clave: 'mantenimiento', nombre: 'Mantenimiento', ruta: '/mantenimiento', icono: IconTools },
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
  { 
    clave: 'catalogos',
    nombre: 'Catálogos',
    ruta: '#',
    icono: IconBook,
    children: [
      { clave: 'elevadores_catalogo', nombre: 'Elevadores', ruta: '/catalogo/elevadores', icono: IconElevator },
      { clave: 'parametros_elevador', nombre: 'Parámetros IG Elevador', ruta: '/parametros-elevador', icono: IconMicrochip },
      { clave: 'cabinas_catalogo', nombre: 'Cabinas', ruta: '/catalogo/cabinas', icono: IconCabina },
      { clave: 'parametros_cabina', nombre: 'Parámetros IG Cabina', ruta: '/parametros-cabina', icono: IconMicrochip },
      { clave: 'usuarios_catalogo', nombre: 'Usuarios', ruta: '/catalogo/usuarios', icono: IconUsers },
      // { clave: 'estilos', nombre: 'Estilos', ruta: '/estilos', icono: IconPaint },
    ]
  },
  { 
    clave: 'catalogo_alba',
    nombre: 'Catálogo ALBA',
    ruta: '#',
    icono: IconBook,
    children: [
      { clave: 'empresas', nombre: 'Empresas', ruta: '/empresas', icono: IconUsers },
      { clave: 'edificios', nombre: 'Edificios', ruta: '/edificios', icono: IconBuilding },
      { clave: 'elevadores', nombre: 'Elevadores', ruta: '/elevadores', icono: IconElevator },
      { clave: 'cabinas', nombre: 'Cabinas', ruta: '/cabinas', icono: IconCabina },
      { clave: 'configuraciones', nombre: 'Configuraciones', ruta: '/configuraciones', icono: IconCog },
      { clave: 'estilos', nombre: 'Estilos', ruta: '/estilos', icono: IconPaint },
      { clave: 'usuarios', nombre: 'Usuarios', ruta: '/usuarios', icono: IconUsers },
      { clave: 'roles', nombre: 'Roles', ruta: '/roles', icono: IconUserTag },
      { clave: 'permisos', nombre: 'Permisos', ruta: '/permisos', icono: IconLock },
      { clave: 'privilegios', nombre: 'Privilegios', ruta: '/privilegios', icono: IconLock },
      { clave: 'monitor', nombre: 'Monitor SCADA', ruta: '/monitor', icono: IconEye },
      { clave: 'variables_scada', nombre: 'Variables SCADA', ruta: '/variables-scada', icono: IconChartBar },
      { clave: 'configuracion_ig', nombre: 'Administración IG', ruta: '/configuracion-ig', icono: IconCog },
      { clave: 'vinculacion_parametros', nombre: 'Vinculación Parámetros', ruta: '/vinculacion-parametros', icono: IconLink },
      { clave: 'ms_parametros', nombre: 'MS Parámetros', ruta: '/ms-parametros', icono: IconChartBar },
      { clave: 'vistas', nombre: 'Vistas', ruta: '/vistas', icono: IconPaint },
    ]
  },
];

// ============================================
// COMPONENTE SIDEBAR
// ============================================
const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { permisos, loading: permisosLoading, userRol } = usePermisos();
  
  //  TEMA - USANDO CONTEXTO DIRECTAMENTE
  const { TEMAS, temaActual } = useSafeTheme();
  const temaConfig = TEMAS ? TEMAS[temaActual] || TEMAS['default'] : {};

  const isDark = temaActual === 'oscuro';

  //  LOGS PARA DEPURACIÓN
  // console.log(' [Sidebar] temaConfig.sidebar:', temaConfig.sidebar);
  // console.log(' [Sidebar] temaConfig.sidebarLogoText:', temaConfig.sidebarLogoText);

  //  EXTRAER VALORES REALES
  const sidebarBgColor = getBackgroundValue(temaConfig.sidebar) || '#3b82f6';
  const sidebarTextColor = getRealValue(temaConfig.sidebarText) || '#d1d5db';
  const sidebarBorderColor = getRealValue(temaConfig.border) || '#e5e7eb';
  
  //  NUEVOS ATRIBUTOS - SIDEBAR
  const sidebarLogoTextColor = getRealValue(temaConfig.sidebarLogoText) || '#ffffff';
  const sidebarMenuTextColor = getRealValue(temaConfig.sidebarMenuText) || '#d1d5db';
  const sidebarMenuActiveBgColor = getBackgroundValue(temaConfig.sidebarMenuActiveBg) || 'transparent';
  const sidebarMenuActiveTextColor = getRealValue(temaConfig.sidebarMenuActiveText) || '#ffffff';
  const sidebarMenuActiveBorderColor = getRealValue(temaConfig.sidebarMenuActiveBorder) || 'transparent';

  const [menuItems, setMenuItems] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [interfacesDinamicas, setInterfacesDinamicas] = useState([]);
  const [configEmpresa, setConfigEmpresa] = useState({});
  const [configSistema, setConfigSistema] = useState({});
  const [nombresConfigurados, setNombresConfigurados] = useState({});

  const userRolEfectivo = useMemo(() => {
    return userRol !== null ? userRol : 1;
  }, [userRol]);

  const permisosEfectivos = useMemo(() => {
    if (permisos && permisos.modulos && Object.keys(permisos.modulos).length > 0) {
      return permisos;
    }
    return { modulos: PERMISOS_POR_ROL[1] };
  }, [permisos]);

  const tienePermiso = useCallback((clave) => {
    if (!permisosEfectivos || !permisosEfectivos.modulos) {
      return false;
    }
    if (userRolEfectivo === 1) {
      return true;
    }
    const moduloPermisos = permisosEfectivos.modulos[clave];
    if (!moduloPermisos) {
      return false;
    }
    return moduloPermisos.ver === true;
  }, [permisosEfectivos, userRolEfectivo]);

  //  Obtener iconos personalizados
  const [iconosPersonalizados, setIconosPersonalizados] = useState({});

  useEffect(() => {
    const cargarIconos = async () => {
      try {
        const response = await api.get('/configuraciones/iconos-sistema');
        // Extraer datos desde response.data.data (nivel correcto dentro de ResponseDto)
        setIconosPersonalizados(response.data?.data || {});
      } catch (error) {
        // Error silencioso - usar iconos por defecto
      }
    };
    cargarIconos();
  }, []);

  const getIconoModulo = (clave, iconoDefault) => {
    const config = iconosPersonalizados[clave];
    if (config) {
      if (config.tipo === 'imagen') {
        return { tipo: 'imagen', valor: config.valor };
      }
      if (config.tipo === 'emoji' && config.valor) {
        return { tipo: 'emoji', valor: config.valor };
      }
    }
    return { tipo: 'svg', valor: iconoDefault };
  };

  // Cargar configuraciones
  useEffect(() => {
    let isMounted = true;
    
    const cargarConfiguraciones = async () => {
      try {
        const [empresa, sistema] = await Promise.all([
          configuracionService.getGenerales(),
          configuracionService.getSistema()
        ]);
        
        if (!isMounted) return;
        
        setConfigEmpresa(empresa || {});
        setConfigSistema(sistema || {});
        
        // console.log(' [Sidebar] sistema recibido:', sistema);
        // console.log(' [Sidebar] sistema.nombre_interfaz_vistas:', sistema.nombre_interfaz_vistas);

        const nombres = {};
        Object.keys(DEFAULT_NAMES).forEach(key => {
          const configKey = `nombre_interfaz_${key}`;
          const valor = sistema[configKey] || DEFAULT_NAMES[key] || key;
          nombres[key] = valor;
          
          //  LOG ESPECÍFICO PARA VISTAS
          // if (key === 'vistas') {
            // console.log(' [Sidebar] === DEBUG VISTAS ===');
            // console.log(' key:', key);
            // console.log(' configKey:', configKey);
            // console.log(' sistema[configKey]:', sistema[configKey]);
            // console.log(' DEFAULT_NAMES[key]:', DEFAULT_NAMES[key]);
            // console.log(' valor final:', valor);
            // console.log(' sistema completo:', sistema);
          // }
        });
        // console.log(' [Sidebar] nombres final:', nombres);
        setNombresConfigurados(nombres);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Error cargando configuraciones:', error);
        }
        setNombresConfigurados(DEFAULT_NAMES);
      }
    };
    
    cargarConfiguraciones();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const getNombreInterfaz = (clave) => {
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
        const response = await interfaceVisualService.getAll({ activo: true });
        // Extraer el array real (response puede ser el array directo o envuelto en data.data.data)
        const interfacesList = Array.isArray(response) 
          ? response 
          : response?.data?.data || response?.data || [];
        
        const items = interfacesList.map(iface => ({
          clave: `interface_${iface.id_interface}`,
          nombre: iface.titulo || iface.nombre,
          ruta: `/interfaces/${iface.id_interface}`,
          icono: IconEye,
          es_dinamica: true,
        }));
        setInterfacesDinamicas(items);
      } catch (error) {
        // Error silencioso - sin interfaces dinámicas
      }
    };
    cargarInterfaces();
  }, []);

  // Filtrar menú basado en permisos
  useEffect(() => {
    if (userRolEfectivo === null) {
      return;
    }
    
    const filtered = ALL_MENU_ITEMS.filter(item => {
      const hasPermission = tienePermiso(item.clave);
      
      if (item.children) {
        const filteredChildren = item.children.filter(child => tienePermiso(child.clave));
        return filteredChildren.length > 0;
      }
      
      return hasPermission;
    });
    
    if (interfacesDinamicas.length > 0) {
      const catalogoAlba = filtered.find(item => item.clave === 'catalogo_alba');
      if (catalogoAlba && catalogoAlba.children) {
        // Ya está
      }
    }
    
    setMenuItems(filtered);
  }, [permisosEfectivos, userRolEfectivo, interfacesDinamicas]);

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

  // Renderizar hijos
  const renderChildren = (children, parentClave) => {
    const isInterfacesVisuales = parentClave === 'catalogo_alba' && 
      children.some(child => child.clave === 'interfaces_visuales');
    
    if (isInterfacesVisuales) {
      const staticChildren = children.filter(child => child.clave !== 'interfaces_visuales');
      const interfacesVisualesChild = children.find(child => child.clave === 'interfaces_visuales');
      
      const allChildren = [...staticChildren];
      if (interfacesVisualesChild) {
        allChildren.push(interfacesVisualesChild);
      }
      
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

  // Mostrar carga
  const permisosGuardados = localStorage.getItem('permisos');
  let hayPermisosLocales = false;
  if (permisosGuardados) {
    try {
      const parsed = JSON.parse(permisosGuardados);
      if (parsed && parsed.modulos) {
        hayPermisosLocales = true;
      }
    } catch (e) {}
  }

  if (permisosLoading && !hayPermisosLocales && userRol === null) {
    return (
      <aside 
        style={{ backgroundColor: '#3b82f6', color: '#d1d5db' }}
        className="h-screen fixed left-0 top-0 z-50 flex flex-col transition-all duration-300 ease-in-out w-60"
      >
        <div className="flex items-center gap-3 py-6 px-4 border-b border-white/10">
          <span className="text-3xl">🏢</span>
          <span className="text-xl font-bold text-white">SmartLift</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <span className="text-white/50 text-sm">Cargando permisos...</span>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-xs text-white/30 hover:text-white/70 transition-colors block"
            >
              🔄 Recargar
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      <aside 
        style={{ 
          backgroundColor: sidebarBgColor,
          color: sidebarTextColor,
          borderColor: sidebarBorderColor,
          scrollbarWidth: 'none',     
          msOverflowStyle: 'none'     
        }}
        className={`
          h-screen fixed left-0 top-0 z-50 flex flex-col overflow-y-auto
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64 translate-x-0' : 'w-16 translate-x-0'}
          shadow-2xl
        `}
      >
        {/*  Header - SOLO visible cuando sidebar está expandido */}
        {isOpen && (
          <div className={`
            h-16 flex items-center gap-3 px-3 border-b
            transition-all duration-300
          `} style={{ borderColor: sidebarBorderColor }}>
            {/* Logo en círculo */}
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 
              backdrop-blur-sm overflow-hidden bg-white/7
            `}>
              {configEmpresa.logotipo_sidebar_empresa ? (
                <img 
                  src={configEmpresa.logotipo_sidebar_empresa} 
                  alt="Logo" 
                  className="w-full h-full object-contain p-0-5"
                />
              ) : (
                <span className="text-lg" style={{ color: sidebarLogoTextColor }}>🏢</span>
              )}
            </div>
            
            {/* Nombre */}
            <span 
              className={`
                text-sm font-bold transition-all duration-300 whitespace-nowrap
              `}
              style={{ color: sidebarLogoTextColor }}
            >
              {configEmpresa.nombre_corto_empresa || 'SmartLift'}
            </span>
            
            {/* Versión */}
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10" style={{ color: sidebarLogoTextColor }}>
              {configSistema.version_sistema || '1.0'}
            </span>
          </div>
        )}

        {/*  Logo flotante - SOLO visible cuando sidebar está comprimido */}
        {!isOpen && (
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="w-10 h-10 rounded-xl bg-white/7 backdrop-blur-sm flex items-center justify-center shadow-lg overflow-hidden">
              {configEmpresa.logotipo_sidebar_empresa ? (
                <img 
                  src={configEmpresa.logotipo_sidebar_empresa} 
                  alt="Logo" 
                  className="w-full h-full object-contain p-0.5"
                />
              ) : (
                <span className="text-lg">🏢</span>
              )}
            </div>
          </div>
        )}

        {/*  Menú - con iconos personalizados y círculo de fondo */}
        <nav className={`
          flex-1 mt-3 px-3 space-y-1 overflow-y-auto
          ${!isOpen ? 'mt-1' : ''}
        `}
        style={{ 
          scrollbarWidth: 'none',     
          msOverflowStyle: 'none'     
        }}
        >
          {menuItems.map((item, index) => (
            <div 
              key={item.clave}
              className="transform transition-all duration-300 hover:translate-x-1"
              style={{
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              {item.children ? (
                <div>
                  <div
                    className={`
                      flex items-center px-3 py-2.5 rounded-xl cursor-pointer
                      transition-all duration-300 ease-in-out
                      group relative overflow-hidden
                      ${isActive(item.ruta) 
                        ? 'bg-white/15 shadow-lg' 
                        : 'hover:bg-white/10'
                      }
                    `}
                    style={{ 
                      color: isActive(item.ruta) ? sidebarMenuActiveTextColor : sidebarMenuTextColor,
                      backgroundColor: isActive(item.ruta) ? sidebarMenuActiveBgColor : 'transparent',
                    }}
                    onClick={() => toggleMenu(item.clave)}
                  >
                    {/* Efecto de gradiente al hacer hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, transparent 40%, ${sidebarMenuActiveBgColor} 100%)`
                      }}
                    />
                    
                    {/*  ICONO CON CÍRCULO DE FONDO */}
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative z-10">
                      {(() => {
                        const iconoData = getIconoModulo(item.clave, item.icono);
                        const circleBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
                        
                        if (iconoData.tipo === 'imagen') {
                          return (
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: circleBg }}
                            >
                              <img 
                                src={iconoData.valor} 
                                alt={getNombreInterfaz(item.clave)}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<span class="text-base">📄</span>';
                                }}
                              />
                            </div>
                          );
                        }
                        if (iconoData.tipo === 'emoji') {
                          return (
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: circleBg }}
                            >
                              <span className="text-lg leading-none">{iconoData.valor}</span>
                            </div>
                          );
                        }
                        // SVG por defecto
                        return (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: circleBg }}
                          >
                            <item.icono />
                          </div>
                        );
                      })()}
                    </div>

                    <span className={`
                      ml-3 flex-1 text-sm font-medium transition-all duration-300 relative z-10
                      ${isOpen ? 'opacity-100' : 'opacity-0'}
                    `}>
                      {getNombreInterfaz(item.clave)}
                    </span>
                    {isOpen && (
                      <IconChevronDown className={`
                        transition-transform duration-300 relative z-10
                        ${expandedMenus[item.clave] ? 'rotate-180' : ''}
                      `} />
                    )}
                  </div>

                  {/* Submenús con círculo más pequeño */}
                  {expandedMenus[item.clave] && isOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 pl-3 overflow-hidden" style={{ borderColor: sidebarBorderColor }}>
                      {renderChildren(item.children, item.clave).map((child, childIndex) => (
                        <Link
                          key={child.clave}
                          to={child.ruta}
                          className={`
                            flex items-center px-3 py-2 rounded-lg text-sm
                            transition-all duration-200
                            ${location.pathname === child.ruta 
                              ? 'bg-white/15' 
                              : 'hover:bg-white/10'
                            }
                            transform hover:translate-x-1
                          `}
                          style={{ 
                            color: location.pathname === child.ruta 
                              ? sidebarMenuActiveTextColor 
                              : sidebarMenuTextColor,
                            backgroundColor: location.pathname === child.ruta 
                              ? sidebarMenuActiveBgColor 
                              : 'transparent'
                          }}
                        >
                          {/*  ICONO DE SUBMENÚ CON CÍRCULO MÁS PEQUEÑO */}
                          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                            {(() => {
                              const iconoData = getIconoModulo(child.clave, child.icono);
                              const circleBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
                              
                              if (iconoData.tipo === 'imagen') {
                                return (
                                  <div 
                                    className="w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: circleBg }}
                                  >
                                    <img 
                                      src={iconoData.valor} 
                                      alt={getNombreInterfaz(child.clave)}
                                      className="w-4 h-4 object-contain"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<span class="text-xs">📄</span>';
                                      }}
                                    />
                                  </div>
                                );
                              }
                              if (iconoData.tipo === 'emoji') {
                                return (
                                  <div 
                                    className="w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: circleBg }}
                                  >
                                    <span className="text-sm leading-none">{iconoData.valor}</span>
                                  </div>
                                );
                              }
                              return (
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: circleBg }}
                                >
                                  <child.icono />
                                </div>
                              );
                            })()}
                          </div>
                          <span className="ml-3">
                            {child.es_dinamica ? child.nombre : getNombreInterfaz(child.clave)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.ruta}
                  className={`
                    flex items-center px-3 py-2.5 rounded-xl
                    transition-all duration-300 ease-in-out
                    group relative overflow-hidden
                    ${isActive(item.ruta) 
                      ? 'bg-white/15 shadow-lg' 
                      : 'hover:bg-white/10'
                    }
                    transform hover:translate-x-1
                  `}
                  style={{ 
                    color: isActive(item.ruta) ? sidebarMenuActiveTextColor : sidebarMenuTextColor,
                    backgroundColor: isActive(item.ruta) ? sidebarMenuActiveBgColor : 'transparent',
                  }}
                >
                  {/* Efecto de gradiente al hacer hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, transparent 40%, ${sidebarMenuActiveBgColor} 100%)`
                    }}
                  />
                  
                  {/*  ICONO CON CÍRCULO DE FONDO */}
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative z-10">
                    {(() => {
                      const iconoData = getIconoModulo(item.clave, item.icono);
                      const circleBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
                      
                      if (iconoData.tipo === 'imagen') {
                        return (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: circleBg }}
                          >
                            <img 
                              src={iconoData.valor} 
                              alt={getNombreInterfaz(item.clave)}
                              className="w-5 h-5 object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span class="text-base">📄</span>';
                              }}
                            />
                          </div>
                        );
                      }
                      if (iconoData.tipo === 'emoji') {
                        return (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: circleBg }}
                          >
                            <span className="text-lg leading-none">{iconoData.valor}</span>
                          </div>
                        );
                      }
                      return (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: circleBg }}
                        >
                          <item.icono />
                        </div>
                      );
                    })()}
                  </div>

                  <span className={`
                    ml-3 text-sm font-medium transition-all duration-300 relative z-10
                    ${isOpen ? 'opacity-100' : 'opacity-0'}
                  `}>
                    {getNombreInterfaz(item.clave)}
                  </span>
                  {isActive(item.ruta) && isOpen && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current relative z-10" />
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/*  Footer con diseño refinado */}
        <div className={`
          pt-3 px-3 pb-3 border-t
          transition-all duration-300
        `} style={{ borderColor: sidebarBorderColor }}>
          <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-2 py-2 rounded-xl bg-white/5`}>
            {/*  Nombre: completo si expandido, solo inicial si comprimido */}
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60" style={{ color: sidebarTextColor }}>
                {isOpen 
                  ? (configSistema.nombre_corto_sistema || 'SmartLift')
                  : (configSistema.nombre_corto_sistema || 'SmartLift').charAt(0).toUpperCase()
                }
              </span>
            </div>
            {/*  Versión: oculta si está comprimido */}
            {isOpen && (
              <span className="text-xs opacity-40" style={{ color: sidebarTextColor }}>
                {configSistema.version_sistema || 'v1.0'}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className={`
              mt-2 w-full flex items-center justify-center gap-2 px-3 py-2.5
              rounded-xl text-sm transition-all duration-300
              hover:bg-white/10 active:scale-95
              group relative overflow-hidden
            `}
            style={{ color: sidebarTextColor }}
            title="Cerrar sesión"
          >
            {/*  Efecto de gradiente al hacer hover en logout */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, transparent 40%, rgba(239,68,68,0.1) 100%)`
              }}
            />
            <IconSignOut />
            <span className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} relative z-10`}>
              Cerrar sesión
            </span>
          </button>
        </div>
      </aside>

      {/*  CSS para animaciones */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /*  Ocultar scrollbar en Chrome/Safari/Edge */
        nav::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <style>{`
        /* ... keyframes slideIn ... */
        
        /* Ocultar scrollbar del sidebar completo */
        aside::-webkit-scrollbar {
          display: none;
        }
        
        /* Ocultar scrollbar del nav */
        nav::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
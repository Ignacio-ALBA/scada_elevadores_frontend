// frontend/src/components/layout/Topbar.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Icono para el menú
const IconMenu = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// Icono para cerrar
const IconClose = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Icono de usuario
const IconUser = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
  </svg>
);

// Icono de logout
const IconLogout = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3z" />
    <path d="M8 7l3 3-3 3M11 10H5" />
  </svg>
);

const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const nombreUsuario = user?.nombre || user?.username || 'Usuario';

  return (
    <>
      {/* Topbar normal (expandido) */}
      <div 
        className={`
          bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 
          transition-all duration-500 ease-in-out
          ${isMinimized ? 'h-0 opacity-0 overflow-hidden p-0 border-0' : 'h-14 opacity-100 px-4 py-2'}
        `}
      >
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          {/* Izquierda: Logo y toggle sidebar */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
              title="Toggle Sidebar"
            >
              <IconMenu />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏢</span>
              <span className="text-sm font-semibold text-white hidden sm:block">
                SmartLift SCADA
              </span>
              <span className="text-[10px] text-cyan-400/70 font-mono hidden md:block">
                v1.0.0
              </span>
            </div>
          </div>

          {/* Centro: Título de la página (si se pasa como prop) */}
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-sm font-medium text-white/80">
              {document.title || 'Interfaz Gráfica'}
            </h1>
          </div>

          {/* Derecha: Usuario y acciones */}
          <div className="flex items-center gap-3">
            {/* Hora */}
            <div className="text-xs text-slate-400 font-mono hidden lg:block">
              {new Date().toLocaleTimeString()}
            </div>

            {/* Botón minimizar */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
              title="Minimizar barra"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <IconUser />
                <span className="text-sm text-white/80 hidden sm:block">{nombreUsuario}</span>
                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-700/50 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-700/50">
                    <p className="text-sm text-white font-medium">{nombreUsuario}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.correo || user?.email || ''}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <IconLogout />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Topbar minimizado (flotante centrado) */}
      <div 
        className={`
          fixed top-3 left-1/2 -translate-x-1/2 z-50
          bg-slate-800/80 backdrop-blur-md rounded-full 
          border border-slate-700/50 shadow-lg shadow-slate-900/50
          transition-all duration-500 ease-in-out
          ${isMinimized ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
        style={{ width: '25%', minWidth: '200px', maxWidth: '400px' }}
      >
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo simplificado */}
          <div className="flex items-center gap-2">
            <span className="text-lg">🏢</span>
            <span className="text-xs font-semibold text-white/80 hidden sm:block">
              SmartLift
            </span>
          </div>

          {/* Hora */}
          <div className="text-[10px] text-cyan-400/60 font-mono">
            {new Date().toLocaleTimeString()}
          </div>

          {/* Botón restaurar */}
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            title="Restaurar barra"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Topbar;

// // frontend/src/components/layout/Topbar.jsx
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { configuracionService } from '../../services/configuracionService';

// // SVG Icono de menú hamburguesa
// const IconMenu = () => (
//   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//   </svg>
// );

// // SVG Icono de campana
// const IconBell = () => (
//   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//     <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
//   </svg>
// );

// // SVG Icono de usuario
// const IconUserCircle = () => (
//   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//     <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
//   </svg>
// );

// const pageTitles = {
//   '/dashboard': 'Dashboard',
//   '/elevadores': 'Elevadores',
//   '/alarmas': 'Alarmas',
//   '/eventos': 'Eventos',
//   '/mantenimiento': 'Mantenimiento',
//   '/reportes': 'Reportes',
//   '/usuarios': 'Usuarios',
//   '/privilegios': 'Privilegios',
//   '/configuraciones': 'Configuraciones',
//   '/integraciones': 'Integraciones',
//   '/monitor': 'Monitor SCADA',
//   '/interfaces-visuales': 'Interfaces Visuales',
//   '/catalogo': 'Catálogo',
//   '/edificios': 'Edificios',
//   '/cabinas': 'Cabinas',
//   '/empresas': 'Empresas',
//   '/parametros-elevador': 'Parámetros Elevador',
//   '/parametros-cabina': 'Parámetros Cabina',
// };

// const Topbar = ({ onMenuClick }) => {
//   const location = useLocation();
//   const [now, setNow] = useState(new Date());
//   const [configEmpresa, setConfigEmpresa] = useState({});
//   const [configSistema, setConfigSistema] = useState({});
//   const [currentPage, setCurrentPage] = useState('Dashboard');

//   // Cargar configuraciones
//   useEffect(() => {
//     const cargarConfiguraciones = async () => {
//       try {
//         const [empresa, sistema] = await Promise.all([
//           configuracionService.getGenerales(),
//           configuracionService.getSistema()
//         ]);
//         setConfigEmpresa(empresa);
//         setConfigSistema(sistema);
//       } catch (error) {
//         console.error('Error cargando configuraciones:', error);
//       }
//     };
//     cargarConfiguraciones();
//   }, []);

//   // Determinar el título de la interfaz actual
//   // useEffect(() => {
//   //   const path = location.pathname;
//   //   let title = 'Dashboard';

//   //   if (path === '/' || path === '/dashboard') {
//   //     title = configSistema.nombre_interfaz_dashboard || 'Dashboard';
//   //   } else if (path === '/monitor') {
//   //     title = configSistema.nombre_interfaz_monitor || 'Monitor SCADA';
//   //   } else if (path === '/interfaces-visuales') {
//   //     title = configSistema.nombre_interfaz_interfaces_visuales || 'Interfaces Visuales';
//   //   } else if (path.startsWith('/interfaces/')) {
//   //     title = configSistema.nombre_interfaz_visualizacion || 'Visualización';
//   //   } else {
//   //     // Otras interfaces con títulos estáticos
//   //     const titles = {
//   //       '/elevadores': 'Elevadores',
//   //       '/alarmas': 'Alarmas',
//   //       '/eventos': 'Eventos',
//   //       '/mantenimiento': 'Mantenimiento',
//   //       '/reportes': 'Reportes',
//   //       '/usuarios': 'Usuarios',
//   //       '/privilegios': 'Privilegios',
//   //       '/configuraciones': 'Configuraciones',
//   //       '/integraciones': 'Integraciones',
//   //       '/catalogo': 'Catálogo',
//   //     };
//   //     title = titles[path] || 'Dashboard';
//   //   }
//   //   setCurrentPage(title);
//   // }, [location, configSistema]);
  
//   // En Topbar.jsx, actualizar el useEffect para usar configSistema
//   useEffect(() => {
//     const path = location.pathname;
//     const pathKey = path === '/' ? '/dashboard' : path;
    
//     let title = pageTitles[pathKey] || 'Dashboard';
    
//     const configKey = {
//       '/dashboard': 'nombre_interfaz_dashboard',
//       '/elevadores': 'nombre_interfaz_elevadores',
//       '/alarmas': 'nombre_interfaz_alarmas',
//       '/eventos': 'nombre_interfaz_eventos',
//       '/mantenimiento': 'nombre_interfaz_mantenimiento',
//       '/reportes': 'nombre_interfaz_reportes',
//       '/usuarios': 'nombre_interfaz_usuarios',
//       '/privilegios': 'nombre_interfaz_privilegios',
//       '/configuraciones': 'nombre_interfaz_configuraciones',
//       '/integraciones': 'nombre_interfaz_integraciones',
//       '/monitor': 'nombre_interfaz_monitor',
//       '/interfaces-visuales': 'nombre_interfaz_interfaces_visuales',
//       '/catalogo': 'nombre_interfaz_catalogo',
//       '/edificios': 'nombre_interfaz_edificios',
//       '/cabinas': 'nombre_interfaz_cabinas',
//       '/empresas': 'nombre_interfaz_empresas',
//     }[pathKey];
    
//     if (configKey && configSistema[configKey]) {
//       title = configSistema[configKey];
//     } else if (path.startsWith('/interfaces/')) {
//       title = configSistema.nombre_interfaz_visualizacion || 'Visualización';
//     }
    
//     setCurrentPage(title);
//   }, [location, configSistema]);

//   return (
//     <header className="bg-white px-4 py-3 border-b border-gray-200 shadow-sm flex justify-between items-center z-40 relative">
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onMenuClick}
//           className="text-primary-500 hover:text-primary-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
//           aria-label="Toggle sidebar"
//         >
//           <IconMenu />
//         </button>
//         <h2 className="text-xl font-semibold text-primary-500 m-0 hidden sm:block">
//           {configEmpresa.empresa_nombre || 'SmartLift'}
//         </h2>
//       </div>
//       <div className="flex items-center gap-3 sm:gap-5">
//         <span className="text-success bg-green-50 px-2 py-1 rounded-full text-xs sm:text-sm hidden xs:block">
//           Sistema Conectado
//         </span>
//         <span className="text-text-secondary text-xs sm:text-sm hidden sm:block">
//           {now.toLocaleDateString('es-MX')} {now.toLocaleTimeString('es-MX')}
//         </span>
//         <button className="text-primary-500 hover:text-primary-700">
//           <IconBell />
//         </button>
//         <button className="text-primary-500 hover:text-primary-700">
//           <IconUserCircle />
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Topbar;

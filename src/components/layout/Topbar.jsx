// frontend/src/components/layout/Topbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSafeTheme } from '../../hooks/useSafeTheme';
import { configuracionService } from '../../services/configuracionService';

import { APP_CONFIG } from '../../config/index.js';

const API_BASE_URL = APP_CONFIG.apiBaseUrl;

//  FUNCIONES DE UTILIDAD - PARSEAR JSON
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

const Topbar = ({ onMenuClick, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [configEmpresa, setConfigEmpresa] = useState({});
  const userMenuRef = useRef(null);
  const themeMenuRef = useRef(null);
  
  const { 
    TEMAS, 
    temaActual, 
    cambiarTema, 
    recargarTemas,
    loading 
  } = useSafeTheme();

  const temaLocal = temaActual || 'default';
  const temaConfig = TEMAS?.[temaLocal] || TEMAS?.default || {};
  const isDark = temaActual === 'oscuro';

  //  EXTRAER VALORES REALES
  const topbarBgColor = getBackgroundValue(temaConfig.topbar) || '#ffffff';
  const topbarTextColor = getRealValue(temaConfig.topbarText) || '#1e293b';
  const topbarBorderColor = getRealValue(temaConfig.border) || 'rgba(0,0,0,0.06)';

  const getInitials = () => {
    if (!user) return 'U';
    const nombre = user?.nombre || '';
    const apellido = user?.apellido_paterno || '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  //  CARGAR CONFIGURACIÓN DE EMPRESA
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const data = await configuracionService.getGenerales();
        setConfigEmpresa(data || {});
      } catch (error) {
        console.error('Error cargando configuración de empresa:', error);
      }
    };
    cargarConfiguracion();
  }, []);

  //  RELOJ EN VIVO
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  //  DETECTAR SCROLL PARA SOMBRA DINÁMICA
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //  Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuItemClick = (path) => {
    setShowUserMenu(false);
    navigate(path);
  };

  const cambiarTemaLocal = async (tema) => {
    try {
      await cambiarTema(tema);
      await recargarTemas();
      localStorage.setItem('tema_actual', tema);
    } catch (error) {
      console.error('❌ [Topbar] Error al cambiar tema:', error);
    }
  };

  const obtenerInicial = (nombre, apellidoPaterno, apellidoMaterno) => {
    const primera = nombre?.charAt(0) || '';
    const segunda = apellidoPaterno?.charAt(0) || '';
    const tercera = apellidoMaterno?.charAt(0) || '';
    return `${primera}${segunda}${tercera}`.toUpperCase();
  };

  const iniciales = user ? obtenerInicial(user.nombre, user.apellido_paterno, user.apellido_materno) : 'U';
  const nombreTemaActual = TEMAS?.[temaLocal]?.nombre || 'Default';

  //  Formatear hora
  const formattedTime = currentTime.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  //  Saludo según la hora
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Buenos días';
    if (hour < 18) return '☀️ Buenas tardes';
    return '🌙 Buenas noches';
  };

  if (loading) {
    return (
      <header className="h-16 flex items-center px-4 bg-white shadow-sm">
        <div className="flex-1 ml-4">
          <h1 className="text-lg font-semibold text-slate-700">SCADA Elevadores</h1>
        </div>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
      </header>
    );
  }

  return (
    <header 
      className={`
        h-16 flex items-center px-4 md:px-6 sticky top-0 z-30
        transition-all duration-300 ease-in-out
        ${isScrolled ? 'shadow-lg' : 'shadow-sm'}
      `}
      style={{ 
        backgroundColor: topbarBgColor,
        color: topbarTextColor,
        borderBottom: `1px solid ${topbarBorderColor}`
      }}
    >
      {/*  Botón hamburguesa con animación */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl transition-all duration-300 hover:bg-black/5 active:scale-95 lg:mr-2"
        style={{ color: topbarTextColor }}
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <span 
            className={`
              absolute block h-0.5 w-6 rounded-full transition-all duration-300
              ${isSidebarOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'}
            `}
            style={{ backgroundColor: topbarTextColor }}
          />
          <span 
            className={`
              absolute block h-0.5 w-6 rounded-full transition-all duration-300
              ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}
              top-3
            `}
            style={{ backgroundColor: topbarTextColor }}
          />
          <span 
            className={`
              absolute block h-0.5 w-6 rounded-full transition-all duration-300
              ${isSidebarOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'}
            `}
            style={{ backgroundColor: topbarTextColor }}
          />
        </div>
      </button>

      {/*  Título con saludo - SIN LOGO */}
      <div className="flex items-center gap-3 ml-1 flex-1 min-w-0">
        <div className="hidden md:block truncate">
          <h1 className="text-sm font-semibold tracking-tight truncate">
            {configEmpresa.empresa_nombre || 'SCADA Elevadores'}
          </h1>
          <p className="text-xs opacity-70 truncate">
            {getGreeting()}, {user?.nombre || 'Usuario'}
          </p>
        </div>
      </div>

      {/*  Hora y fecha - CENTRO */}
      <div className="hidden lg:flex flex-col items-center px-4">
        <span className="text-sm font-mono font-medium tracking-wider">
          {formattedTime}
        </span>
        <span className="text-[10px] opacity-60 capitalize">
          {formattedDate}
        </span>
      </div>

      {/*  Selector de tema */}
      <div className="relative mr-2" ref={themeMenuRef}>
        <button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-black/5 active:scale-95"
          style={{ 
            color: topbarTextColor,
            textShadow: temaActual ? '0 0 20px rgba(255,255,255,0.2)' : 'none'
          }}
          title="Cambiar tema"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
          </svg>
          <span className="hidden md:inline text-sm font-medium">{nombreTemaActual}</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {showThemeMenu && (
          <div 
            className="absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl py-2 z-50 border overflow-hidden"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e5e7eb',
            }}
          >
            <div 
              className="px-3 py-2 border-b"
              style={{
                borderColor: isDark ? '#334155' : '#e5e7eb',
              }}
            >
              <span 
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              >
                Temas
              </span>
            </div>
            {Object.entries(TEMAS || {}).map(([key, tema]) => {
              const previewColor = getBackgroundValue(tema.sidebar) || '#3b82f6';
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    cambiarTemaLocal(key);
                    setShowThemeMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-all duration-150 flex items-center gap-3 hover:bg-black/5"
                  style={{
                    color: temaLocal === key 
                      ? (isDark ? '#38bdf8' : '#1d4ed8') 
                      : (isDark ? '#e2e8f0' : '#1e293b'),
                    backgroundColor: temaLocal === key 
                      ? (isDark ? 'rgba(56,189,248,0.15)' : 'rgba(59,130,246,0.08)')
                      : 'transparent',
                  }}
                >
                  <span 
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-200"
                    style={{ 
                      backgroundColor: previewColor,
                      borderColor: temaLocal === key ? previewColor : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'),
                      boxShadow: temaLocal === key ? `0 0 12px ${previewColor}40` : 'none',
                    }}
                  />
                  <span 
                    className="flex-1 font-medium transition-all duration-200"
                    style={{
                      textShadow: temaLocal === key ? `0 0 20px ${previewColor}30` : 'none',
                    }}
                  >
                    {tema.nombre || key}
                  </span>
                  {temaLocal === key && (
                    <span 
                      className="text-xs ml-auto transition-all duration-200"
                      style={{
                        color: previewColor,
                        textShadow: `0 0 15px ${previewColor}50`,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/*  Menú de usuario - MODIFICADO CON OPCIONES COMPLETAS */}
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 hover:bg-black/5 rounded-xl px-3 py-2 transition-all duration-200 active:scale-95"
          style={{ color: topbarTextColor }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold overflow-hidden">
            {user?.foto_perfil ? (
              <img 
                src={user.foto_perfil.startsWith('http') ? user.foto_perfil : `${API_BASE_URL}${user.foto_perfil}`} 
                alt="Perfil" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  //  Mostrar iniciales cuando la imagen falla
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  const initials = user?.nombre?.charAt(0)?.toUpperCase() || 'U';
                  parent.innerHTML = `<div class="w-full h-full bg-primary-500/10 flex items-center justify-center text-sm font-semibold" style="color: ${topbarTextColor}">${initials}</div>`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-primary-500/10 flex items-center justify-center">
                {getInitials()}
              </div>
            )}
          </div>

          <span className="hidden md:inline text-sm font-medium">
            {user?.nombre} {user?.apellido_paterno}
          </span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {showUserMenu && (
          <div 
            className="absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl py-2 z-50 border overflow-hidden"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e5e7eb',
            }}
          >
            {/* Header del menú - Información del usuario */}
            <div 
              className="px-4 py-3 border-b"
              style={{ borderColor: isDark ? '#334155' : '#e5e7eb' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-semibold overflow-hidden">
                  {user?.foto_perfil ? (
                    <img 
                      src={user.foto_perfil.startsWith('http') ? user.foto_perfil : `${API_BASE_URL}${user.foto_perfil}`} 
                      alt="Perfil" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        const initials = user?.nombre?.charAt(0)?.toUpperCase() || 'U';
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xl font-semibold" style="background-color: ${isDark ? '#1e293b' : '#f1f5f9'}; color: ${isDark ? '#38bdf8' : '#1d4ed8'}">${initials}</div>`;
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-xl font-semibold ${isDark ? 'bg-slate-700 text-cyan-400' : 'bg-primary-100 text-primary-600'}`}>
                      {getInitials()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p 
                    className="font-medium truncate"
                    style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                  >
                    {user?.nombre} {user?.apellido_paterno}
                  </p>
                  <p 
                    className="text-sm truncate"
                    style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    {user?.correo || user?.email}
                  </p>
                </div>
              </div>
              <div 
                className="mt-2 text-sm space-y-0.5"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              >
                {user?.telefono && <p>📱 {user.telefono}</p>}
                <p>👤 {user?.rol_nombre || 'Usuario'}</p>
              </div>
            </div>

            {/* Opciones del menú */}
            <div className="py-1">
              {/*  Mi Perfil - se mantiene */}
              <button
                onClick={() => handleMenuItemClick('/perfil')}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3"
                style={{
                  color: isDark ? '#e2e8f0' : '#1e293b',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>👤</span> Mi Perfil
              </button>

              {/*  Notificaciones - NUEVA RUTA */}
              <button
                onClick={() => handleMenuItemClick('/notificaciones')}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3"
                style={{
                  color: isDark ? '#e2e8f0' : '#1e293b',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>🔔</span> Notificaciones
              </button>

              {/*  Cambiar contraseña - se mantiene */}
              <button
                onClick={() => handleMenuItemClick('/cambiar-contrasena')}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3"
                style={{
                  color: isDark ? '#e2e8f0' : '#1e293b',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>🔑</span> Cambiar contraseña
              </button>
            </div>

            {/* Divisor y cerrar sesión */}
            <div 
              className="border-t pt-1"
              style={{ borderColor: isDark ? '#334155' : '#e5e7eb' }}
            >
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3"
                style={{ color: '#ef4444' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>🚪</span> Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
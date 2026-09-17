// frontend/src/components/layout/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSafeTheme } from '../../hooks/useSafeTheme';
import { useInactivity } from '../../hooks/useInactivity';
import InactivityModal from '../common/InactivityModal';

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
// COMPONENTE MAINLAYOUT
// ============================================

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  //  OBTENER RUTA ACTUAL
  const location = useLocation();
  const isInterfazGrafica = location.pathname.startsWith('/interfaz-grafica/');
  
  //  PASAR enabled SEGÚN LA RUTA
  const { showModal, inactiveTime, handleForcedLogout } = useInactivity(!isInterfazGrafica);
  
  const { temaConfig, loading, temaActual } = useSafeTheme();

  //  LOGS PARA DEPURACIÓN
  // console.log('🎨 [MainLayout] temaConfig.background:', temaConfig?.background);
  // console.log('🎨 [MainLayout] temaConfig.card:', temaConfig?.card);

  //  APLICAR TEMA AL BODY
  useEffect(() => {
    if (!temaConfig) return;
    
    try {
      const bgValue = getBackgroundValue(temaConfig.background) || '#f1f5f9';
      
      // console.log('🎨 [MainLayout] Background aplicado:', bgValue);
      
      //  Limpiar y aplicar fondo
      document.body.className = '';
      document.body.style.backgroundColor = '';
      document.body.style.background = '';
      
      if (typeof bgValue === 'string' && (bgValue.includes('gradient') || bgValue.includes('rgba'))) {
        document.body.style.background = bgValue;
      } else {
        document.body.style.backgroundColor = bgValue;
      }
      
    } catch (error) {
      console.warn('⚠️ [MainLayout] Error aplicando tema:', error);
    }
  }, [temaConfig]);

  //  Manejar hover en el contenido principal
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Resetear inactividad al cambiar de ruta
  useEffect(() => {
    // Disparar evento de actividad al cambiar de ruta
    document.dispatchEvent(new Event('click'));
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          </div>
          <p className="mt-6 text-slate-600 dark:text-slate-400 font-medium animate-pulse">
            Cargando configuración...
          </p>
          <div className="mt-2 flex justify-center gap-1">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      </div>
    );
  }

  //  Obtener valores reales del tema para estilos
  const cardBgColor = getBackgroundValue(temaConfig?.card) || '#ffffff';
  const cardShadow = getRealValue(temaConfig?.cardShadow) || '0 1px 3px rgba(0,0,0,0.06)';
  const textColor = getRealValue(temaConfig?.text) || '#1e293b';

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}
      >
        <div className="sticky top-0 z-30">
          {/*  Pasar estado del sidebar al Topbar */}
          <Topbar 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            isSidebarOpen={sidebarOpen}
          />
        </div>

        {/*  CONTENIDO PRINCIPAL - REDUCIR PADDING Y MÁRGENES */}
        <main 
          className="p-3 md:p-3 lg:p-3 transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className={`
              rounded-2xl min-h-[calc(100vh-7rem)] p-3 md:p-4 lg:p-5
              transition-all duration-300 ease-in-out
              ${isHovering ? 'transform scale-[1.001]' : ''}
            `}
            style={{
              backgroundColor: cardBgColor,
              boxShadow: isHovering 
                ? `0 20px 60px rgba(0,0,0,0.06), ${cardShadow}`
                : cardShadow,
              color: textColor,
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {/* Efectos decorativos sutiles */}
            <div className="relative">
              <div 
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-5 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${getBackgroundValue(temaConfig?.primary) || '#3b82f6'}, transparent 70%)`
                }}
              />
              <div 
                className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-5 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${getBackgroundValue(temaConfig?.primary) || '#8b5cf6'}, transparent 70%)`
                }}
              />
              
              <div className="relative z-10">
                <Outlet />
              </div>
            </div>
          </div>
        </main>

        {/*  Footer minimalista */}
        <footer className="py-3 px-4 text-center">
          <p 
            className="text-xs transition-colors duration-300"
            style={{ 
              color: getRealValue(temaConfig?.textMuted) || '#94a3b8'
            }}
          >
            © {new Date().getFullYear()} SmartLift SCADA
            <span className="mx-2 opacity-30">•</span>
            <span className="opacity-60">v{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span>
          </p>
        </footer>
      </div>
      
      <InactivityModal
        isOpen={showModal}
        onLogout={handleForcedLogout}
        inactiveTime={inactiveTime}
      />
    </div>
  );
};

export default MainLayout;
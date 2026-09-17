// frontend/src/components/pages/InterfazGrafica/HeaderInterfaz.jsx
import React, { useState, useEffect } from 'react';
import { useSafeTheme } from '../../../../../hooks/useSafeTheme';
import { vistasConfiguracionService } from '../../../../../services/vistasConfiguracionService';
import { preferenciasVistaService } from '../../../../../services/preferenciasVistaService';
import { useAuth } from '../../../../../context/AuthContext';

const HeaderInterfaz = ({
  configuracion,
  elevadoresActivos,
  totalElevadores,
  seleccionados = 0,
  modoVista,
  onModoVistaChange,
  onActualizar,
  onClearSelection,
  isDark = false,
  vistaActual,
  onVistaChange,
  vistasDisponibles = []
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [vistasCargadas, setVistasCargadas] = useState([]);
  const ahora = new Date();
  const fechaHora = ahora.toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const { temaConfig } = useSafeTheme();
  const { user } = useAuth();

  // Cargar vistas disponibles si no vienen por props
  useEffect(() => {
    if (vistasDisponibles.length === 0) {
      const cargarVistas = async () => {
        try {
          const data = await vistasConfiguracionService.getActivas();
          setVistasCargadas(data);
        } catch (error) {
          console.error('Error cargando vistas:', error);
        }
      };
      cargarVistas();
    } else {
      setVistasCargadas(vistasDisponibles);
    }
  }, [vistasDisponibles]);

  const estadoGeneral = elevadoresActivos.length === totalElevadores 
    ? '✅ Todos operativos'
    : elevadoresActivos.length === 0 
      ? '⚠️ Sin elevadores operativos'
      : `🟡 ${elevadoresActivos.length}/${totalElevadores} operativos`;

  const handleActualizar = () => {
    onActualizar();
    setTimeout(() => onActualizar(), 100);
  };

  // Clases condicionales
  const headerBg = isDark 
    ? 'bg-gradient-to-r from-slate-800/95 to-slate-900/95' 
    : 'bg-gradient-to-r from-gray-200/95 to-gray-300/95';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-300';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-gray-500';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-400';
  const buttonBg = isDark ? 'bg-slate-700' : 'bg-gray-100';
  const buttonHover = isDark ? 'hover:bg-slate-600' : 'hover:bg-gray-200';
  const buttonText = isDark ? 'text-slate-300' : 'text-gray-600';
  const buttonTextHover = isDark ? 'hover:text-white' : 'hover:text-gray-800';
  const estadoOk = isDark ? 'text-green-400' : 'text-green-600';
  const estadoWarning = isDark ? 'text-yellow-400' : 'text-yellow-600';
  const selectBg = isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800';
  const selectFocus = isDark ? 'focus:ring-cyan-400' : 'focus:ring-primary-500';

  // const vistaSeleccionada = vistaActual || (vistasCargadas.length > 0 ? vistasCargadas[0]?.id_vista : null);
  const vistaSeleccionada = vistaActual?.id_vista || (vistasCargadas.length > 0 ? vistasCargadas[0]?.id_vista : null);

  return (
    <>
      {/* Header completo */}
      <div 
        className={`
          ${headerBg} backdrop-blur-sm 
          border-b ${borderColor} transition-all duration-500 ease-in-out 
          ${collapsed ? 'h-0 opacity-0 py-0 border-0 overflow-hidden' : 'h-auto opacity-100 py-3 px-4 md:px-6'}
        `}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Información de la interfaz (izquierda) */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-2xl md:text-3xl"></div>
            <div>
              <h1 className={`text-base md:text-xl font-bold ${textPrimary} truncate max-w-[150px] sm:max-w-[200px] md:max-w-none`}>
                {configuracion?.nombre || 'Interfaz Gráfica'}
              </h1>
              <p className={`text-[10px] md:text-xs ${textSecondary} truncate max-w-[150px] sm:max-w-[200px] md:max-w-none`}>
                {configuracion?.descripcion || ''}
              </p>
            </div>
          </div>

          {/*  SELECTOR DE VISTAS */}
          {vistasCargadas.length > 0 && (
            <div className="flex items-center gap-2">
              <span className={`text-xs ${textSecondary}`}>Vista:</span>
              <select
                value={vistaSeleccionada || ''}
                onChange={async (e) => {
                  const selectedId = parseInt(e.target.value);
                  const vista = vistasCargadas.find(v => v.id_vista === selectedId);
                  
                  // console.log(' [HeaderInterfaz] Vista seleccionada:', vista);
                  // console.log(' [HeaderInterfaz] user?.id_usuario:', user?.id_usuario);
                  // console.log(' [HeaderInterfaz] configuracion?.id_configuracion:', configuracion?.id_configuracion);
                  
                  if (vista && onVistaChange) {
                    onVistaChange(vista);
                    
                    //  GUARDAR LA VISTA SELECCIONADA EN BD
                    if (user?.id_usuario && configuracion?.id_configuracion) {
                      try {
                        // console.log(' [HeaderInterfaz] Guardando vista...');
                        const result = await preferenciasVistaService.actualizarPreferencias(
                          user.id_usuario,
                          configuracion.id_configuracion,
                          { vista_seleccionada: vista.nombre }
                        );
                        // console.log(' Vista guardada en BD (HeaderInterfaz):', result);
                      } catch (error) {
                        console.error(' Error guardando vista (HeaderInterfaz):', error);
                      }
                    } else {
                      console.warn(' [HeaderInterfaz] No se puede guardar: faltan datos', {
                        userId: user?.id_usuario,
                        configId: configuracion?.id_configuracion
                      });
                    }
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 ${selectBg} ${selectFocus}`}
              >
                {vistasCargadas.map((vista) => (
                  <option key={vista.id_vista} value={vista.id_vista}>
                    {vista.nombre_select || vista.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Selección y botón limpiar */}
          <div className="flex items-center gap-3">
            {seleccionados > 0 && (
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDark ? 'text-cyan-400' : 'text-primary-600'}`}>
                  {seleccionados} seleccionados
                </span>
                <button
                  onClick={() => {
                    if (onClearSelection) {
                      onClearSelection();
                    }
                  }}
                  className={`text-xs ${buttonText} ${buttonTextHover} ${buttonBg} ${buttonHover} px-2 py-1 rounded-lg transition-colors`}
                >
                  ✕ Limpiar Selección
                </button>
              </div>
            )}
          </div>

          {/* Controles (derecha) */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* <div className={`${isDark ? 'bg-slate-700' : 'bg-gray-200'} rounded-lg overflow-hidden`}>
              <button
                onClick={() => onModoVistaChange('2d')}
                className={`px-2 md:px-3 py-1 text-[10px] md:text-sm transition-colors ${
                  modoVista === '2d' 
                    ? isDark ? 'bg-cyan-500 text-white' : 'bg-white text-gray-700 border border-gray-300 shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-600' : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                2D
              </button>
              <button
                onClick={() => onModoVistaChange('3d')}
                className={`px-2 md:px-3 py-1 text-[10px] md:text-sm transition-colors ${
                  modoVista === '3d' 
                    ? isDark ? 'bg-cyan-500 text-white' : 'bg-white text-gray-700 border border-gray-300 shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-600' : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                3D
              </button>
            </div> */}
            <button
              onClick={handleActualizar}
              className={`px-2 md:px-3 py-1 ${isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-primary-500/20 text-primary-600 hover:bg-primary-500/30'} rounded-lg transition-colors text-[10px] md:text-sm font-mono`}
            >
              🔄
            </button>
            <button
              onClick={() => setCollapsed(true)}
              className={`px-2 py-1 ${buttonText} ${buttonTextHover} ${buttonBg} ${buttonHover} rounded-lg transition-colors text-xs`}
              title="Ocultar header"
            >
              ▲
            </button>
          </div>
        </div>

        {/* Fila de estadísticas */}
        <div className="flex justify-end mt-1 md:mt-0">
          <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm flex-wrap">
            <div className="flex items-center gap-1 md:gap-2">
              <span className={textSecondary}>Elevadores:</span>
              <span className={`${textPrimary} font-mono font-bold`}>
                {elevadoresActivos.length}/{totalElevadores}
              </span>
            </div>
            <div className={`text-xs md:text-sm ${elevadoresActivos.length === totalElevadores ? estadoOk : estadoWarning}`}>
              {estadoGeneral}
            </div>
            <div className={`text-[10px] md:text-xs ${textSecondary} font-mono hidden lg:block`}>
              {fechaHora}
            </div>
          </div>
        </div>
      </div>

      {/* Header colapsado (barra delgada) */}
      <div 
        className={`
          ${isDark ? 'bg-slate-800/80' : 'bg-gray-200/80'} backdrop-blur-sm border-b ${borderColor} transition-all duration-500 ease-in-out 
          ${collapsed ? 'h-10 opacity-100 py-1 px-3 md:px-4' : 'h-0 opacity-0 py-0 border-0 overflow-hidden'}
        `}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-base md:text-lg">🏢</span>
            <span className={`text-xs md:text-sm font-medium ${textPrimary} truncate max-w-[100px] sm:max-w-[150px] md:max-w-none`}>
              {configuracion?.nombre_corto || configuracion?.nombre || 'Interfaz'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
            {/*  Selector de vistas en modo colapsado */}
            {vistasCargadas.length > 0 && (
              <select
                value={vistaSeleccionada || ''}
                onChange={async (e) => {
                  const selectedId = parseInt(e.target.value);
                  const vista = vistasCargadas.find(v => v.id_vista === selectedId);
                  if (vista && onVistaChange) {
                    onVistaChange(vista);
                    
                    // GUARDAR LA VISTA SELECCIONADA EN BD
                    if (user?.id_usuario && configuracion?.id_configuracion) {
                      try {
                        await preferenciasVistaService.actualizarPreferencias(
                          user.id_usuario,
                          configuracion.id_configuracion,
                          { vista_seleccionada: vista.nombre }
                        );
                        // console.log(' Vista guardada en BD (colapsado):', vista.nombre);
                      } catch (error) {
                        console.error(' Error guardando vista (colapsado):', error);
                      }
                    }
                  }
                }}
                className={`px-2 py-0.5 rounded text-xs border focus:outline-none focus:ring-1 ${selectBg} ${selectFocus}`}
              >
                {vistasCargadas.map((vista) => (
                  <option key={vista.id_vista} value={vista.id_vista}>
                    {vista.nombre_select || vista.nombre}
                  </option>
                ))}
              </select>
            )}
            
            <span className={`${textSecondary} hidden sm:inline`}>
              {elevadoresActivos.length}/{totalElevadores}
            </span>
            <span className={elevadoresActivos.length === totalElevadores ? estadoOk : estadoWarning}>
              {elevadoresActivos.length === totalElevadores ? '✅' : '🟡'}
            </span>
            <div className="flex items-center gap-1 md:gap-2">
              {/* <div className={`${isDark ? 'bg-slate-700' : 'bg-gray-200'} rounded-lg overflow-hidden text-[10px] md:text-xs`}>
                <button
                  onClick={() => onModoVistaChange('2d')}
                  className={`px-1.5 md:px-2 py-0.5 transition-colors ${
                    modoVista === '2d' 
                      ? isDark ? 'bg-cyan-500 text-white' : 'bg-primary-500 text-white'
                      : isDark ? 'text-slate-300 hover:bg-slate-600' : 'text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  2D
                </button>
                <button
                  onClick={() => onModoVistaChange('3d')}
                  className={`px-1.5 md:px-2 py-0.5 transition-colors ${
                    modoVista === '3d' 
                      ? isDark ? 'bg-cyan-500 text-white' : 'bg-primary-500 text-white'
                      : isDark ? 'text-slate-300 hover:bg-slate-600' : 'text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  3D
                </button>
              </div> */}
              <button
                onClick={handleActualizar}
                className={`px-1.5 md:px-2 py-0.5 ${isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-primary-500/20 text-primary-600 hover:bg-primary-500/30'} rounded-lg transition-colors text-[10px] md:text-xs font-mono`}
              >
                🔄
              </button>
              <button
                onClick={() => setCollapsed(false)}
                className={`px-1.5 md:px-2 py-0.5 ${buttonText} ${buttonTextHover} ${buttonBg} ${buttonHover} rounded-lg transition-colors text-[10px] md:text-xs`}
                title="Expandir header"
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderInterfaz;
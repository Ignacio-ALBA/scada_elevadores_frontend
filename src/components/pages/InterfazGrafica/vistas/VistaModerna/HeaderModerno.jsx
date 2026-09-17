// frontend/src/components/pages/InterfazGrafica/vistas/VistaModerna/HeaderModerno.jsx
import React, { useState, useEffect } from 'react';
import { vistasConfiguracionService } from '../../../../../services/vistasConfiguracionService';
import { preferenciasVistaService } from '../../../../../services/preferenciasVistaService';
import { useAuth } from '../../../../../context/AuthContext';

const HeaderModerno = ({
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
  vistasDisponibles = [],
  anchoCompleto = false,
  onCollapseChange,
  isCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
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
  const { user } = useAuth();

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

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const estadoGeneral = elevadoresActivos.length === totalElevadores 
    ? '✅ Todos operativos'
    : elevadoresActivos.length === 0 
      ? '⚠️ Sin elevadores operativos'
      : `🟡 ${elevadoresActivos.length}/${totalElevadores} operativos`;

  const handleActualizar = () => {
    onActualizar();
    setTimeout(() => onActualizar(), 100);
  };

  const handleCollapseToggle = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

  // Glassmorphism
  const headerBg = isDark 
    ? 'bg-slate-800/60 backdrop-blur-xl' 
    : 'bg-white/60 backdrop-blur-xl';
  const borderColor = isDark ? 'border-slate-700/50' : 'border-gray-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-300' : 'text-gray-500';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-400';
  const glassBg = isDark ? 'bg-slate-700/30' : 'bg-white/30';
  const glassBorder = isDark ? 'border-slate-600/30' : 'border-gray-300/30';
  const estadoOk = isDark ? 'text-green-400' : 'text-green-600';
  const estadoWarning = isDark ? 'text-yellow-400' : 'text-yellow-600';
  const selectBg = isDark ? 'bg-slate-700/50 border-slate-600/50 text-white' : 'bg-white/50 border-gray-300/50 text-gray-800';
  const selectFocus = isDark ? 'focus:ring-cyan-400' : 'focus:ring-primary-500';

  return (
    <>
      <div 
        className={`
          ${headerBg} backdrop-blur-xl 
          border-b ${borderColor} transition-all duration-500 ease-in-out 
          ${collapsed ? 'h-0 opacity-0 py-0 border-0 overflow-hidden' : 'h-auto opacity-100'}
          shadow-lg shadow-black/5
          ${anchoCompleto ? 'w-full' : ''}
        `}
        style={{ 
          width: anchoCompleto ? '100%' : 'auto',
          minHeight: collapsed ? '0' : '56px'  
        }}
      >
        <div className="flex items-center justify-between px-4 py-2 h-full">
          {/* Izquierda */}
          <div className="flex items-center gap-3">
            <span className="text-lg">🚀</span>
            <div>
              <h1 className={`text-sm font-semibold ${textPrimary} tracking-tight`}>
                {configuracion?.nombre || 'Interfaz Gráfica'}
              </h1>
              <p className={`text-[10px] ${textSecondary} opacity-80 hidden sm:block`}>
                {configuracion?.descripcion || 'Vista moderna'}
              </p>
            </div>
          </div>

          {/* Centro - Selector de vistas */}
          {vistasCargadas.length > 0 && (
            <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${glassBg} border ${glassBorder}`}>
              <span className={`text-[10px] ${textSecondary} font-medium`}>Vista:</span>
              <select
                value={vistaActual?.id_vista || ''}
                onChange={async (e) => {
                  const selectedId = parseInt(e.target.value);
                  const vista = vistasCargadas.find(v => v.id_vista === selectedId);
                  
                  // console.log(' [HeaderModerno] Vista seleccionada:', vista);
                  // console.log(' [HeaderModerno] user?.id_usuario:', user?.id_usuario);
                  // console.log(' [HeaderModerno] configuracion?.id_configuracion:', configuracion?.id_configuracion);
                  
                  if (vista && onVistaChange) {
                    onVistaChange(vista);
                    
                    //  GUARDAR LA VISTA SELECCIONADA EN BD
                    if (user?.id_usuario && configuracion?.id_configuracion) {
                      try {
                        console.log('🔍 [HeaderModerno] Guardando vista...');
                        const result = await preferenciasVistaService.actualizarPreferencias(
                          user.id_usuario,
                          configuracion.id_configuracion,
                          { vista_seleccionada: vista.nombre }
                        );
                        // console.log(' Vista guardada en BD:', result);
                      } catch (error) {
                        console.error(' Error guardando vista:', error);
                      }
                    } else {
                      console.warn(' [HeaderModerno] No se puede guardar: faltan datos', {
                        userId: user?.id_usuario,
                        configId: configuracion?.id_configuracion
                      });
                    }
                  }
                }}

                className={`px-2 py-0.5 rounded text-xs border focus:outline-none focus:ring-2 ${selectBg} ${selectFocus} cursor-pointer`}
              >
                {vistasCargadas.map((vista) => (
                  <option key={vista.id_vista} value={vista.id_vista}>
                    {vista.nombre_select || vista.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Derecha - Controles */}
          <div className="flex items-center gap-2">
            {seleccionados > 0 && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${glassBg} border ${glassBorder}`}>
                <span className={`text-[10px] ${isDark ? 'text-cyan-400' : 'text-primary-600'}`}>
                  {seleccionados} sel.
                </span>
                <button
                  onClick={onClearSelection}
                  className={`text-[10px] ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                >
                  ✕
                </button>
              </div>
            )}

            <button
              onClick={handleActualizar}
              className={`p-1.5 rounded-lg transition-all duration-300 ${glassBg} border ${glassBorder} ${isDark ? 'hover:bg-slate-700/50 text-cyan-400' : 'hover:bg-white/70 text-primary-600'}`}
            >
              🔄
            </button>

            {/*  BOTÓN UNIFICADO - mismo tamaño que Carrusel */}
            <button
              onClick={handleCollapseToggle}
              className={`p-1.5 rounded-lg transition-all duration-300 ${glassBg} border ${glassBorder} ${isDark ? 'hover:bg-slate-700/50 text-slate-400' : 'hover:bg-white/70 text-gray-400'}`}
              title={collapsed ? 'Expandir header' : 'Contraer header'}
            >
              {collapsed ? '▼' : '▲'}
            </button>
          </div>
        </div>

        {/* Estado general - más compacto */}
        <div className="flex justify-end px-4 pb-1.5">
          <div className={`flex items-center gap-3 px-3 py-1 rounded-lg ${glassBg} border ${glassBorder}`}>
            <span className={`text-[10px] ${textSecondary}`}>
              {elevadoresActivos.length}/{totalElevadores}
            </span>
            <span className={`text-[10px] ${elevadoresActivos.length === totalElevadores ? estadoOk : estadoWarning}`}>
              {estadoGeneral}
            </span>
            <span className={`text-[9px] ${textMuted} hidden lg:block`}>
              {fechaHora}
            </span>
          </div>
        </div>
      </div>

      {/* Header colapsado */}
      <div 
        className={`
          ${headerBg} backdrop-blur-xl border-b ${borderColor} transition-all duration-500 ease-in-out 
          ${collapsed ? 'h-10 opacity-100 py-0 px-3' : 'h-0 opacity-0 py-0 border-0 overflow-hidden'}
          flex items-center
          ${anchoCompleto ? 'w-full' : ''}
        `}
        style={{ width: anchoCompleto ? '100%' : 'auto' }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-sm">🚀</span>
            <span className={`text-xs font-medium ${textPrimary}`}>
              {configuracion?.nombre_corto || configuracion?.nombre || 'Interfaz'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-[10px] ${textSecondary}`}>
              {elevadoresActivos.length}/{totalElevadores}
            </span>
            <button
              onClick={handleActualizar}
              className={`p-1 rounded transition-all ${isDark ? 'text-cyan-400 hover:bg-slate-700/50' : 'text-primary-600 hover:bg-white/50'}`}
            >
              🔄
            </button>
            <button
              onClick={handleCollapseToggle}
              className={`p-1 rounded transition-all ${isDark ? 'text-slate-400 hover:bg-slate-700/50' : 'text-gray-400 hover:bg-white/50'}`}
            >
              {collapsed ? '▼' : '▲'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default HeaderModerno;
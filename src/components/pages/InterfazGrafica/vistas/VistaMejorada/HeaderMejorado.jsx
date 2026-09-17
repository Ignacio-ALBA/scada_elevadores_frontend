// frontend/src/components/pages/InterfazGrafica/vistas/VistaMejorada/HeaderMejorado.jsx
import React, { useState, useEffect } from 'react';
import { vistasConfiguracionService } from '../../../../../services/vistasConfiguracionService';
import { preferenciasVistaService } from '../../../../../services/preferenciasVistaService';
import { useAuth } from '../../../../../context/AuthContext';

const HeaderMejorado = ({
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
  estadisticasExpandidas,
  onToggleEstadisticas,
  elevadoresFiltrados,
  pisoMinimo,
  pisoMaximo
}) => {
  const [vistasCargadas, setVistasCargadas] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
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

  // Calcular estadísticas resumidas
  const totalCabinas = elevadoresFiltrados.reduce(
    (acc, e) => acc + (e.datos?.cabinas?.length || 0), 0
  );
  
  const estados = { normal: 0, falla: 0, mantenimiento: 0, sismo: 0 };
  elevadoresFiltrados.forEach(e => {
    if (e.datos?.estado) {
      estados[e.datos.estado] = (estados[e.datos.estado] || 0) + 1;
    }
  });

  const estadoGeneral = elevadoresActivos.length === totalElevadores 
    ? '✅ Todos operativos'
    : `🟡 ${elevadoresActivos.length}/${totalElevadores}`;

  // Glassmorphism
  const headerBg = isDark ? 'bg-slate-800/60 backdrop-blur-xl' : 'bg-white/60 backdrop-blur-xl';
  const borderColor = isDark ? 'border-slate-700/50' : 'border-gray-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-300' : 'text-gray-500';
  const glassBg = isDark ? 'bg-slate-700/30' : 'bg-white/30';
  const glassBorder = isDark ? 'border-slate-600/30' : 'border-gray-300/30';
  const selectBg = isDark ? 'bg-slate-700/50 border-slate-600/50 text-white' : 'bg-white/50 border-gray-300/50 text-gray-800';
  const selectFocus = isDark ? 'focus:ring-cyan-400' : 'focus:ring-primary-500';

  if (collapsed) {
    // Header colapsado - solo una línea
    return (
      <div 
        className={`${headerBg} border-b ${borderColor} px-4 py-1 flex items-center justify-between`}
        style={{ minHeight: '32px' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">🚀</span>
          <span className={`text-xs font-medium ${textPrimary}`}>
            {configuracion?.nombre_corto || 'Interfaz'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] ${textSecondary}`}>
            {elevadoresActivos.length}/{totalElevadores}
          </span>
          <button
            onClick={onActualizar}
            className={`p-0.5 rounded ${isDark ? 'text-cyan-400 hover:bg-slate-700/50' : 'text-primary-600 hover:bg-white/50'}`}
          >
            🔄
          </button>
          <button
            onClick={() => setCollapsed(false)}
            className={`p-0.5 rounded ${isDark ? 'text-slate-400 hover:bg-slate-700/50' : 'text-gray-400 hover:bg-white/50'}`}
          >
            ▼
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${headerBg} border-b ${borderColor} px-4 py-2 transition-all duration-300`}
      style={{ minHeight: '56px' }}
    >
      {/* Fila principal - Una sola línea */}
      <div className="flex items-center justify-between gap-3">
        {/* Izquierda: Logo y nombre */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-base">🚀</span>
          <span className={`text-xs font-semibold ${textPrimary} truncate max-w-[120px]`}>
            {configuracion?.nombre_corto || configuracion?.nombre || 'Interfaz'}
          </span>
        </div>

        {/* Centro: Selector de vistas */}
        {vistasCargadas.length > 0 && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg ${glassBg} border ${glassBorder}`}>
            <span className={`text-[10px] ${textSecondary} font-medium`}>Vista:</span>
            <select
              value={vistaActual?.id_vista || ''}
              onChange={async (e) => {
                const selectedId = parseInt(e.target.value);
                const vista = vistasCargadas.find(v => v.id_vista === selectedId);
                
                if (vista && onVistaChange) {
                  onVistaChange(vista);
                  
                  //  GUARDAR LA VISTA SELECCIONADA EN BD
                  if (user?.id_usuario && configuracion?.id_configuracion) {
                    try {
                      await preferenciasVistaService.actualizarPreferencias(
                        user.id_usuario,
                        configuracion.id_configuracion,
                        { vista_seleccionada: vista.nombre }
                      );
                      // console.log(' Vista guardada en BD (HeaderMejorado):', vista.nombre);
                    } catch (error) {
                      console.error('❌ Error guardando vista (HeaderMejorado):', error);
                    }
                  }
                }
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] border focus:outline-none focus:ring-1 ${selectBg} ${selectFocus} cursor-pointer`}
            >
              {vistasCargadas.map((vista) => (
                <option key={vista.id_vista} value={vista.id_vista}>
                  {vista.nombre_select || vista.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Centro: Estadísticas compactas */}
        <div className={`hidden lg:flex items-center gap-2 px-2 py-0.5 rounded-lg ${glassBg} border ${glassBorder}`}>
          <span className={`text-[10px] ${textPrimary} font-mono`}>
            🛗 {totalElevadores} | 🚪 {totalCabinas} | 📊 {pisoMinimo}→{pisoMaximo}
          </span>
          <span className="text-[10px] flex items-center gap-1">
            <span className="text-green-500">●</span>
            <span className={textSecondary}>{estados.normal || 0}</span>
            <span className="text-red-500 ml-1">●</span>
            <span className={textSecondary}>{estados.falla || 0}</span>
            <span className="text-yellow-500 ml-1">●</span>
            <span className={textSecondary}>{estados.mantenimiento || 0}</span>
          </span>
        </div>

        {/* Derecha: Controles */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {seleccionados > 0 && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${glassBg} border ${glassBorder}`}>
              <span className={`text-[10px] ${isDark ? 'text-cyan-400' : 'text-primary-600'}`}>
                {seleccionados}
              </span>
              <button
                onClick={onClearSelection}
                className={`text-[10px] ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ✕
              </button>
            </div>
          )}

          <span className={`text-[10px] hidden md:inline ${elevadoresActivos.length === totalElevadores ? 'text-green-500' : 'text-yellow-500'}`}>
            {estadoGeneral}
          </span>

          {/* Botón expandir estadísticas */}
          <button
            onClick={onToggleEstadisticas}
            className={`p-1 rounded transition-all ${glassBg} border ${glassBorder} ${isDark ? 'text-cyan-400 hover:bg-slate-700/50' : 'text-primary-600 hover:bg-white/70'}`}
            title={estadisticasExpandidas ? 'Ocultar estadísticas' : 'Mostrar estadísticas'}
          >
            {estadisticasExpandidas ? '📊' : '📈'}
          </button>

          <button
            onClick={onActualizar}
            className={`p-1 rounded transition-all ${glassBg} border ${glassBorder} ${isDark ? 'text-cyan-400 hover:bg-slate-700/50' : 'text-primary-600 hover:bg-white/70'}`}
          >
            🔄
          </button>

          <button
            onClick={() => setCollapsed(true)}
            className={`p-1 rounded transition-all ${glassBg} border ${glassBorder} ${isDark ? 'text-slate-400 hover:bg-slate-700/50' : 'text-gray-400 hover:bg-white/70'}`}
            title="Colapsar header"
          >
            ▲
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMejorado;
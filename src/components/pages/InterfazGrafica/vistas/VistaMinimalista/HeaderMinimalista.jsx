// frontend/src/components/pages/InterfazGrafica/vistas/VistaMinimalista/HeaderMinimalista.jsx
import React, { useState, useEffect } from 'react';
import { vistasConfiguracionService } from '../../../../../services/vistasConfiguracionService';
import { preferenciasVistaService } from '../../../../../services/preferenciasVistaService';
import { useAuth } from '../../../../../context/AuthContext';
import { useDraggable } from './useDraggable';

const HeaderMinimalista = ({
  posicion,
  onPositionChange,
  containerRef,
  configuracion,
  elevadoresActivos,
  totalElevadores,
  seleccionados = 0,
  onActualizar,
  onClearSelection,
  isDark = false,
  vistaActual,
  onVistaChange,
  vistasDisponibles = []
}) => {
  const [expandido, setExpandido] = useState(false);
  const [vistasCargadas, setVistasCargadas] = useState([]);
  const { user } = useAuth();

  const { position, isDragging, elementRef, handleMouseDown } = useDraggable({
    initialPosition: posicion,
    onPositionChange: onPositionChange,
    containerRef: containerRef,
    enabled: true,
  });

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

  const handleVistaChange = async (e) => {
    const selectedId = parseInt(e.target.value);
    const vista = vistasCargadas.find(v => v.id_vista === selectedId);
    
    if (vista && onVistaChange) {
      onVistaChange(vista);
      
      // ✅ Guardar con id_configuracion (aprendizaje de bugs anteriores)
      if (user?.id_usuario && configuracion?.id_configuracion) {
        try {
          await preferenciasVistaService.actualizarPreferencias(
            user.id_usuario,
            configuracion.id_configuracion,
            { vista_seleccionada: vista.nombre }
          );
        } catch (error) {
          console.error('Error guardando vista:', error);
        }
      }
    }
  };

  const glassBg = isDark 
    ? 'bg-slate-800/80 backdrop-blur-md border-slate-700/50' 
    : 'bg-white/80 backdrop-blur-md border-gray-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-300' : 'text-gray-500';
  const selectBg = isDark 
    ? 'bg-slate-700/50 border-slate-600/50 text-white' 
    : 'bg-white/60 border-gray-300/50 text-gray-800';
  const estadoOk = isDark ? 'text-green-400' : 'text-green-600';
  const estadoWarning = isDark ? 'text-yellow-400' : 'text-yellow-600';

  return (
    <div
      ref={elementRef}
      className={`absolute z-20 ${glassBg} border rounded-xl shadow-lg transition-shadow ${
        isDragging ? 'shadow-2xl cursor-grabbing scale-105' : 'cursor-grab'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* ✅ MODO COMPACTO */}
      {!expandido && (
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-xs">🚀</span>
          <span className={`text-[10px] font-semibold ${textPrimary} truncate max-w-[80px]`}>
            {configuracion?.nombre_corto || 'Intf'}
          </span>
          <span className={`text-[10px] ${elevadoresActivos.length === totalElevadores ? estadoOk : estadoWarning}`}>
            {elevadoresActivos.length}/{totalElevadores}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandido(true);
            }}
            className={`p-0.5 rounded text-[10px] ${textSecondary} hover:bg-black/10 transition-all`}
            title="Expandir header"
          >
            ▼
          </button>
        </div>
      )}

      {/* ✅ MODO EXPANDIDO */}
      {expandido && (
        <div className="p-2 min-w-[260px] max-w-[320px]">
          {/* Fila 1: Nombre + Botón contraer */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm">🚀</span>
              <span className={`text-xs font-semibold ${textPrimary} truncate`}>
                {configuracion?.nombre_corto || configuracion?.nombre || 'Interfaz'}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandido(false);
              }}
              className={`p-0.5 rounded text-[10px] ${textSecondary} hover:bg-black/10 transition-all`}
              title="Contraer header"
            >
              ▲
            </button>
          </div>

          {/* Fila 2: Selector de vista */}
          {vistasCargadas.length > 0 && (
            <div className="flex items-center gap-1 mb-1">
              <span className={`text-[10px] ${textSecondary} flex-shrink-0`}>Vista:</span>
              <select
                value={vistaActual?.id_vista || ''}
                onChange={handleVistaChange}
                onClick={(e) => e.stopPropagation()}
                className={`flex-1 px-1.5 py-0.5 rounded text-[10px] border focus:outline-none focus:ring-1 ${selectBg} cursor-pointer`}
              >
                {vistasCargadas.map((vista) => (
                  <option key={vista.id_vista} value={vista.id_vista}>
                    {vista.nombre_select || vista.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Fila 3: Estado + Controles */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className={textSecondary}>
                {elevadoresActivos.length}/{totalElevadores}
              </span>
              {seleccionados > 0 && (
                <>
                  <span className={textSecondary}>•</span>
                  <span className={isDark ? 'text-cyan-400' : 'text-primary-600'}>
                    {seleccionados} sel.
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              {seleccionados > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearSelection && onClearSelection();
                  }}
                  className={`p-0.5 rounded text-[10px] ${textSecondary} hover:bg-black/10`}
                  title="Limpiar selección"
                >
                  ✕
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onActualizar && onActualizar();
                }}
                className={`p-0.5 rounded text-[10px] ${textSecondary} hover:bg-black/10`}
                title="Actualizar"
              >
                🔄
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderMinimalista;
// frontend/src/components/pages/InterfazGrafica/vistas/VistaMinimalista/ControlesAlturaMinimalista.jsx
import React, { useState } from 'react';
import { useDraggable } from './useDraggable';

const ControlesAlturaMinimalista = ({
  posicion,
  onPositionChange,
  containerRef,
  onMatrizHeightChange,
  isDark = false,
}) => {
  const [expandido, setExpandido] = useState(false);

  const { position, isDragging, elementRef, handleMouseDown } = useDraggable({
    initialPosition: posicion,
    onPositionChange: onPositionChange,
    containerRef: containerRef,
    enabled: true,
  });

  const glassBg = isDark 
    ? 'bg-slate-800/80 backdrop-blur-md border-slate-700/50' 
    : 'bg-white/80 backdrop-blur-md border-gray-200/50';
  const textSecondary = isDark ? 'text-slate-300' : 'text-gray-500';
  const buttonClass = `p-0.5 rounded text-[10px] ${textSecondary} hover:bg-black/10 transition-all`;

  const handleAction = (action) => {
    if (onMatrizHeightChange) {
      onMatrizHeightChange(action);
    }
  };

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
        <div className="flex items-center gap-1 px-2 py-1">
          <span className="text-xs">📏</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandido(true);
            }}
            className={buttonClass}
            title="Expandir controles"
          >
            ▼
          </button>
        </div>
      )}

      {/* ✅ MODO EXPANDIDO */}
      {expandido && (
        <div className="px-2 py-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[10px] font-semibold ${textSecondary}`}>📏 Altura</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandido(false);
              }}
              className={buttonClass}
              title="Contraer controles"
            >
              ▲
            </button>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction('increase');
              }}
              className={buttonClass}
              title="Aumentar altura (+50px)"
            >
              ⬆️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction('decrease');
              }}
              className={buttonClass}
              title="Disminuir altura (-50px)"
            >
              ⬇️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction('fit');
              }}
              className={buttonClass}
              title="Ajustar a ventana"
            >
              🔲
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction('reset');
              }}
              className={buttonClass}
              title="Restaurar altura (400px)"
            >
              ↩️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlesAlturaMinimalista;
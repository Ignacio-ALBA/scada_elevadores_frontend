// frontend/src/components/pages/InterfazGrafica/vistas/VistaMinimalista/LeyendaMinimalista.jsx
import React, { useState } from 'react';
import { useDraggable } from './useDraggable';

const LeyendaMinimalista = ({
  posicion,
  onPositionChange,
  containerRef,
  estados = [],
  isDark = false
}) => {
  const [expandida, setExpandida] = useState(false);

  const { position, isDragging, elementRef, handleMouseDown } = useDraggable({
    initialPosition: posicion,
    onPositionChange: onPositionChange,
    containerRef: containerRef,
    enabled: true,
  });

  const glassBg = isDark 
    ? 'bg-slate-800/80 backdrop-blur-md border-slate-700/50' 
    : 'bg-white/80 backdrop-blur-md border-gray-200/50';
  const textColor = isDark ? 'text-slate-300' : 'text-gray-600';
  const textSecondary = isDark ? 'text-slate-500' : 'text-gray-400';

  return (
    <div
      ref={elementRef}
      className={`absolute z-20 ${glassBg} border rounded-xl shadow-lg transition-shadow ${
        isDragging ? 'shadow-2xl cursor-grabbing scale-105' : 'cursor-grab'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translateX(-50%)',
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* ✅ MODO COMPACTO */}
      {!expandida && (
        <div className="flex items-center gap-1 px-2 py-1">
          <span className="text-xs">🎨</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandida(true);
            }}
            className={`p-0.5 rounded text-[10px] ${textSecondary} hover:bg-black/10`}
            title="Expandir leyenda"
          >
            ▼
          </button>
        </div>
      )}

      {/* ✅ MODO EXPANDIDO */}
      {expandida && (
        <div className="px-2 py-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[10px] font-semibold ${textColor}`}>🎨 Leyenda</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandida(false);
              }}
              className={`p-0.5 rounded text-[10px] ${textSecondary} hover:bg-black/10`}
              title="Contraer leyenda"
            >
              ▲
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {estados.filter(e => e.activo).slice(0, 10).map(estado => (
              <span key={estado.clave} className="flex items-center gap-1">
                <span 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: estado.color }}
                />
                <span className={`text-[9px] ${textColor}`}>{estado.nombre}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeyendaMinimalista;
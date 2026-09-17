// frontend/src/components/pages/InterfazGrafica/vistas/VistaMinimalista/EstadisticasMinimalista.jsx
import React, { useState } from 'react';
import { useDraggable } from './useDraggable';

const EstadisticasMinimalista = ({
  posicion,
  onPositionChange,
  containerRef,
  elevadores,
  pisoMinimo,
  pisoMaximo,
  isDark = false
}) => {
  const [expandido, setExpandido] = useState(false);

  const { position, isDragging, elementRef, handleMouseDown } = useDraggable({
    initialPosition: posicion,
    onPositionChange: onPositionChange,
    containerRef: containerRef,
    enabled: true,
  });

  const totalElevadores = elevadores.length;
  const totalCabinas = elevadores.reduce((acc, e) => acc + (e.datos?.cabinas?.length || 0), 0);

  const estados = { normal: 0, falla: 0, mantenimiento: 0, sismo: 0 };
  elevadores.forEach(e => {
    const estado = e.datos?.estado;
    if (estado) estados[estado] = (estados[estado] || 0) + 1;
  });

  const glassBg = isDark 
    ? 'bg-slate-800/80 backdrop-blur-md border-slate-700/50' 
    : 'bg-white/80 backdrop-blur-md border-gray-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-300' : 'text-gray-500';
  const textGreen = isDark ? 'text-green-400' : 'text-green-600';
  const textRed = isDark ? 'text-red-400' : 'text-red-600';
  const textYellow = isDark ? 'text-yellow-400' : 'text-yellow-600';
  const textOrange = isDark ? 'text-orange-400' : 'text-orange-600';
  const barBg = isDark ? 'bg-slate-700' : 'bg-gray-200';

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
      {!expandido && (
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-xs">📊</span>
          <span className={`text-[10px] font-mono ${textPrimary}`}>
            🛗{totalElevadores} 🚪{totalCabinas}
          </span>
          <span className={`text-[10px] ${textGreen}`}>
            ●{estados.normal || 0}
          </span>
          <span className={`text-[10px] ${textRed}`}>
            ●{estados.falla || 0}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandido(true);
            }}
            className={`p-0.5 rounded text-[10px] ${textSecondary} hover:bg-black/10 transition-all`}
            title="Expandir estadísticas"
          >
            ▼
          </button>
        </div>
      )}

      {/* ✅ MODO EXPANDIDO */}
      {expandido && (
        <div className="p-2 min-w-[220px] max-w-[280px]">
          {/* Fila 1: Título + botón contraer */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-xs font-semibold ${textPrimary}`}>📊 Estadísticas</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandido(false);
              }}
              className={`p-0.5 rounded text-[10px] ${textSecondary} hover:bg-black/10 transition-all`}
              title="Contraer estadísticas"
            >
              ▲
            </button>
          </div>

          {/* Fila 2: Conteos */}
          <div className="grid grid-cols-3 gap-1 mb-1.5">
            <div className="text-center">
              <div className={`text-sm font-bold ${textPrimary}`}>{totalElevadores}</div>
              <div className={`text-[9px] ${textSecondary}`}>Elevadores</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-bold ${textPrimary}`}>{totalCabinas}</div>
              <div className={`text-[9px] ${textSecondary}`}>Cabinas</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-bold ${textPrimary}`}>{pisoMinimo}→{pisoMaximo}</div>
              <div className={`text-[9px] ${textSecondary}`}>Pisos</div>
            </div>
          </div>

          {/* Fila 3: Estados */}
          <div className="space-y-0.5 mb-1.5">
            <div className="flex justify-between text-[10px]">
              <span className={textGreen}>✅ Normal</span>
              <span className={`${textPrimary} font-mono`}>{estados.normal || 0}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className={textYellow}>⚠️ Mant.</span>
              <span className={`${textPrimary} font-mono`}>{estados.mantenimiento || 0}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className={textRed}>❌ Falla</span>
              <span className={`${textPrimary} font-mono`}>{estados.falla || 0}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className={textOrange}>🌊 Sismo</span>
              <span className={`${textPrimary} font-mono`}>{estados.sismo || 0}</span>
            </div>
          </div>

          {/* Fila 4: Barra */}
          <div className="flex items-center gap-1">
            <div className={`flex-1 h-1.5 ${barBg} rounded-full overflow-hidden flex`}>
              <div className="h-full bg-green-500" style={{ width: `${(estados.normal / totalElevadores) * 100 || 0}%` }} />
              <div className="h-full bg-yellow-500" style={{ width: `${((estados.mantenimiento || 0) / totalElevadores) * 100 || 0}%` }} />
              <div className="h-full bg-red-500" style={{ width: `${((estados.falla || 0) / totalElevadores) * 100 || 0}%` }} />
              <div className="h-full bg-orange-500" style={{ width: `${((estados.sismo || 0) / totalElevadores) * 100 || 0}%` }} />
            </div>
            <span className={`text-[9px] ${textSecondary} font-mono`}>
              {Math.round((estados.normal / totalElevadores) * 100 || 0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstadisticasMinimalista;
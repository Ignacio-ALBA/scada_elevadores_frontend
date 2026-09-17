// frontend/src/components/pages/InterfazGrafica/CabinaMarker.jsx
import React from 'react';

const CabinaMarker = ({ cabina, x, y, size, onClick, isDark = false }) => {
  const estadoColores = {
    normal: isDark ? 'border-green-400 bg-green-500/20' : 'border-green-500 bg-green-100/50',
    alerta: isDark ? 'border-yellow-400 bg-yellow-500/20' : 'border-yellow-500 bg-yellow-100/50',
    falla_critica: isDark ? 'border-red-400 bg-red-500/20' : 'border-red-500 bg-red-100/50',
    desconocido: isDark ? 'border-gray-400 bg-gray-500/20' : 'border-gray-400 bg-gray-100/50'
  };

  const estadoIconos = {
    normal: '✅',
    alerta: '⚠️',
    falla_critica: '❌',
    desconocido: '❓'
  };

  const colorClase = estadoColores[cabina.estado] || estadoColores.desconocido;
  const tooltipBg = isDark ? 'bg-slate-800' : 'bg-white';
  const tooltipText = isDark ? 'text-white' : 'text-gray-800';
  const tooltipBorder = isDark ? 'border-slate-700' : 'border-gray-200';

  return (
    <div
      onClick={onClick}
      className={`absolute rounded-full border-2 ${colorClase} flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg ${isDark ? 'hover:shadow-cyan-500/20' : 'hover:shadow-primary-500/20'}`}
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        zIndex: 10
      }}
    >
      <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {cabina.nombre_corto || cabina.nombre?.charAt(0) || 'C'}
      </span>
      <span className="absolute -top-1 -right-1 text-[8px]">
        {estadoIconos[cabina.estado] || '❓'}
      </span>
      
      {/* Tooltip al hover */}
      <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 ${tooltipBg} border ${tooltipBorder} rounded text-[10px] ${tooltipText} whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none shadow-lg`}>
        {cabina.nombre}
        <br />
        Piso: {cabina.piso_actual}
        <br />
        {cabina.valor} {cabina.unidad}
      </div>
    </div>
  );
};

export default CabinaMarker;
// frontend/src/components/pages/InterfazGrafica/CabinaMarker.jsx
import React from 'react';

const CabinaMarker = ({ cabina, x, y, size, onClick }) => {
  const estadoColores = {
    normal: 'border-green-400 bg-green-500/20',
    alerta: 'border-yellow-400 bg-yellow-500/20',
    falla_critica: 'border-red-400 bg-red-500/20',
    desconocido: 'border-gray-400 bg-gray-500/20'
  };

  const estadoIconos = {
    normal: '✅',
    alerta: '⚠️',
    falla_critica: '❌',
    desconocido: '❓'
  };

  const colorClase = estadoColores[cabina.estado] || estadoColores.desconocido;

  return (
    <div
      onClick={onClick}
      className={`absolute rounded-full border-2 ${colorClase} flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20`}
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        zIndex: 10
      }}
    >
      <span className="text-xs font-bold text-white">
        {cabina.nombre_corto || cabina.nombre?.charAt(0) || 'C'}
      </span>
      <span className="absolute -top-1 -right-1 text-[8px]">
        {estadoIconos[cabina.estado] || '❓'}
      </span>
      
      {/* Tooltip al hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 rounded text-[10px] text-white whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
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
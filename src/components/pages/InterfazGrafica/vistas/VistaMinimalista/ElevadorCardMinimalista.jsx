// frontend/src/components/pages/InterfazGrafica/vistas/VistaMinimalista/ElevadorCardMinimalista.jsx
import React from 'react';

import { APP_CONFIG } from '../../../../../config/index.js';

const API_BASE_URL = APP_CONFIG.apiBaseUrl;

const ElevadorCardMinimalista = ({ 
  elevador, 
  seleccionado, 
  onClick, 
  isDark = false, 
  onViewPopup = null,
  iconos = {},
  expandido = false,
  vistaActual = null
}) => {
  const { datos } = elevador;
  const estado = datos?.estado || 'desconocido';
  const cabinas = datos?.cabinas || [];

  const getIconoElevador = () => {
    const icono = iconos['elevador'];
    if (icono?.url) {
      return icono.url.startsWith('http') ? icono.url : `${API_BASE_URL}${icono.url}`;
    }
    return null;
  };

  const estadoBg = {
    normal: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700',
    falla: isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700',
    mantenimiento: isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
    sismo: isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700',
    desconocido: isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
  };

  const glassBg = isDark ? 'bg-slate-800/60 backdrop-blur-md' : 'bg-white/60 backdrop-blur-md';
  const glassBorder = isDark ? 'border-slate-700/50' : 'border-gray-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-gray-500';
  const selectBg = isDark ? 'bg-slate-700' : 'bg-gray-100';

    // ✅ MODO COMPACTO (36px - más minimalista)
  if (!expandido) {
    return (
      <div
        onClick={onClick}
        className={`
          ${glassBg} ${glassBorder}
          px-1.5 py-0.5 rounded-md border cursor-pointer 
          transition-all duration-200
          hover:scale-[1.02] 
          ${seleccionado ? `ring-2 ${isDark ? 'ring-cyan-400' : 'ring-primary-500'}` : ''}
        `}
        style={{ height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        {/* Icono */}
        <div 
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: '24px', height: '24px' }}
        >
          {getIconoElevador() ? (
            <img 
              src={getIconoElevador()} 
              alt="Elevador"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-base">🏢</span>
          )}
        </div>

        {/* Info súper compacta */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <div className={`text-[10px] font-bold ${textPrimary} truncate`}>
            {elevador.nombre_corto || elevador.codigo}
          </div>
          <div className={`text-[9px] ${textSecondary} font-mono flex-shrink-0`}>
            📍{datos?.piso_actual ?? '--'}
          </div>
        </div>
      </div>
    );
  }

    // ✅ MODO EXPANDIDO (140px - más minimalista, antes era 180px)
  return (
    <div
      onClick={onClick}
      className={`
        ${glassBg} ${glassBorder}
        p-2 rounded-xl border cursor-pointer 
        transition-all duration-300 ease-out
        hover:scale-[1.02]
        ${seleccionado ? `ring-2 ${isDark ? 'ring-cyan-400' : 'ring-primary-500'} scale-[1.02]` : ''}
      `}
      style={{ height: '140px', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start flex-shrink-0 mb-1.5">
        <div className="min-w-0 flex-1">
          <h3 className={`font-bold text-[11px] truncate ${textPrimary}`}>
            {elevador.nombre_corto || elevador.codigo}
          </h3>
          <span className={`text-[9px] font-mono ${textSecondary}`}>{elevador.codigo}</span>
        </div>
        <span className={`px-1 py-0.5 rounded-full text-[8px] font-medium flex-shrink-0 ${estadoBg[estado] || estadoBg.desconocido}`}>
          {estado}
        </span>
      </div>

      {/* Cabinas */}
      <div className={`flex-1 ${selectBg} rounded-md p-1.5 overflow-hidden`}>
        {cabinas.length === 0 ? (
          <div className={`flex items-center justify-center h-full text-[9px] ${textSecondary}`}>
            Sin cabinas
          </div>
        ) : (
          <div className="space-y-0.5">
            {cabinas.slice(0, 3).map((cabina, idx) => (
              <div key={idx} className={`flex items-center justify-between text-[9px] ${textPrimary}`}>
                <span>C{idx + 1}</span>
                <span>📍 {cabina.piso_actual ?? '--'}</span>
                <span>🎯 {cabina.piso_destino ?? '--'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-shrink-0 mt-1.5">
        <div className={`flex items-center gap-2 text-[9px] ${textSecondary}`}>
          <span>📍 {datos?.piso_actual ?? '--'}</span>
          <span>🎯 {datos?.piso_destino ?? '--'}</span>
        </div>
        {onViewPopup && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewPopup(elevador);
            }}
            className={`px-1 py-0.5 text-[9px] rounded ${
              isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-primary-500/20 text-primary-600'
            }`}
          >
            👁️
          </button>
        )}
      </div>
    </div>
  );
};

export default ElevadorCardMinimalista;

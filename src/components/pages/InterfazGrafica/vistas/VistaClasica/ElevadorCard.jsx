// frontend/src/components/pages/InterfazGrafica/ElevadorCard.jsx
import React from 'react';
import { IconElevadorSmall, IconCabinaSmall, IconDireccion, IconEstado } from './icons.jsx';

const estadoColores = {
  normal: 'border-green-500/50 bg-green-500/10',
  falla: 'border-red-500/50 bg-red-500/10',
  mantenimiento: 'border-orange-500/50 bg-orange-500/10',
  sismo: 'border-cyan-500/50 bg-cyan-500/10', 
  desconocido: 'border-gray-500/50 bg-gray-500/10'
};

const estadoCirculo = {
  normal: 'text-green-400',
  falla: 'text-red-400',
  mantenimiento: 'text-orange-400', 
  sismo: 'text-cyan-400',
  desconocido: 'text-gray-400'
};

const ElevadorCard = ({ elevador, seleccionado, onClick, isDark = false, onViewPopup = null }) => {
  const { datos } = elevador;
  const estado = datos?.estado || 'desconocido';
  const colorClase = estadoColores[estado] || estadoColores.desconocido;
  const cabinas = datos?.cabinas || [];

  //  Clases condicionales
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-gray-500';
  const textMuted = isDark ? 'text-slate-500' : 'text-gray-400';
  const borderHover = isDark ? 'hover:border-gray-500' : 'hover:border-gray-400';
  const bgMuted = isDark ? 'bg-slate-800/30' : 'bg-gray-100/50';
  const estadoBg = {
    normal: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700',
    falla: isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700',
    mantenimiento: isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
    sismo: isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700',
    desconocido: isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
  };
  const cabinaEstadoBg = {
    normal: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700',
    alerta: isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
    falla_critica: isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700',
    desconocido: isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
  };

  return (
    <div
      onClick={onClick}
      className={`elevador-card p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        colorClase
      } ${
        seleccionado ? `ring-2 ${isDark ? 'ring-cyan-400 shadow-lg shadow-cyan-500/20' : 'ring-primary-500 shadow-lg shadow-primary-500/20'} scale-[1.02]` : ''
      } hover:scale-[1.02] hover:shadow-xl ${borderHover}`}
      style={{
        width: '100%',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Cabecera */}
      <div className="flex justify-between items-start flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <IconElevadorSmall estado={estado} />
          <div className="min-w-0">
            <h3 className={`font-bold text-sm truncate ${textPrimary}`}>
              {elevador.nombre_corto || elevador.codigo}
            </h3>
            <span className={`text-[10px] font-mono ${textSecondary}`}>{elevador.codigo}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <IconEstado estado={estado} />
          <IconDireccion sentido={datos?.sentido || 'frenado'} size={16} />
          {/* Botón View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // console.log(' [ElevadorCard] Click en View, onViewPopup existe?', onViewPopup ? '✅ sí' : '❌ no');
              // console.log(' [ElevadorCard] Elevador:', elevador);
              if (onViewPopup) {
                onViewPopup(elevador);
              } else {
                console.warn('⚠️ [ElevadorCard] onViewPopup es null o undefined');
              }
            }}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              isDark 
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' 
                : 'bg-primary-500/20 text-primary-600 hover:bg-primary-500/30'
            }`}
          >
            👁️ View
          </button>
        </div>
      </div>

      {/* Estado y pisos */}
      <div className="flex items-center gap-2 text-xs flex-shrink-0">
        <span className={`px-2 py-0.5 rounded-full ${estadoBg[estado] || estadoBg.desconocido}`}>
          {estado}
        </span>
        <span className={textSecondary}>
          📍 {datos?.piso_actual ?? '--'}
        </span>
        <span className={textSecondary}>
          🎯 {datos?.piso_destino ?? '--'}
        </span>
      </div>

      {/* Cabinas */}
      <div className="flex-1 flex flex-col justify-center min-h-[60px]">
        {cabinas.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className={`text-xs ${textMuted}`}>Sin cabinas</span>
          </div>
        ) : (
          <div className="space-y-1">
            {cabinas.slice(0, 2).map((cabina, idx) => (
              <div key={idx} className={`flex items-center gap-2 text-xs ${textSecondary} ${bgMuted} rounded-lg px-2 py-1`}>
                <IconCabinaSmall 
                  estado={cabina.estado || 'normal'}
                  numero={idx + 1}
                />
                <span className="flex-1 truncate">{cabina.nombre || `Cabina ${idx+1}`}</span>
                <span className={`px-1.5 py-0.5 rounded flex-shrink-0 ${cabinaEstadoBg[cabina.estado] || cabinaEstadoBg.desconocido}`}>
                  {cabina.piso_actual ?? '--'}
                </span>
              </div>
            ))}
            {cabinas.length > 2 && (
              <span className={`text-[10px] ${textMuted}`}>
                +{cabinas.length - 2} cabinas más
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElevadorCard;

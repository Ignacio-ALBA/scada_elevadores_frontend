// frontend/src/components/pages/InterfazGrafica/vistas/VistaModerna/ElevadorCardModerno.jsx
import React from 'react';
import { IconElevadorSmall, IconCabinaSmall, IconDireccion, IconEstado } from '../VistaClasica/icons.jsx';

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

const ElevadorCardModerno = ({ elevador, seleccionado, onClick, isDark = false, onViewPopup = null }) => {
  const { datos } = elevador;
  const estado = datos?.estado || 'desconocido';
  const colorClase = estadoColores[estado] || estadoColores.desconocido;
  const cabinas = datos?.cabinas || [];

  // Glassmorphism clases
  const glassBg = isDark 
    ? 'bg-slate-800/40 backdrop-blur-sm' 
    : 'bg-white/40 backdrop-blur-sm';
  const glassBorder = isDark ? 'border-slate-700/50' : 'border-gray-200/50';
  const glassShadow = isDark 
    ? 'shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-cyan-500/10' 
    : 'shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary-500/10';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-300' : 'text-gray-500';
  const textMuted = isDark ? 'text-slate-500' : 'text-gray-400';
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
      className={`
        ${glassBg} ${glassBorder} ${glassShadow}
        p-4 rounded-2xl border cursor-pointer 
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:translate-y-[-4px]
        ${colorClase}
        ${seleccionado ? `ring-2 ${isDark ? 'ring-cyan-400 shadow-2xl shadow-cyan-500/30' : 'ring-primary-500 shadow-2xl shadow-primary-500/30'} scale-[1.02]` : ''}
      `}
      style={{
        width: '100%',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Cabecera con badge y botón View */}
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
          {onViewPopup && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewPopup(elevador);
              }}
              className={`px-2 py-0.5 text-[10px] rounded transition-all duration-200 ${isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20' : 'bg-primary-500/20 text-primary-600 hover:bg-primary-500/30 hover:shadow-lg hover:shadow-primary-500/20'}`}
            >
              👁️ View
            </button>
          )}
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

      {/* Cabinas con efecto glass */}
      <div className="flex-1 flex flex-col justify-center min-h-[60px]">
        {cabinas.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className={`text-xs ${textMuted}`}>Sin cabinas</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {cabinas.slice(0, 2).map((cabina, idx) => (
              <div key={idx} className={`flex items-center gap-2 text-xs ${textSecondary} ${isDark ? 'bg-slate-700/20' : 'bg-white/30'} rounded-xl px-2.5 py-1.5 border ${isDark ? 'border-slate-700/30' : 'border-gray-200/30'} backdrop-blur-sm`}>
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

export default ElevadorCardModerno;
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

const ElevadorCard = ({ elevador, seleccionado, onClick }) => {
  const { datos } = elevador;
  const estado = datos?.estado || 'desconocido';
  const colorClase = estadoColores[estado] || estadoColores.desconocido;
  const cabinas = datos?.cabinas || [];

  return (
    <div
      onClick={onClick}
      className={`elevador-card p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        colorClase
      } ${
        seleccionado ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]' : ''
      } hover:scale-[1.02] hover:shadow-xl`}
      style={{
        width: '100%',
        height: '200px', // ✅ Altura fija para todas las cards
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
            <h3 className="text-white font-bold text-sm truncate">
              {elevador.nombre_corto || elevador.codigo}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">{elevador.codigo}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <IconEstado estado={estado} />
          <IconDireccion sentido={datos?.sentido || 'frenado'} size={16} />
        </div>
      </div>

      {/* Estado y pisos */}
      <div className="flex items-center gap-2 text-xs flex-shrink-0">
        <span className={`px-2 py-0.5 rounded-full ${
          estado === 'normal' ? 'bg-green-500/20 text-green-400' :
          estado === 'falla' ? 'bg-red-500/20 text-red-400' :
          estado === 'mantenimiento' ? 'bg-yellow-500/20 text-yellow-400' :
          estado === 'sismo' ? 'bg-orange-500/20 text-orange-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {estado}
        </span>
        <span className="text-slate-400">
          📍 {datos?.piso_actual ?? '--'}
        </span>
        <span className="text-slate-400">
          🎯 {datos?.piso_destino ?? '--'}
        </span>
      </div>

      {/* Cabinas - Ocupa el espacio restante */}
      <div className="flex-1 flex flex-col justify-center min-h-[60px]">
        {cabinas.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-slate-500">Sin cabinas</span>
          </div>
        ) : (
          <div className="space-y-1">
            {cabinas.slice(0, 2).map((cabina, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/30 rounded-lg px-2 py-1">
                <IconCabinaSmall 
                  estado={cabina.estado || 'normal'}
                  numero={idx + 1}
                />
                <span className="flex-1 truncate">{cabina.nombre || `Cabina ${idx+1}`}</span>
                <span className={`px-1.5 py-0.5 rounded flex-shrink-0 ${
                  cabina.estado === 'normal' ? 'bg-green-500/20 text-green-400' :
                  cabina.estado === 'alerta' ? 'bg-yellow-500/20 text-yellow-400' :
                  cabina.estado === 'falla_critica' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {cabina.piso_actual ?? '--'}
                </span>
              </div>
            ))}
            {cabinas.length > 2 && (
              <span className="text-[10px] text-slate-500">
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
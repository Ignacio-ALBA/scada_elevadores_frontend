// frontend/src/components/pages/InterfazGrafica/vistas/VistaMejorada/ElevadorCardMejorado.jsx
import React from 'react';
import { APP_CONFIG } from '../../../../../config/index.js';

const API_BASE_URL = APP_CONFIG.apiBaseUrl;

const ElevadorCardMejorado = ({ 
  elevador, 
  seleccionado, 
  onClick, 
  isDark = false, 
  onViewPopup = null,
  iconos = {},
  vistaActual = null
}) => {
  const { datos } = elevador;
  const estado = datos?.estado || 'desconocido';
  const cabinas = datos?.cabinas || [];

  // ✅ Tamaño de iconos desde la vista o por defecto
  const tamanoIcono = vistaActual?.tamano_icono_carrusel || 64;

  const getIconoElevador = () => {
    const icono = iconos['elevador'];
    if (icono?.url) {
      return icono.url.startsWith('http') ? icono.url : `${API_BASE_URL}${icono.url}`;
    }
    return null;
  };

  const getIconoCabina = (cabina) => {
    const apertura = cabina.apertura_puertas || 0;
    let tipoIcono = 'cabina_cerrada';
    
    if (apertura >= 80) tipoIcono = 'cabina_abierta';
    else if (apertura >= 40) tipoIcono = 'cabina_semiabierta';
    
    const icono = iconos[tipoIcono];
    if (icono?.url) {
      return icono.url.startsWith('http') ? icono.url : `${API_BASE_URL}${icono.url}`;
    }
    return null;
  };

  const estadoColores = {
    normal: { border: 'border-green-500/50', bg: 'bg-green-500/10' },
    falla: { border: 'border-red-500/50', bg: 'bg-red-500/10' },
    mantenimiento: { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10' },
    sismo: { border: 'border-orange-500/50', bg: 'bg-orange-500/10' },
    desconocido: { border: 'border-gray-500/50', bg: 'bg-gray-500/10' }
  };

  const colorClase = estadoColores[estado] || estadoColores.desconocido;

  const glassBg = isDark ? 'bg-slate-800/40 backdrop-blur-sm' : 'bg-white/40 backdrop-blur-sm';
  const glassBorder = isDark ? 'border-slate-700/50' : 'border-gray-200/50';
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

  // ✅ Colores por sentido
  const sentidoIcono = {
    subiendo: '⬆️',
    bajando: '⬇️',
    frenado: '⏹️'
  };

  const sentidoColor = {
    subiendo: isDark ? 'text-cyan-400' : 'text-cyan-600',
    bajando: isDark ? 'text-orange-400' : 'text-orange-600',
    frenado: isDark ? 'text-slate-400' : 'text-gray-500'
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${glassBg} ${glassBorder}
        p-2 rounded-2xl border cursor-pointer 
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:translate-y-[-2px]
        ${colorClase.border} ${colorClase.bg}
        ${seleccionado ? `ring-2 ${isDark ? 'ring-cyan-400' : 'ring-primary-500'} scale-[1.02]` : ''}
      `}
      style={{ height: '200px', display: 'flex', flexDirection: 'column' }}
    >
      {/* HEADER: Nombre + Estado */}
      <div className="flex justify-between items-start flex-shrink-0 mb-1.5">
        <div className="min-w-0 flex-1">
          <h3 className={`font-bold text-xs truncate ${textPrimary}`}>
            {elevador.nombre_corto || elevador.codigo}
          </h3>
          <span className={`text-[9px] font-mono ${textSecondary}`}>{elevador.codigo}</span>
        </div>
        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0 ${estadoBg[estado] || estadoBg.desconocido}`}>
          {estado}
        </span>
      </div>

      {/* CUERPO: Elevador + Cabinas apiladas */}
      <div 
        className="flex-1 relative rounded-xl overflow-hidden flex items-center gap-2 p-1.5"
        style={{ 
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(255, 255, 255, 0.2)',
          border: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'}`
        }}
      >
        {/* Icono de elevador (fondo/izquierda) */}
        <div 
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: `${tamanoIcono * 0.6}px`, height: `${tamanoIcono * 0.6}px` }}
        >
          {getIconoElevador() ? (
            <img 
              src={getIconoElevador()} 
              alt="Elevador"
              className="w-full h-full object-contain opacity-60"
            />
          ) : (
            <span className="text-3xl opacity-40">🏢</span>
          )}
        </div>

        {/* Cabinas apiladas (derecha) */}
        {cabinas.length > 0 ? (
          <div className="flex-1 flex flex-col gap-1 h-full justify-center min-w-0">
            {cabinas.map((cabina, idx) => {
              const apertura = cabina.apertura_puertas ?? 0;
              const iconoCabina = getIconoCabina(cabina);
              const alturaCabina = `calc((100% - ${(cabinas.length - 1) * 4}px) / ${cabinas.length})`;
              
              return (
                <div 
                  key={idx}
                  className="flex items-center gap-1.5 min-w-0"
                  style={{ height: alturaCabina, maxHeight: '45px' }}
                >
                  {/* Icono de cabina */}
                  <div 
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: '28px', height: '28px' }}
                  >
                    {iconoCabina ? (
                      <img 
                        src={iconoCabina} 
                        alt={`Cabina ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-lg">🚪</span>
                    )}
                  </div>

                  {/* Info cabina */}
                  <div className="flex-1 min-w-0 flex items-center gap-1 text-[9px]">
                    <span className={`font-mono font-bold ${textPrimary}`}>
                      C{idx + 1}
                    </span>
                    <span className={textSecondary}>📍</span>
                    <span className={`font-mono ${textPrimary}`}>{cabina.piso_actual ?? '--'}</span>
                    <span className={textSecondary}>→</span>
                    <span className={`font-mono ${textSecondary}`}>{cabina.piso_destino ?? '--'}</span>
                    <span className={`ml-auto ${sentidoColor[cabina.sentido] || sentidoColor.frenado}`}>
                      {sentidoIcono[cabina.sentido] || '⏹️'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className={`text-[10px] ${textMuted}`}>Sin cabinas</span>
          </div>
        )}
      </div>

      {/* FOOTER: Pisos + View */}
      <div className="flex items-center justify-between flex-shrink-0 mt-1.5">
        <div className={`flex items-center gap-1.5 text-[9px] ${textSecondary}`}>
          <span className="flex items-center gap-0.5">
            <span className={textMuted}>📍</span>
            <span className={`font-mono ${textPrimary}`}>{datos?.piso_actual ?? '--'}</span>
          </span>
          <span className="flex items-center gap-0.5">
            <span className={textMuted}>🎯</span>
            <span className={`font-mono ${textPrimary}`}>{datos?.piso_destino ?? '--'}</span>
          </span>
          <span className={`flex items-center gap-0.5 ${sentidoColor[datos?.sentido] || sentidoColor.frenado}`}>
            {sentidoIcono[datos?.sentido] || '⏹️'}
          </span>
        </div>
        {onViewPopup && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewPopup(elevador);
            }}
            className={`px-1.5 py-0.5 text-[9px] rounded transition-all ${
              isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-primary-500/20 text-primary-600 hover:bg-primary-500/30'
            }`}
          >
            👁️
          </button>
        )}
      </div>
    </div>
  );
};

export default ElevadorCardMejorado;
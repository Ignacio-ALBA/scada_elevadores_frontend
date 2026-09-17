// frontend/src/components/pages/InterfazGrafica/PopupElevador.jsx
import React, { useState, useEffect } from 'react';
import { eventosService } from '../../../services/eventosService';
import { alarmasService } from '../../../services/alarmasService';

const PopupElevador = ({ elevador, edificio, onClose, isDark = false }) => {
  const [alarmas, setAlarmas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [alarmasData, eventosData] = await Promise.all([
          alarmasService.getByElevador(elevador.id, 5),
          eventosService.getByElevador(elevador.id, { limit: 5 })
        ]);
        setAlarmas(alarmasData || []);
        setEventos(eventosData || []);
      } catch (error) {
        console.error('❌ [PopupElevador] Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [elevador.id]);

  const estadoColor = {
    normal: isDark ? 'text-green-400' : 'text-green-600',
    falla: isDark ? 'text-red-400' : 'text-red-600',
    mantenimiento: isDark ? 'text-yellow-400' : 'text-yellow-600',
    sismo: isDark ? 'text-orange-400' : 'text-orange-600',
    desconocido: isDark ? 'text-gray-400' : 'text-gray-500'
  };

  const estadoBg = {
    normal: isDark ? 'bg-green-500/20' : 'bg-green-100',
    falla: isDark ? 'bg-red-500/20' : 'bg-red-100',
    mantenimiento: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
    sismo: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
    desconocido: isDark ? 'bg-gray-500/20' : 'bg-gray-100'
  };

  const prioridadColor = {
    critica: isDark ? 'text-red-400' : 'text-red-600',
    alta: isDark ? 'text-orange-400' : 'text-orange-600',
    media: isDark ? 'text-yellow-400' : 'text-yellow-600',
    baja: isDark ? 'text-blue-400' : 'text-blue-600'
  };

  const prioridadBg = {
    critica: isDark ? 'bg-red-500/20' : 'bg-red-100',
    alta: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
    media: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
    baja: isDark ? 'bg-blue-500/20' : 'bg-blue-100'
  };

  const estadoIcono = {
    normal: '✅',
    falla: '❌',
    mantenimiento: '🔧',
    sismo: '🌊',
    desconocido: '❓'
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999]">
        <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-8 shadow-2xl`}>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto" style={{ borderColor: isDark ? '#22d3ee' : '#3b82f6' }}></div>
          <p className={`mt-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
      onClick={onClose}
    >
      <div 
        className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-[85vh] scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* HEADER */}
          <div className={`p-5 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'} sticky top-0 ${isDark ? 'bg-slate-800' : 'bg-white'} z-10`}>
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className={`text-xl font-bold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {elevador.nombre || elevador.codigo}
                  </h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${estadoBg[elevador.datos?.estado] || estadoBg.desconocido} ${estadoColor[elevador.datos?.estado] || estadoColor.desconocido}`}>
                    {estadoIcono[elevador.datos?.estado] || '❓'} {elevador.datos?.estado || 'desconocido'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>📋 {elevador.codigo}</span>
                  <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>•</span>
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>🏢 {edificio?.nombre || 'Sin edificio'}</span>
                  <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>•</span>
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>🚪 {elevador.datos?.cabinas?.length || 0} cabinas</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-5">
            {/* Resumen rápido */}
            <div className={`grid grid-cols-3 gap-3 ${isDark ? 'bg-slate-700/30' : 'bg-gray-50'} rounded-xl p-3`}>
              <div className="text-center">
                <div className={`text-lg font-bold ${isDark ? 'text-cyan-400' : 'text-primary-600'}`}>{elevador.datos?.piso_actual ?? '--'}</div>
                <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Piso Actual</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${isDark ? 'text-cyan-400' : 'text-primary-600'}`}>{elevador.datos?.piso_destino ?? '--'}</div>
                <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Piso Destino</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${isDark ? 'text-cyan-400' : 'text-primary-600'}`}>
                  {elevador.datos?.sentido === 'subiendo' ? '⬆️' : elevador.datos?.sentido === 'bajando' ? '⬇️' : '⏹️'}
                </div>
                <div className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Sentido</div>
              </div>
            </div>

            {/* Cabinas */}
            <div>
              <h4 className={`text-sm font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-600'} mb-3 flex items-center gap-2`}>
                <span>🚪</span> Cabinas <span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>({elevador.datos?.cabinas?.length || 0})</span>
              </h4>
              {elevador.datos?.cabinas?.length > 0 ? (
                <div className="space-y-2">
                  {elevador.datos.cabinas.map((cabina, idx) => (
                    <div key={`cabina-${idx}-${cabina.piso_actual || 0}-${cabina.estado || 'normal'}`} className={`flex items-center justify-between text-sm ${isDark ? 'bg-slate-700/40' : 'bg-gray-50'} rounded-xl px-4 py-2.5 border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{idx + 1}</span>
                        <span className={isDark ? 'text-slate-200' : 'text-gray-700'}>{cabina.nombre || `Cabina ${idx + 1}`}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={isDark ? 'text-slate-300' : 'text-gray-600'}>📍 {cabina.piso_actual ?? '--'}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cabina.estado === 'normal' ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') : (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700')}`}>{cabina.estado || 'normal'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'} text-center py-4`}>Sin cabinas registradas</p>
              )}
            </div>

            {/* Alarmas */}
            <div>
              <h4 className={`text-sm font-semibold ${isDark ? 'text-red-400' : 'text-red-600'} mb-3 flex items-center gap-2`}>
                <span>🔔</span> Últimas Alarmas <span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>({alarmas.length})</span>
              </h4>
              {alarmas.length > 0 ? (
                <div className="space-y-2">
                  {alarmas.map((alarma, idx) => (
                    <div key={`alarma-${alarma.id || idx}-${alarma.timestamp || idx}`} className={`flex items-center justify-between text-sm ${isDark ? 'bg-slate-700/40' : 'bg-gray-50'} rounded-xl px-4 py-2.5 border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                      <div className="flex-1 min-w-0">
                        <p className={`truncate ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>{alarma.mensaje}</p>
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{new Date(alarma.timestamp).toLocaleString('es-MX')}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${prioridadBg[alarma.prioridad] || 'bg-gray-100'} ${prioridadColor[alarma.prioridad] || 'text-gray-500'}`}>{alarma.prioridad || 'media'}</span>
                        <span className={`text-xs ${alarma.resuelta ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-yellow-400' : 'text-yellow-600')}`}>{alarma.resuelta ? '✅' : alarma.confirmada ? '👁️' : '⏳'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'} text-center py-4`}>Sin alarmas registradas</p>
              )}
            </div>

            {/* Eventos */}
            <div>
              <h4 className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-3 flex items-center gap-2`}>
                <span>📋</span> Últimos Eventos <span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>({eventos.length})</span>
              </h4>
              {eventos.length > 0 ? (
                <div className="space-y-2">
                  {eventos.map((evento, idx) => (
                    <div key={`evento-${evento.id || idx}-${evento.fecha_hora || evento.timestamp || idx}`} className={`flex items-center justify-between text-sm ${isDark ? 'bg-slate-700/40' : 'bg-gray-50'} rounded-xl px-4 py-2.5 border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                      <div className="flex-1 min-w-0">
                        <p className={`truncate ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>{evento.descripcion}</p>
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{evento.usuario || 'Sistema'} • {new Date(evento.fecha_hora || evento.timestamp).toLocaleString('es-MX')}</span>
                      </div>
                      {evento.valor && (
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${isDark ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600'}`}>{evento.valor}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'} text-center py-4`}>Sin eventos registrados</p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'} ${isDark ? 'bg-slate-800' : 'bg-white'} sticky bottom-0`}>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'bg-primary-500/10 text-primary-600 hover:bg-primary-500/20'} border ${isDark ? 'border-cyan-500/20' : 'border-primary-500/20'}`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupElevador;
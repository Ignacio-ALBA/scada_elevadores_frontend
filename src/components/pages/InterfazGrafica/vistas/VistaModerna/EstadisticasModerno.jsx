// frontend/src/components/pages/InterfazGrafica/vistas/VistaModerna/EstadisticasModerno.jsx
import React from 'react';

const EstadisticasModerno = ({
  elevadores,
  pisoMinimo,
  pisoMaximo,
  isDark = false,
}) => {
  // ============================================
  // CÁLCULO DE ESTADÍSTICAS
  // ============================================
  const totalElevadores = elevadores.length;
  const totalCabinas = elevadores.reduce((acc, e) => acc + (e.datos?.cabinas?.length || 0), 0);

  const estados = { normal: 0, falla: 0, mantenimiento: 0, sismo: 0, desconocido: 0 };

  elevadores.forEach(e => {
    const datos = e.datos;
    if (datos) {
      estados[datos.estado] = (estados[datos.estado] || 0) + 1;
    }
  });

  // ============================================
  // GLASSMORPHISM CLASES
  // ============================================
  const bgColor = isDark ? 'bg-slate-800/40 backdrop-blur-sm' : 'bg-white/40 backdrop-blur-sm';
  const borderColor = isDark ? 'border-slate-700/50' : 'border-gray-200/50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-300' : 'text-gray-500';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-400';
  const textHeader = isDark ? 'text-cyan-400' : 'text-primary-600';
  const textGreen = isDark ? 'text-green-400' : 'text-green-600';
  const textRed = isDark ? 'text-red-400' : 'text-red-600';
  const textYellow = isDark ? 'text-yellow-400' : 'text-yellow-600';
  const textOrange = isDark ? 'text-orange-400' : 'text-orange-600';
  const barBg = isDark ? 'bg-slate-700/50' : 'bg-gray-200/50';
  const cardBg = isDark ? 'bg-slate-700/20' : 'bg-white/30';

  return (
    <div 
      className={`w-full ${bgColor} ${borderColor} backdrop-blur-sm border-b px-4 py-2`}
      style={{ minHeight: '56px' }}
    >
      <div className="flex items-center gap-4 h-full">
        {/* ✅ Título - MISMO ESTILO QUE "Elevadores (20)" del Carrusel */}
        <span className={`text-xs font-medium ${textHeader}`}>
          📊 Estadísticas
        </span>

        {/* Contenido - siempre visible */}
        <div className="flex items-center gap-3 flex-1">
          {/* Columna 1: Conteos */}
          <div className={`${cardBg} rounded-lg px-3 py-1 border ${borderColor} flex items-center gap-3`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${textPrimary}`}>{totalElevadores}</span>
              <span className={`text-[9px] ${textMuted}`}>Elev.</span>
            </div>
            <div className={`w-px h-5 ${borderColor}`} />
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${textPrimary}`}>{totalCabinas}</span>
              <span className={`text-[9px] ${textMuted}`}>Cab.</span>
            </div>
            <div className={`w-px h-5 ${borderColor}`} />
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${textPrimary}`}>{pisoMinimo}→{pisoMaximo}</span>
              <span className={`text-[9px] ${textMuted}`}>Pisos</span>
            </div>
          </div>

          {/* Columna 2: Estados */}
          <div className={`${cardBg} rounded-lg px-3 py-1 border ${borderColor} flex items-center gap-2`}>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-500'}`} />
              <span className={`text-[10px] ${textGreen}`}>{estados.normal || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-yellow-400' : 'bg-yellow-500'}`} />
              <span className={`text-[10px] ${textYellow}`}>{estados.mantenimiento || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-red-400' : 'bg-red-500'}`} />
              <span className={`text-[10px] ${textRed}`}>{estados.falla || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-orange-400' : 'bg-orange-500'}`} />
              <span className={`text-[10px] ${textOrange}`}>{estados.sismo || 0}</span>
            </div>
            <span className={`text-[9px] ${textMuted}`}>
              ({Math.round((estados.normal / totalElevadores) * 100 || 0)}%)
            </span>
          </div>

          {/* Columna 3: Barra */}
          <div className={`flex-1 min-w-[80px] ${cardBg} rounded-lg px-3 py-1 border ${borderColor}`}>
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-1.5 ${barBg} rounded-full overflow-hidden flex`}>
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(estados.normal / totalElevadores) * 100 || 0}%` }} />
                <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${((estados.mantenimiento || 0) / totalElevadores) * 100 || 0}%` }} />
                <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${((estados.falla || 0) / totalElevadores) * 100 || 0}%` }} />
                <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${((estados.sismo || 0) / totalElevadores) * 100 || 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasModerno;
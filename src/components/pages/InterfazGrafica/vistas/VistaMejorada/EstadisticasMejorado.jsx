// frontend/src/components/pages/InterfazGrafica/vistas/VistaMejorada/EstadisticasMejorado.jsx
import React from 'react';

const EstadisticasMejorado = ({
  elevadores,
  pisoMinimo,
  pisoMaximo,
  isDark = false,
}) => {
  const totalElevadores = elevadores.length;
  const totalCabinas = elevadores.reduce((acc, e) => acc + (e.datos?.cabinas?.length || 0), 0);

  const estados = { normal: 0, falla: 0, mantenimiento: 0, sismo: 0, desconocido: 0 };
  elevadores.forEach(e => {
    const datos = e.datos;
    if (datos) {
      estados[datos.estado] = (estados[datos.estado] || 0) + 1;
    }
  });

  // Glassmorphism
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
    <div className={`h-full flex flex-col ${bgColor} ${borderColor} backdrop-blur-sm overflow-hidden`}>
      <div 
        className="flex-1 overflow-y-auto p-3 space-y-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .estadisticas-scroll::-webkit-scrollbar { display: none; }
        `}</style>
        
        <div className="space-y-3 estadisticas-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Resumen */}
          <div className={`${cardBg} rounded-xl p-3 space-y-2 border ${borderColor}`}>
            <h3 className={`text-xs font-bold ${textHeader} uppercase tracking-wider`}>📊 Resumen</h3>
            <div className="flex justify-between text-sm">
              <span className={textSecondary}>Elevadores:</span>
              <span className={`${textPrimary} font-mono font-bold`}>{totalElevadores}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textSecondary}>Cabinas:</span>
              <span className={`${textPrimary} font-mono font-bold`}>{totalCabinas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textSecondary}>Pisos:</span>
              <span className={`${textPrimary} font-mono font-bold`}>{pisoMinimo} → {pisoMaximo}</span>
            </div>
          </div>

          {/* Estados */}
          <div className={`${cardBg} rounded-xl p-3 space-y-1.5 border ${borderColor}`}>
            <h3 className={`text-xs font-bold ${textHeader} uppercase tracking-wider mb-2`}>Estados</h3>
            <div className="flex justify-between text-sm">
              <span className={textGreen}>✅ Normal</span>
              <span className={`${textPrimary} font-mono`}>{estados.normal || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textYellow}>⚠️ Mantenimiento</span>
              <span className={`${textPrimary} font-mono`}>{estados.mantenimiento || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textRed}>❌ Falla</span>
              <span className={`${textPrimary} font-mono`}>{estados.falla || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={textOrange}>🌊 Sismo</span>
              <span className={`${textPrimary} font-mono`}>{estados.sismo || 0}</span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className={`${cardBg} rounded-xl p-3 border ${borderColor}`}>
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-2 ${barBg} rounded-full overflow-hidden flex`}>
                <div className="h-full bg-green-500" style={{ width: `${(estados.normal / totalElevadores) * 100 || 0}%` }} />
                <div className="h-full bg-yellow-500" style={{ width: `${((estados.mantenimiento || 0) / totalElevadores) * 100 || 0}%` }} />
                <div className="h-full bg-red-500" style={{ width: `${((estados.falla || 0) / totalElevadores) * 100 || 0}%` }} />
                <div className="h-full bg-orange-500" style={{ width: `${((estados.sismo || 0) / totalElevadores) * 100 || 0}%` }} />
              </div>
              <span className={`text-xs ${textMuted} font-mono`}>
                {Math.round((estados.normal / totalElevadores) * 100 || 0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasMejorado;
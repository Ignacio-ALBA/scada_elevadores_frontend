// frontend/src/components/pages/InterfazGrafica/EstadisticasLateral.jsx
import React from 'react';

const EstadisticasLateral = ({
  elevadores,
  pisoMinimo,
  pisoMaximo,
  isDark = false
}) => {
  const totalElevadores = elevadores.length;
  const totalCabinas = elevadores.reduce((acc, e) => acc + (e.datos?.cabinas?.length || 0), 0);

  const estados = { normal: 0, falla: 0, mantenimiento: 0, sismo: 0, desconocido: 0 };
  const sentidos = { subiendo: 0, bajando: 0, frenado: 0 };
  const cabinasEstado = { normal: 0, alerta: 0, falla_critica: 0 };

  elevadores.forEach(e => {
    const datos = e.datos;
    if (datos) {
      estados[datos.estado] = (estados[datos.estado] || 0) + 1;
      sentidos[datos.sentido] = (sentidos[datos.sentido] || 0) + 1;
      (datos.cabinas || []).forEach(c => {
        cabinasEstado[c.estado] = (cabinasEstado[c.estado] || 0) + 1;
      });
    }
  });

  const cabinasProblema = (cabinasEstado.alerta || 0) + (cabinasEstado.falla_critica || 0);
  const cabinasOperativas = cabinasEstado.normal || 0;

  // ✅ Clases para modo claro
  const bgColor = isDark ? 'bg-slate-800/50' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-slate-500' : 'text-gray-400';
  const textHeader = isDark ? 'text-cyan-400' : 'text-primary-600';
  const textGreen = isDark ? 'text-green-400' : 'text-green-600';
  const textRed = isDark ? 'text-red-400' : 'text-red-600';
  const textYellow = isDark ? 'text-yellow-400' : 'text-yellow-600';
  const textOrange = isDark ? 'text-orange-400' : 'text-orange-600';
  const textCyan = isDark ? 'text-cyan-400' : 'text-primary-600';
  const barBg = isDark ? 'bg-slate-700' : 'bg-gray-200';
  const cardShadow = isDark ? 'shadow-lg shadow-black/50' : 'shadow-card';
  const cardBg = isDark ? 'bg-slate-800/30' : 'bg-white';

  return (
    <div className={`p-4 space-y-4 ${bgColor} ${cardShadow} h-full overflow-y-auto ${isDark ? '' : 'border-l border-gray-200'}`}>
      <h3 className={`text-sm font-bold ${textHeader} uppercase tracking-wider border-b ${borderColor} pb-2`}>
        📊 Estadísticas
      </h3>

      <div className={`${cardBg} rounded-lg p-3 space-y-2`}>
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

      <div className={`border-t ${borderColor} pt-3`}>
        <h4 className={`text-xs ${textMuted} uppercase tracking-wider mb-2`}>Estado de Elevadores</h4>
        <div className={`${cardBg} rounded-lg p-3 space-y-1.5`}>
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
      </div>

      <div className={`border-t ${borderColor} pt-3`}>
        <h4 className={`text-xs ${textMuted} uppercase tracking-wider mb-2`}>Sentido de Marcha</h4>
        <div className={`${cardBg} rounded-lg p-3 space-y-1.5`}>
          <div className="flex justify-between text-sm">
            <span className={textCyan}>⬆️ Subiendo</span>
            <span className={`${textPrimary} font-mono`}>{sentidos.subiendo || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className={textCyan}>⬇️ Bajando</span>
            <span className={`${textPrimary} font-mono`}>{sentidos.bajando || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className={textMuted}>⏹️ Frenado</span>
            <span className={`${textPrimary} font-mono`}>{sentidos.frenado || 0}</span>
          </div>
        </div>
      </div>

      <div className={`border-t ${borderColor} pt-3`}>
        <h4 className={`text-xs ${textMuted} uppercase tracking-wider mb-2`}>Alertas de Cabinas</h4>
        <div className={`${cardBg} rounded-lg p-3 space-y-1.5`}>
          <div className="flex justify-between text-sm">
            <span className={textRed}>⚠️ Con problemas:</span>
            <span className={`${textPrimary} font-mono font-bold`}>{cabinasProblema}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className={textGreen}>✅ Operativas:</span>
            <span className={`${textPrimary} font-mono font-bold`}>{cabinasOperativas}</span>
          </div>
        </div>
      </div>

      <div className={`border-t ${borderColor} pt-3`}>
        <h4 className={`text-xs ${textMuted} uppercase tracking-wider mb-2`}>Resumen</h4>
        <div className={`${cardBg} rounded-lg p-3`}>
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
          <p className={`text-xs ${textMuted} mt-1`}>
            {estados.normal === totalElevadores ? '✅ Todos operativos' :
             estados.falla > 0 ? '⚠️ Hay elevadores con falla' :
             estados.sismo > 0 ? '🌊 Alerta sísmica activa' :
             '🟡 Algunos elevadores en alerta'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasLateral;
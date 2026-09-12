// frontend/src/components/pages/InterfazGrafica/EstadisticasLateral.jsx
import React from 'react';

const EstadisticasLateral = ({
  elevadores,
  pisoMinimo,
  pisoMaximo
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

  return (
    <div className="p-4 space-y-4 bg-gradient-to-b from-slate-800/50 to-slate-900/50 h-full overflow-y-auto">
      <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-700 pb-2">
        📊 Estadísticas
      </h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Elevadores:</span>
          <span className="text-white font-mono font-bold">{totalElevadores}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Cabinas:</span>
          <span className="text-white font-mono font-bold">{totalCabinas}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Pisos:</span>
          <span className="text-white font-mono font-bold">{pisoMinimo} → {pisoMaximo}</span>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-3">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Estado de Elevadores</h4>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-green-400">✅ Normal</span>
            <span className="text-white font-mono">{estados.normal || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-yellow-400">⚠️ Mantenimiento</span>
            <span className="text-white font-mono">{estados.mantenimiento || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-red-400">❌ Falla</span>
            <span className="text-white font-mono">{estados.falla || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-orange-400">🌊 Sismo</span>
            <span className="text-white font-mono">{estados.sismo || 0}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-3">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Sentido de Marcha</h4>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-cyan-400">⬆️ Subiendo</span>
            <span className="text-white font-mono">{sentidos.subiendo || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-cyan-400">⬇️ Bajando</span>
            <span className="text-white font-mono">{sentidos.bajando || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">⏹️ Frenado</span>
            <span className="text-white font-mono">{sentidos.frenado || 0}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-3">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Alertas de Cabinas</h4>
        <div className="flex justify-between text-sm">
          <span className="text-red-400">⚠️ Con problemas:</span>
          <span className="text-white font-mono font-bold">{cabinasProblema}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-green-400">✅ Operativas:</span>
          <span className="text-white font-mono font-bold">{cabinasOperativas}</span>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-3">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Resumen</h4>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: `${(estados.normal / totalElevadores) * 100 || 0}%` }} />
            <div className="h-full bg-yellow-500" style={{ width: `${((estados.mantenimiento || 0) / totalElevadores) * 100 || 0}%` }} />
            <div className="h-full bg-red-500" style={{ width: `${((estados.falla || 0) / totalElevadores) * 100 || 0}%` }} />
            <div className="h-full bg-orange-500" style={{ width: `${((estados.sismo || 0) / totalElevadores) * 100 || 0}%` }} />
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {Math.round((estados.normal / totalElevadores) * 100 || 0)}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {estados.normal === totalElevadores ? '✅ Todos operativos' :
           estados.falla > 0 ? '⚠️ Hay elevadores con falla' :
           estados.sismo > 0 ? '🌊 Alerta sísmica activa' :
           '🟡 Algunos elevadores en alerta'}
        </p>
      </div>
    </div>
  );
};

export default EstadisticasLateral;
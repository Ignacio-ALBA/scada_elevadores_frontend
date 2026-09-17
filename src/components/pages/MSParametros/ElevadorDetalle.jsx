// frontend/src/components/pages/MSParametros/ElevadorDetalle.jsx
import React from 'react';

const ElevadorDetalle = ({
  codigo,
  variables,
  datosEmulador,
  isExpandido,
  onToggle,
  ESTADOS_ELEVADOR,
  ESTADOS_CABINA,
  SENTIDOS,
  getValorVariable,
  getRegistroInfo,
  isDark = false
}) => {
  // Separar variables del elevador y de cabinas
  const variablesElevador = variables.filter(v =>
    !v.nombre.includes('cabina') && !v.nombre.includes('Cabina')
  );

  const variablesCabina = variables.filter(v =>
    v.nombre.includes('cabina') || v.nombre.includes('Cabina')
  );

  // Agrupar cabinas
  const cabinas = {};
  variablesCabina.forEach(v => {
    const match = v.nombre.match(/cabina_(\d+)/i);
    if (match) {
      const numCabina = parseInt(match[1]);
      if (!cabinas[numCabina]) cabinas[numCabina] = [];
      cabinas[numCabina].push(v);
    }
  });

  // Determinar estado del elevador
  let estadoElevador = 'Desconocido';
  let estadoColor = isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';

  const estadoVar = variablesElevador.find(v =>
    v.nombre.toLowerCase().includes('estado')
  );

  if (estadoVar) {
    const valor = getValorVariable(estadoVar.direccion_modbus);
    const estadoInfo = ESTADOS_ELEVADOR[valor];
    if (estadoInfo) {
      estadoElevador = estadoInfo.label;
      estadoColor = estadoInfo.color;
    }
  }

  // Determinar sentido
  let sentidoLabel = 'Frenado';
  let sentidoIcon = '⏹️';

  const sentidoVar = variablesElevador.find(v =>
    v.nombre.toLowerCase().includes('sentido')
  );

  if (sentidoVar) {
    const valor = getValorVariable(sentidoVar.direccion_modbus);
    const sentidoInfo = SENTIDOS[valor];
    if (sentidoInfo) {
      sentidoLabel = sentidoInfo.label;
      sentidoIcon = sentidoInfo.icon;
    }
  }

  // Determinar piso actual
  let pisoActual = '--';
  const pisoVar = variablesElevador.find(v =>
    v.nombre.toLowerCase().includes('piso_actual')
  );
  if (pisoVar) {
    const valor = getValorVariable(pisoVar.direccion_modbus);
    if (valor !== '--') pisoActual = valor;
  }

  // Determinar piso destino
  let pisoDestino = '--';
  const destinoVar = variablesElevador.find(v =>
    v.nombre.toLowerCase().includes('destino') && !v.nombre.includes('cabina')
  );
  if (destinoVar) {
    const valor = getValorVariable(destinoVar.direccion_modbus);
    if (valor !== '--') pisoDestino = valor;
  }

  // Clases condicionales
  const bgClase = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textClase = isDark ? 'text-gray-200' : 'text-gray-800';
  const textSecundario = isDark ? 'text-gray-400' : 'text-gray-500';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const borderClase = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800';
  const cardBg = isDark ? 'bg-gray-700/50' : 'bg-gray-50';
  const subCardBg = isDark ? 'bg-gray-800/50' : 'bg-white';

  return (
    <div className={`rounded-xl shadow-card overflow-hidden border ${bgClase}`}>
      {/* Cabecera del elevador */}
      <div
        className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${hoverBg} ${
          isExpandido ? `border-b ${borderClase}` : ''
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`text-lg font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
            {codigo}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor}`}>
            {estadoElevador}
          </span>
          <span className={`text-sm ${textSecundario}`}>
            {sentidoIcon} {sentidoLabel}
          </span>
          <span className={`text-sm ${textSecundario}`}>
            📍 Piso: {pisoActual}
          </span>
          {pisoDestino !== '--' && (
            <span className={`text-sm ${textSecundario}`}>
              🎯 Destino: {pisoDestino}
            </span>
          )}
          <span className={`text-xs ${textMuted}`}>
            {variables.length} variables
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${textMuted}`}>
            Cabinas: {Object.keys(cabinas).length}
          </span>
          <span className={textSecundario}>
            {isExpandido ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {/* Contenido expandido */}
      {isExpandido && (
        <div className={`p-4 space-y-4 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
          {/* Variables del elevador */}
          {variablesElevador.length > 0 && (
            <div>
              <h4 className={`text-sm font-semibold mb-2 ${textClase}`}>
                📋 Parámetros del Elevador
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {variablesElevador.map((v) => {
                  const valor = getValorVariable(v.direccion_modbus);
                  const registro = getRegistroInfo(v.direccion_modbus);
                  return (
                    <div key={v.id_variable} className={`${cardBg} rounded-lg p-2 border ${borderClase}`}>
                      <div className={`text-xs ${textMuted} truncate`} title={v.nombre}>
                        {v.nombre}
                      </div>
                      <div className={`text-sm font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {valor !== '--' ? valor : '--'}
                      </div>
                      <div className={`text-[10px] ${textMuted}`}>
                        Dir: {v.direccion_modbus}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cabinas */}
          {Object.keys(cabinas).length > 0 && (
            <div>
              <h4 className={`text-sm font-semibold mb-2 ${textClase}`}>
                🚪 Cabinas
              </h4>
              <div className="space-y-3">
                {Object.keys(cabinas).sort((a, b) => parseInt(a) - parseInt(b)).map((numCabina) => {
                  const varsCabina = cabinas[numCabina];

                  // Determinar estado de la cabina
                  let estadoCabina = 'Normal';
                  let estadoCabinaColor = isDark 
                    ? 'bg-green-900/50 text-green-400' 
                    : 'bg-green-100 text-green-800';

                  const estatusVar = varsCabina.find(v =>
                    v.nombre.toLowerCase().includes('estatus')
                  );
                  if (estatusVar) {
                    const valor = getValorVariable(estatusVar.direccion_modbus);
                    const estadoInfo = ESTADOS_CABINA[valor];
                    if (estadoInfo) {
                      estadoCabina = estadoInfo.label;
                      estadoCabinaColor = estadoInfo.color;
                    }
                  }

                  // Determinar piso de cabina
                  let pisoCabina = '--';
                  const pisoCabinaVar = varsCabina.find(v =>
                    v.nombre.toLowerCase().includes('piso') && !v.nombre.includes('destino')
                  );
                  if (pisoCabinaVar) {
                    const valor = getValorVariable(pisoCabinaVar.direccion_modbus);
                    if (valor !== '--') pisoCabina = valor;
                  }

                  // Determinar sentido de cabina
                  let sentidoCabina = 'Frenado';
                  let sentidoCabinaIcon = '⏹️';
                  const sentidoCabinaVar = varsCabina.find(v =>
                    v.nombre.toLowerCase().includes('sentido')
                  );
                  if (sentidoCabinaVar) {
                    const valor = getValorVariable(sentidoCabinaVar.direccion_modbus);
                    const sentidoInfo = SENTIDOS[valor];
                    if (sentidoInfo) {
                      sentidoCabina = sentidoInfo.label;
                      sentidoCabinaIcon = sentidoInfo.icon;
                    }
                  }

                  return (
                    <div key={numCabina} className={`${cardBg} rounded-lg p-3 border ${borderClase}`}>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className={`font-medium ${textClase}`}>
                          Cabina {numCabina}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoCabinaColor}`}>
                          {estadoCabina}
                        </span>
                        <span className={`text-sm ${textSecundario}`}>
                          📍 Piso: {pisoCabina}
                        </span>
                        <span className={`text-sm ${textSecundario}`}>
                          {sentidoCabinaIcon} {sentidoCabina}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                        {varsCabina.map((v) => {
                          const valor = getValorVariable(v.direccion_modbus);
                          return (
                            <div key={v.id_variable} className={`${subCardBg} rounded p-1.5 border ${borderClase}`}>
                              <div className={`text-[10px] ${textMuted} truncate`} title={v.nombre}>
                                {v.nombre}
                              </div>
                              <div className={`text-xs font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                {valor !== '--' ? valor : '--'}
                              </div>
                              <div className={`text-[10px] ${textMuted}`}>
                                {v.direccion_modbus}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ElevadorDetalle;
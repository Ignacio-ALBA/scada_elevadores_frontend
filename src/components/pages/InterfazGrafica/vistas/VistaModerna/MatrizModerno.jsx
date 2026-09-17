// frontend/src/components/pages/InterfazGrafica/vistas/VistaModerna/MatrizModerno.jsx
import React, { useRef, useEffect, useState } from 'react';
import { IconPiso } from './icons.jsx';

import puertaVerde from './assets/puerta-elevador-verde.png';
import puertaRoja from './assets/puerta-elevador-rojo.png';
import puertaNaranja from './assets/puerta-elevador-naranja.png';
import puertaAzul from './assets/puerta-elevador-azul.png';
import puertaDefault from './assets/puerta-elevador.png';

const getPuertaImage = (estado) => {
  switch (estado) {
    case 'normal': return puertaVerde;
    case 'falla': return puertaRoja;
    case 'mantenimiento': return puertaNaranja;
    case 'sismo': return puertaAzul;
    default: return puertaDefault;
  }
};

const MatrizModerno = ({
  elevadores,
  pisoMinimo = 0,
  pisoMaximo = 20,
  modoVista,
  elevadorSeleccionado,
  isDark = false,
  colorNormal = '#22c55e',
  colorMantenimiento = '#eab308',
  colorFalla = '#ef4444',
  colorSismo = '#f97316',
  colorSubiendo = '#38bdf8',
  colorBajando = '#fb923c',
  colorCabinaCerrada = '#38bdf8',
  colorCabinaAbierta = '#4ade80',
  colorCabinaMantenimiento = '#facc15',
  colorCabinaMitad = '#f472b6',
  tamanoIcono = 32,
  onMatrizHeightChange,
  matrizHeight = 400,
}) => {
  const containerRef = useRef(null);
  const [dimensiones, setDimensiones] = useState({ width: 0, height: 0 });
  
  // Altura fija - usar el valor de matrizHeight o el calculado
  const alturaFija = matrizHeight || 400;

  // Pisos fijos basados en BD
  const pisosFijos = Array.from({ length: pisoMaximo - pisoMinimo + 1 }, (_, i) => pisoMaximo - i);
  
  // Filas adicionales (fuera de rango)
  const pisoSuperior = pisoMaximo + 1;
  const pisoInferior = pisoMinimo - 1;
  const pisos = [pisoSuperior, ...pisosFijos, pisoInferior];

  const elevadoresMostrar = elevadorSeleccionado
    ? elevadores.filter(e => e.id === elevadorSeleccionado)
    : elevadores;

  const pisoPuertasFijas = pisoMaximo;

  const bgColor = isDark ? 'bg-slate-900/80' : 'bg-gray-100/80';
  const bgGradient = isDark 
    ? 'bg-gradient-to-b from-slate-900/50 to-slate-800/50' 
    : 'bg-gradient-to-b from-gray-100/50 to-gray-200/50';
  const textColor = isDark ? 'text-slate-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-slate-700/30' : 'border-gray-300/30';
  const leyendaBg = isDark ? 'bg-slate-800/80 backdrop-blur-sm border-slate-700/50' : 'bg-white/80 backdrop-blur-sm border-gray-300/50';
  const glassBg = isDark ? 'bg-slate-800/60 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const glassBorder = isDark ? 'border-slate-700/50' : 'border-gray-200/50';

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setDimensiones(prev => ({ 
          width: width, 
          height: alturaFija
        }));
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [alturaFija]);

  // Usar dimensiones.width real y altura fija
  const anchoDisponible = Math.max(dimensiones.width - 120, 100);
  const altoDisponible = Math.max(alturaFija - 50, 100);

  const numElevadores = Math.max(elevadoresMostrar.length, 1);
  const numPisos = pisos.length;

  const anchoCelda = Math.min(anchoDisponible / numElevadores, 65);
  const altoCelda = Math.min(altoDisponible / numPisos, 40);

  const offsetX = 60 + (anchoDisponible - anchoCelda * numElevadores) / 2;
  const offsetY = 30 + (altoDisponible - altoCelda * numPisos) / 2;

  const iconSize = Math.min(anchoCelda * 0.6, tamanoIcono);
  const mitadIcono = iconSize / 2;

  const estadoColores = {
    normal: colorNormal || '#22c55e',
    mantenimiento: colorMantenimiento || '#eab308',
    falla: colorFalla || '#ef4444',
    sismo: colorSismo || '#f97316'
  };

  const direccionColores = {
    subiendo: colorSubiendo || '#38bdf8',
    bajando: colorBajando || '#fb923c'
  };

  const cabinaColores = {
    cerrada: colorCabinaCerrada || '#38bdf8',
    abierta: colorCabinaAbierta || '#4ade80',
    mantenimiento: colorCabinaMantenimiento || '#facc15',
    mitad: colorCabinaMitad || '#f472b6'
  };

  const pisoEnRango = (piso) => piso >= pisoMinimo && piso <= pisoMaximo;

  const getPisoColor = (piso, activo = false) => {
    if (!pisoEnRango(piso)) {
      return isDark ? '#ef4444' : '#dc2626';
    }
    if (activo) {
      return isDark ? '#22d3ee' : '#3b82f6';
    }
    return isDark ? '#334155' : '#94a3b8';
  };

  const pisoLineaActive = isDark 
    ? 'linear-gradient(90deg, rgba(34,211,238,0.4) 0%, rgba(34,211,238,0.1) 100%)'
    : 'linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%)';
  const pisoLineaInactive = isDark
    ? 'linear-gradient(90deg, rgba(51,65,85,0.3) 0%, rgba(51,65,85,0.1) 100%)'
    : 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.03) 100%)';
  const pisoLineaFueraDeRango = isDark
  ? 'linear-gradient(90deg, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0.1) 100%)'
  : 'linear-gradient(90deg, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0.1) 100%)';

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${bgColor} relative flex flex-col`}
      style={{ 
        minHeight: `${alturaFija}px`,
        maxHeight: '100%',
        overflow: 'hidden'
      }}
    >
      {/* BOTONES DE ALTURA - ESQUINA SUPERIOR DERECHA */}
      {onMatrizHeightChange && (
        <div className="absolute -top-1.7 right-16 z-20 flex items-center gap-1">
            <div className={`flex items-center gap-0.5 rounded-lg ${glassBg} border ${glassBorder} backdrop-blur-sm p-0.5 shadow-lg`}>
            <button
                onClick={() => onMatrizHeightChange('increase')}
                className={`p-0.5 rounded-md transition-all duration-200 ${isDark ? 'text-cyan-400 hover:bg-slate-700/50' : 'text-primary-600 hover:bg-gray-200/50'}`}
                title="Aumentar altura (+50px)"
            >
                ⬆️
            </button>
            <button
                onClick={() => onMatrizHeightChange('decrease')}
                className={`p-0.5 rounded-md transition-all duration-200 ${isDark ? 'text-cyan-400 hover:bg-slate-700/50' : 'text-primary-600 hover:bg-gray-200/50'}`}
                title="Disminuir altura (-50px)"
            >
                ⬇️
            </button>
            <button
                onClick={() => onMatrizHeightChange('fit')}
                className={`p-0.5 rounded-md transition-all duration-200 ${isDark ? 'text-cyan-400 hover:bg-slate-700/50' : 'text-primary-600 hover:bg-gray-200/50'}`}
                title="Ajustar a ventana"
            >
                🔲
            </button>
            <button
                onClick={() => onMatrizHeightChange('reset')}
                className={`p-0.5 rounded-md transition-all duration-200 ${isDark ? 'text-cyan-400 hover:bg-slate-700/50' : 'text-primary-600 hover:bg-gray-200/50'}`}
                title="Restaurar altura (400px)"
            >
                ↩️
            </button>
            </div>
        </div>
      )}

      {/* CONTENEDOR DE LA MATRIZ - CON SCROLL INTERNO */}
      <div 
        className="flex-1 overflow-auto"
        style={{ 
          minHeight: `${alturaFija - 50}px`,
          position: 'relative'
        }}
      >
        <div 
          className="relative"
          style={{
            width: Math.max(anchoDisponible + 120, 500),
            height: Math.max(altoDisponible + 50, 400),
            minHeight: `${alturaFija}px`
          }}
        >
          <div className={`absolute inset-0 ${bgGradient}`} />

          {/* Pisos */}
          {pisos.map((piso, i) => {
            const y = offsetY + i * altoCelda;
            const esFilaAdicional = !pisoEnRango(piso);
            
            const hayCabinasEnPiso = pisoEnRango(piso) && elevadoresMostrar.some(e =>
                e.datos?.cabinas?.some(c => c.piso_actual === piso)
            );
            const esPisoPuertasFijas = piso === pisoPuertasFijas;
            const activo = (hayCabinasEnPiso || esPisoPuertasFijas) && pisoEnRango(piso);

            //  Para filas adicionales, NO usar la lógica de activo
            //  Solo verificar si hay elevador fuera de rango
            const hayElevadorFueraDeRango = esFilaAdicional && elevadoresMostrar.some(e =>
                e.datos?.cabinas?.some(c => c.piso_actual === piso)
            );
            
            //  Determinar si la línea debe estar activa (para filas adicionales, solo si hay elevador)
            const esLineaActiva = esFilaAdicional 
                ? hayElevadorFueraDeRango 
                : activo;

            //  Color: Gris 50% por defecto, Naranja si hay elevador fuera de rango
            let pisoColor;
            if (esFilaAdicional) {
                pisoColor = hayElevadorFueraDeRango ? '#f97316' : (isDark ? '#64748b' : '#94a3b8');
            } else {
                pisoColor = getPisoColor(piso, activo);
            }
            
            const labelPiso = esFilaAdicional ? '-' : piso;

            // Verificar si hay elevadores subiendo o bajando en este piso
            const haySubiendo = elevadoresMostrar.some(e => 
                e.datos?.sentido === 'subiendo' && e.datos?.piso_actual === piso
            );
            const hayBajando = elevadoresMostrar.some(e => 
                e.datos?.sentido === 'bajando' && e.datos?.piso_actual === piso
            );

            return (
                <div key={`piso-${piso}`} className="absolute" style={{ top: y, left: 0, right: 0, height: altoCelda }}>
                {/* Columna de pisos (primera) - CON COLOR CORREGIDO */}
                <div className="absolute" style={{ left: 8, width: 36, top: '50%', transform: 'translateY(-50%)' }}>
                <IconPiso 
                    numero={labelPiso}
                    activo={esFilaAdicional ? false : esLineaActiva}  // ✅ FALSE para filas adicionales
                    color={pisoColor}
                    textColor={isDark ? '#ffffff' : '#1e293b'}
                    isDark={isDark}
                />
                {esFilaAdicional && hayElevadorFueraDeRango && (
                    <div className="absolute -top-1 -right-1 text-[8px] text-orange-500">⚠️</div>
                )}
                </div>

                {/* Columnas izquierdas (subiendo/bajando) */}
                <div className="absolute" style={{ right: 8, width: 36, top: '50%', transform: 'translateY(-50%)' }}>
                    <IconPiso 
                        numero={labelPiso}
                        activo={esFilaAdicional ? false : esLineaActiva}  // ✅ FALSE para filas adicionales
                        color={pisoColor}
                        textColor={isDark ? '#ffffff' : '#1e293b'}
                        isDark={isDark}
                />
                {esFilaAdicional && hayElevadorFueraDeRango && (
                    <div className="absolute -top-1 -right-1 text-[8px] text-orange-500">⚠️</div>
                )}
                </div>

                {/* Línea del piso - Color según estado SIN AZUL PARA FILAS ADICIONALES */}
                <div 
                    className="absolute h-px"
                    style={{
                    left: 68,
                    right: 100,
                    top: '50%',
                    background: esLineaActiva ? 
                        (esFilaAdicional ? pisoLineaFueraDeRango : pisoLineaActive) : 
                        pisoLineaInactive,
                    opacity: esLineaActiva ? 1 : 0.3
                    }}
                />

                {/* Columnas derechas (subiendo/bajando) */}
                <div className="absolute flex items-center gap-1" style={{ right: 48, top: '50%', transform: 'translateY(-50%)' }}>
                    <div className="w-3 h-3 rounded-full transition-all duration-300" style={{ 
                    backgroundColor: direccionColores.subiendo,
                    opacity: haySubiendo ? 0.9 : 0.15,
                    boxShadow: haySubiendo ? `0 0 12px ${direccionColores.subiendo}80` : 'none'
                    }} />
                    <div className="w-3 h-3 rounded-full transition-all duration-300" style={{ 
                    backgroundColor: direccionColores.bajando,
                    opacity: hayBajando ? 0.9 : 0.15,
                    boxShadow: hayBajando ? `0 0 12px ${direccionColores.bajando}80` : 'none'
                    }} />
                </div>

                {/* Columna de pisos (antepenúltima - repetida) - CON COLOR CORREGIDO */}
                <div className="absolute" style={{ right: 8, width: 36, top: '50%', transform: 'translateY(-50%)' }}>
                    <IconPiso 
                    numero={labelPiso}
                    activo={esLineaActiva}
                    color={pisoColor}
                    textColor={isDark ? '#ffffff' : '#1e293b'}
                    isDark={isDark}
                    />
                    {esFilaAdicional && hayElevadorFueraDeRango && (
                    <div className="absolute -top-1 -right-1 text-[8px] text-orange-500">⚠️</div>
                    )}
                </div>
                </div>
            );
          })}

          {/* Cabinas viajeras */}
          {elevadoresMostrar.map((elevador, j) => {
            const x = offsetX + j * anchoCelda + anchoCelda / 2;
            const datos = elevador.datos;
            const cabinas = datos?.cabinas || [];

            return cabinas.map((cabina, idx) => {
              const pisoIndex = pisos.indexOf(cabina.piso_actual);
              if (pisoIndex === -1) return null;
              
              const y = offsetY + pisoIndex * altoCelda + altoCelda / 2 - mitadIcono;
              const estadoCabina = cabina.estado || 'normal';
              const puertaImg = getPuertaImage(estadoCabina);
              
              let colorCabina;
              switch (estadoCabina) {
                case 'normal': colorCabina = cabinaColores.cerrada; break;
                case 'abierta': colorCabina = cabinaColores.abierta; break;
                case 'mantenimiento': colorCabina = cabinaColores.mantenimiento; break;
                case 'mitad': colorCabina = cabinaColores.mitad; break;
                default: colorCabina = cabinaColores.cerrada;
              }

              if (!pisoEnRango(cabina.piso_actual)) {
                colorCabina = isDark ? '#ef4444' : '#dc2626';
              }

              return (
                <div 
                  key={`cabina-${elevador.id}-${idx}`}
                  className="absolute transition-all duration-300 z-10"
                  style={{ 
                    left: x - mitadIcono,
                    top: y,
                    width: iconSize,
                    height: iconSize
                  }}
                >
                  <img 
                    src={puertaImg} 
                    alt={`Cabina ${idx + 1}`}
                    className="w-full h-full object-contain"
                    style={{
                      filter: `drop-shadow(0 0 15px ${colorCabina}60)`
                    }}
                  />
                  
                  <div 
                    className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                    style={{ color: colorCabina }}
                  >
                    {idx + 1}
                  </div>

                  <div 
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: colorCabina }}
                  />
                </div>
              );
            });
          })}

          {/* Etiquetas de elevadores */}
          {elevadoresMostrar.map((elevador, j) => {
            const x = offsetX + j * anchoCelda + anchoCelda / 2;

            return (
              <div 
                key={`label-${elevador.id}`}
                className="absolute left-1/2 -translate-x-1/2 text-center"
                style={{ top: offsetY - 28 }}
              >
                <span className={`text-[10px] font-mono ${isDark ? 'text-cyan-400/80' : 'text-primary-600/80'} whitespace-nowrap px-2 py-0.5 rounded ${isDark ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-sm`}>
                  {elevador.nombre_corto || elevador.codigo}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEYENDA - FUERA DEL CONTENEDOR DE SCROLL, SIEMPRE VISIBLE ABAJO */}
      <div className={`flex-shrink-0 ${leyendaBg} backdrop-blur-sm border-t ${borderColor} px-4 py-2 text-xs flex flex-wrap gap-3 ${textColor}`}>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Normal</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Falla</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Mantenimiento</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Sismo</span>
        <span className={isDark ? 'text-slate-500' : 'text-gray-300'}>|</span>
        <span className={isDark ? 'text-cyan-400' : 'text-primary-600'}>⬆️ Subiendo</span>
        <span className={isDark ? 'text-cyan-400' : 'text-primary-600'}>⬇️ Bajando</span>
        <span className={isDark ? 'text-cyan-400' : 'text-primary-600'}>⏹️ Frenado</span>
        <span className={isDark ? 'text-red-400' : 'text-red-600'}>⚠️ Fuera de rango</span>
        <span className="ml-auto text-[10px] opacity-50">
          Pisos: {pisoMinimo} → {pisoMaximo}
        </span>
      </div>
    </div>
  );
};

export default MatrizModerno;
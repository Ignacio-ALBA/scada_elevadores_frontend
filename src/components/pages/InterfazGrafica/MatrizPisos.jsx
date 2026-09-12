// frontend/src/components/pages/InterfazGrafica/MatrizPisos.jsx
import React, { useRef, useEffect, useState } from 'react';
import { IconElevador, IconPiso, IconRiel } from './icons.jsx';

// ✅ Importar imágenes por estado
import puertaVerde from './assets/puerta-elevador-verde.png';
import puertaRoja from './assets/puerta-elevador-rojo.png';
import puertaNaranja from './assets/puerta-elevador-naranja.png';
import puertaAzul from './assets/puerta-elevador-azul.png';
import puertaDefault from './assets/puerta-elevador.png';

// ✅ Función para obtener la imagen según el estado
const getPuertaImage = (estado) => {
  switch (estado) {
    case 'normal':
      return puertaVerde;
    case 'falla':
      return puertaRoja;
    case 'mantenimiento':
      return puertaNaranja;
    case 'sismo':
      return puertaAzul;
    default:
      return puertaDefault;
  }
};

const MatrizPisos = ({
  elevadores,
  pisoMinimo,
  pisoMaximo,
  modoVista,
  elevadorSeleccionado
}) => {
  const containerRef = useRef(null);
  const [dimensiones, setDimensiones] = useState({ width: 0, height: 0 });

  const totalPisos = pisoMaximo - pisoMinimo + 1;
  const pisos = Array.from({ length: totalPisos }, (_, i) => pisoMaximo - i);
  const elevadoresMostrar = elevadorSeleccionado
    ? elevadores.filter(e => e.id === elevadorSeleccionado)
    : elevadores;

  const pisoPuertasFijas = pisoMaximo;

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensiones({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const margenIzquierdo = 50;
  const margenDerecho = 20;
  const margenSuperior = 40;
  const margenInferior = 20;

  const anchoDisponible = dimensiones.width - margenIzquierdo - margenDerecho;
  const altoDisponible = dimensiones.height - margenSuperior - margenInferior;

  const numElevadores = elevadoresMostrar.length;
  const numPisos = pisos.length;

  const anchoCelda = Math.min(anchoDisponible / Math.max(numElevadores, 1), 80);
  const altoCelda = Math.min(altoDisponible / Math.max(numPisos, 1), 45);

  const offsetX = margenIzquierdo + (anchoDisponible - anchoCelda * numElevadores) / 2;
  const offsetY = margenSuperior + (altoDisponible - altoCelda * numPisos) / 2;

  const iconSize = Math.min(anchoCelda * 0.6, 32);
  const mitadIcono = iconSize / 2;

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-900 relative overflow-auto">
      <div 
        className="relative"
        style={{
          width: Math.max(dimensiones.width, offsetX + anchoCelda * numElevadores + margenDerecho),
          height: Math.max(dimensiones.height, offsetY + altoCelda * numPisos + margenInferior)
        }}
      >
        {/* Fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />

        {/* ============================================ */}
        {/* PASO 1: FILAS DE PISOS */}
        {/* ============================================ */}
        {pisos.map((piso, i) => {
          const y = offsetY + i * altoCelda;
          const hayCabinasEnPiso = elevadoresMostrar.some(e =>
            e.datos?.cabinas?.some(c => c.piso_actual === piso)
          );
          const esPisoPuertasFijas = piso === pisoPuertasFijas;
          const activo = hayCabinasEnPiso || esPisoPuertasFijas;

          return (
            <div key={piso} className="absolute" style={{ top: y, left: 0, right: 0, height: altoCelda }}>
              <div className="absolute" style={{ left: 8, width: 36, top: '50%', transform: 'translateY(-50%)' }}>
                <IconPiso 
                  numero={piso} 
                  activo={activo}
                  color={activo ? '#22d3ee' : '#334155'}
                />
              </div>
              <div 
                className="absolute h-px"
                style={{
                  left: 46,
                  right: 0,
                  top: '50%',
                  background: activo
                    ? 'linear-gradient(90deg, rgba(34,211,238,0.4) 0%, rgba(34,211,238,0.1) 100%)'
                    : 'linear-gradient(90deg, rgba(51,65,85,0.3) 0%, rgba(51,65,85,0.1) 100%)'
                }}
              />
            </div>
          );
        })}

        {/* ============================================ */}
        {/* PASO 4: RIELES VERTICALES */}
        {/* ============================================ */}
        {elevadoresMostrar.map((elevador, j) => {
          const x = offsetX + j * anchoCelda + anchoCelda / 2;
          const estado = elevador.datos?.estado || 'desconocido';
          const activo = estado === 'normal';
          
          return (
            <div key={`riel-${elevador.id}`} className="absolute" style={{ left: x - 1, top: offsetY, width: 2, height: altoCelda * numPisos }}>
              <div 
                className="absolute w-px"
                style={{
                  left: -6,
                  top: 0,
                  height: '100%',
                  background: activo 
                    ? 'linear-gradient(180deg, rgba(34,211,238,0.3) 0%, rgba(34,211,238,0.1) 50%, rgba(34,211,238,0.3) 100%)'
                    : 'linear-gradient(180deg, rgba(51,65,85,0.2) 0%, rgba(51,65,85,0.1) 50%, rgba(51,65,85,0.2) 100%)'
                }}
              />
              <div 
                className="absolute w-px"
                style={{
                  left: 6,
                  top: 0,
                  height: '100%',
                  background: activo 
                    ? 'linear-gradient(180deg, rgba(34,211,238,0.3) 0%, rgba(34,211,238,0.1) 50%, rgba(34,211,238,0.3) 100%)'
                    : 'linear-gradient(180deg, rgba(51,65,85,0.2) 0%, rgba(51,65,85,0.1) 50%, rgba(51,65,85,0.2) 100%)'
                }}
              />
            </div>
          );
        })}

        {/* ============================================ */}
        {/* PUERTAS FIJAS EN EL ÚLTIMO PISO */}
        {/* ============================================ */}
        {elevadoresMostrar.map((elevador, j) => {
          const x = offsetX + j * anchoCelda + anchoCelda / 2;
          const cabinas = elevador.datos?.cabinas || [];
          const numPuertasFijas = Math.max(cabinas.length, 1);

          return Array.from({ length: numPuertasFijas }).map((_, idx) => {
            const pisoIndex = pisos.indexOf(pisoPuertasFijas);
            const y = offsetY + pisoIndex * altoCelda + altoCelda / 2 - mitadIcono;
            const offsetMulti = (numPuertasFijas > 1) 
              ? (idx - (numPuertasFijas - 1) / 2) * (iconSize * 0.6)
              : 0;

            const cabina = cabinas[idx] || null;
            const estadoPuerta = cabina ? cabina.estado : 'normal';
            const puertaImg = getPuertaImage(estadoPuerta);
            const colorPuerta = estadoPuerta === 'normal' ? '#22d3ee' :
                                estadoPuerta === 'alerta' ? '#eab308' : '#ef4444';

            return (
              <div 
                key={`fija-${elevador.id}-${idx}`}
                className="absolute transition-all duration-300 opacity-60"
                style={{ 
                  left: x - mitadIcono + offsetMulti,
                  top: y,
                  width: iconSize * 0.8,
                  height: iconSize * 0.8
                }}
              >
                <img 
                  src={puertaImg} 
                  alt={`Puerta ${idx + 1}`}
                  className="w-full h-full object-contain opacity-50"
                  style={{ filter: `drop-shadow(0 0 10px ${colorPuerta}20)` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-slate-500">
                  {idx + 1}
                </div>
              </div>
            );
          });
        })}

        {/* ============================================ */}
        {/* PASO 3: CABINAS VIAJERAS */}
        {/* ============================================ */}
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
            const colorCabina = estadoCabina === 'normal' ? '#22d3ee' :
                                estadoCabina === 'alerta' ? '#eab308' : '#ef4444';

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
                    filter: `drop-shadow(0 0 10px ${colorCabina}40)`
                  }}
                />
                
                <div 
                  className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                  style={{ color: colorCabina }}
                >
                  {idx + 1}
                </div>

                <div 
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colorCabina }}
                />
              </div>
            );
          });
        })}

        {/* Etiquetas de elevadores */}
        {elevadoresMostrar.map((elevador, j) => {
          const x = offsetX + j * anchoCelda + anchoCelda / 2;
          const estado = elevador.datos?.estado || 'desconocido';

          return (
            <div 
              key={`label-${elevador.id}`}
              className="absolute left-1/2 -translate-x-1/2 text-center"
              style={{ top: offsetY - 28 }}
            >
              <span className="text-[10px] font-mono text-cyan-400/80 whitespace-nowrap">
                {elevador.nombre_corto || elevador.codigo}
              </span>
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700 text-xs flex flex-wrap gap-3 text-slate-300">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Normal</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Falla</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Mantenimiento</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Sismo</span>
        <span className="text-slate-500">|</span>
        <span className="text-cyan-400">⬆️ Subiendo</span>
        <span className="text-cyan-400">⬇️ Bajando</span>
        <span className="text-cyan-400">⏹️ Frenado</span>
      </div>
    </div>
  );
};

export default MatrizPisos;
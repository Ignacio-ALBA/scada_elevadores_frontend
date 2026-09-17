// frontend/src/components/pages/InterfazGrafica/vistas/VistaMinimalista/MatrizMinimalista.jsx
import React, { useRef, useEffect, useState } from 'react';
import { IconPiso } from '../VistaMejorada/icons.jsx';

import { APP_CONFIG } from '../../../../../config/index.js';

const API_BASE_URL = APP_CONFIG.apiBaseUrl;

const MatrizMinimalista = ({
  elevadores,
  pisoMinimo = 0,
  pisoMaximo = 20,
  modoVista,
  elevadorSeleccionado,
  isDark = false,
  vistaActual = null,
  estados = [],
  iconos = {},
  matrizHeight = 400
}) => {
  const containerRef = useRef(null);
  const [dimensiones, setDimensiones] = useState({ width: 0, height: 0 });

  // ✅ Configuración desde la vista
  const grosorRiel = vistaActual?.grosor_riel ?? 4;
  const radioRiel = vistaActual?.radio_riel ?? 8;
  const espaciadoRiel = vistaActual?.espaciado_riel ?? 6;
  const mostrarEtiquetas = vistaActual?.mostrar_etiquetas ?? true;
  const tamanoIconoCabina = vistaActual?.tamano_icono_cabina ?? 40;
  const colorLlamadaPiso = vistaActual?.color_llamada_piso ?? '#a855f7';
  
  // ✅ NUEVO: Padding superior configurable desde BD
  const paddingSuperior = vistaActual?.padding_superior ?? 0;

  // ✅ Configuración del rectángulo del elevador
  const rectanguloOpacidad = vistaActual?.rectangulo_opacidad ?? 15;
  const rectanguloBordeTipo = vistaActual?.rectangulo_borde_tipo ?? 'solid';
  const rectanguloBordeGrosor = vistaActual?.rectangulo_borde_grosor ?? 2;
  const rectanguloBordeRadio = vistaActual?.rectangulo_borde_radio ?? 8;

  // ✅ Función para obtener el color de un estado por clave
  const getEstadoColor = (clave, defaultColor) => {
    const estado = estados.find(e => e.clave === clave);
    return estado?.color || defaultColor || '#94a3b8';
  };

  // ✅ Colores de estado
  const colores = {
    normal: getEstadoColor('normal', '#22c55e'),
    falla: getEstadoColor('falla', '#ef4444'),
    mantenimiento: getEstadoColor('mantenimiento', '#eab308'),
    sismo: getEstadoColor('sismico', '#f97316'),
    subiendo: getEstadoColor('subiendo', '#22d3ee'),
    bajando: getEstadoColor('bajando', '#f97316'),
    detenido: getEstadoColor('detenido', '#94a3b8'),
    evento_programado: getEstadoColor('evento_programado', '#8b5cf6'),
    fuera_servicio: getEstadoColor('fuera_servicio', '#64748b'),
    contra_incendio: getEstadoColor('contra_incendio', '#dc2626'),
    llamada_piso: getEstadoColor('llamada_piso', colorLlamadaPiso),
  };

  // ✅ Pisos fijos basados en BD
  const pisosFijos = Array.from({ length: pisoMaximo - pisoMinimo + 1 }, (_, i) => pisoMaximo - i);
  const pisoSuperior = pisoMaximo + 1;
  const pisoInferior = pisoMinimo - 1;
  const pisos = [pisoSuperior, ...pisosFijos, pisoInferior];

  const elevadoresMostrar = elevadorSeleccionado
    ? elevadores.filter(e => e.id === elevadorSeleccionado)
    : elevadores;

  const bgColor = isDark ? 'bg-slate-900/80' : 'bg-gray-100/80';
  const bgGradient = isDark 
    ? 'bg-gradient-to-b from-slate-900/50 to-slate-800/50' 
    : 'bg-gradient-to-b from-gray-100/50 to-gray-200/50';
  const textColor = isDark ? 'text-slate-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-slate-700/30' : 'border-gray-300/30';
  const leyendaBg = isDark ? 'bg-slate-800/80 backdrop-blur-sm border-slate-700/50' : 'bg-white/80 backdrop-blur-sm border-gray-300/50';

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensiones({ width, height });
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // ✅ Márgenes - el superior incluye el padding configurable + espacio para etiquetas
  const margenIzquierdo = 60;
  const margenDerecho = 60;
  const margenSuperior = paddingSuperior + (mostrarEtiquetas ? 40 : 20);
  const margenInferior = 10;

  // ✅ Ancho/alto disponible REAL
  const anchoDisponibleReal = Math.max((dimensiones.width || 800) - margenIzquierdo - margenDerecho, 100);
  const altoDisponibleReal = Math.max(matrizHeight - margenSuperior - margenInferior, 100);

  const numElevadores = Math.max(elevadoresMostrar.length, 1);
  const numPisos = pisos.length;

  const anchoCelda = Math.min(anchoDisponibleReal / numElevadores, 80);
  const altoCelda = Math.min(altoDisponibleReal / numPisos, 40);

  const offsetX = margenIzquierdo + (anchoDisponibleReal - anchoCelda * numElevadores) / 2;
  const offsetY = margenSuperior + (altoDisponibleReal - altoCelda * numPisos) / 2;

  const iconSize = Math.min(anchoCelda * 0.5, tamanoIconoCabina);
  const mitadIcono = iconSize / 2;

  const pisoEnRango = (piso) => piso >= pisoMinimo && piso <= pisoMaximo;

  // ✅ Función para obtener URL del icono de puerta según apertura
  const getIconoPuerta = (apertura) => {
    let tipoIcono = 'puerta_cerrada';
    if (apertura >= 80) tipoIcono = 'puerta_abierta';
    else if (apertura >= 40) tipoIcono = 'puerta_semiabierta';
    
    const icono = iconos[tipoIcono];
    if (icono?.url) {
      return icono.url.startsWith('http') ? icono.url : `${API_BASE_URL}${icono.url}`;
    }
    return null;
  };

  // ✅ Función para obtener el color del estado de un elevador
  const getEstadoElevadorColor = (elevador) => {
    const estado = elevador.datos?.estado || 'desconocido';
    return colores[estado] || colores.detenido;
  };

  // ✅ Función para oscurecer un color hex
  const oscurecerColor = (hex, factor = 0.7) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rNew = Math.round(r * factor);
    const gNew = Math.round(g * factor);
    const bNew = Math.round(b * factor);
    return `#${rNew.toString(16).padStart(2, '0')}${gNew.toString(16).padStart(2, '0')}${bNew.toString(16).padStart(2, '0')}`;
  };

  // ✅ Función para convertir hex + opacidad a rgba
  const hexToRgba = (hex, opacidad) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacidad / 100})`;
  };

  // ✅ Verificar si un piso tiene llamada activa
  const pisoTieneLlamada = (piso) => {
    return elevadoresMostrar.some(e =>
      e.datos?.cabinas?.some(c => 
        c.llamada === true && c.piso_llamada === piso
      )
    );
  };

  // ✅ Verificar si hay elevador fuera de rango en este piso
  const hayElevadorFueraDeRangoEnPiso = (piso) => {
    return elevadoresMostrar.some(e =>
      e.datos?.cabinas?.some(c => c.piso_actual === piso)
    );
  };

  const haySubiendoEnPiso = (piso) => {
    return elevadoresMostrar.some(e => 
      e.datos?.sentido === 'subiendo' && e.datos?.piso_actual === piso
    );
  };

  const hayBajandoEnPiso = (piso) => {
    return elevadoresMostrar.some(e => 
      e.datos?.sentido === 'bajando' && e.datos?.piso_actual === piso
    );
  };

  // ✅ Renderizar rieles verticales para un elevador
  const renderRieles = (x, elevador) => {
    const colorEstado = getEstadoElevadorColor(elevador);
    const anchoTotal = anchoCelda * 0.3;
    const anchoRiel = Math.max(grosorRiel, 2);
    
    const rieles = [];
    
    for (let i = 0; i < 2; i++) {
      rieles.push(
        <div
          key={`riel-izq-${i}`}
          className="absolute transition-all duration-300"
          style={{
            left: x - anchoTotal / 2 + i * (anchoRiel + espaciadoRiel) - anchoRiel / 2,
            top: offsetY - 10,
            height: altoCelda * numPisos + 20,
            width: `${anchoRiel}px`,
            backgroundColor: colorEstado,
            borderRadius: `${radioRiel}px`,
            opacity: 0.6,
            boxShadow: `0 0 ${grosorRiel * 2}px ${colorEstado}40`
          }}
        />
      );
    }
    
    for (let i = 0; i < 2; i++) {
      rieles.push(
        <div
          key={`riel-der-${i}`}
          className="absolute transition-all duration-300"
          style={{
            left: x + anchoTotal / 2 - i * (anchoRiel + espaciadoRiel) - anchoRiel / 2,
            top: offsetY - 10,
            height: altoCelda * numPisos + 20,
            width: `${anchoRiel}px`,
            backgroundColor: colorEstado,
            borderRadius: `${radioRiel}px`,
            opacity: 0.6,
            boxShadow: `0 0 ${grosorRiel * 2}px ${colorEstado}40`
          }}
        />
      );
    }
    
    return rieles;
  };

  // ✅ Renderizar rectángulo contenedor del elevador
  const renderRectanguloElevador = (x, elevador, index) => {
    const cabinas = elevador.datos?.cabinas || [];
    
    if (cabinas.length === 0) return null;
    
    const colorEstado = getEstadoElevadorColor(elevador);
    const colorBorde = oscurecerColor(colorEstado, 0.7);
    const colorFondo = hexToRgba(colorEstado, rectanguloOpacidad);
    
    const pisosOcupados = cabinas
      .map(c => c.piso_actual)
      .filter(p => p !== undefined && p !== null);
    
    if (pisosOcupados.length === 0) return null;
    
    const pisoMin = Math.min(...pisosOcupados);
    const pisoMax = Math.max(...pisosOcupados);
    
    const pisoMinIndex = pisos.indexOf(pisoMin);
    const pisoMaxIndex = pisos.indexOf(pisoMax);
    
    if (pisoMinIndex === -1 || pisoMaxIndex === -1) return null;
    
    const yInicio = offsetY + pisoMaxIndex * altoCelda;
    const yFin = offsetY + (pisoMinIndex + 1) * altoCelda;
    const alturaRect = yFin - yInicio;
    
    const anchoRect = anchoCelda * 0.7;
    const xRect = x - anchoRect / 2;
    
    return (
      <div
        key={`rectangulo-${elevador.id}-${index}`}
        className="absolute pointer-events-none transition-all duration-500 z-[5]"
        style={{
          left: xRect,
          top: yInicio,
          width: anchoRect,
          height: alturaRect,
          backgroundColor: colorFondo,
          border: `${rectanguloBordeGrosor}px ${rectanguloBordeTipo} ${colorBorde}`,
          borderRadius: `${rectanguloBordeRadio}px`,
          boxShadow: `0 0 20px ${colorEstado}20`,
        }}
      />
    );
  };

  // ✅ Dimensiones totales
  const altoTotal = Math.max(
    offsetY + altoCelda * numPisos + margenInferior,
    matrizHeight
  );

  const anchoTotal = Math.max(
    offsetX + anchoCelda * numElevadores + margenDerecho,
    margenIzquierdo + anchoCelda * numElevadores + margenDerecho
  );

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${bgColor} relative flex flex-col`}
      style={{ 
        minHeight: `${matrizHeight}px`,
        maxHeight: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Contenedor de la matriz con scroll SOLO vertical */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden" 
        style={{ 
          minHeight: 0,
          maxHeight: '100%',
          position: 'relative'
        }}
      >
        <div 
          className="relative"
          style={{
            width: `${anchoTotal}px`,
            height: `${altoTotal}px`,
            minWidth: '100%'
          }}
        >
          <div className={`absolute inset-0 ${bgGradient}`} />

          {/* ✅ RIELES VERTICALES POR ELEVADOR */}
          {elevadoresMostrar.map((elevador, j) => {
            const x = offsetX + j * anchoCelda + anchoCelda / 2;
            return (
              <React.Fragment key={`rieles-${elevador.id}`}>
                {renderRieles(x, elevador)}
              </React.Fragment>
            );
          })}

          {/* ✅ RECTÁNGULO DEL ELEVADOR */}
          {elevadoresMostrar.map((elevador, j) => {
            const x = offsetX + j * anchoCelda + anchoCelda / 2;
            return renderRectanguloElevador(x, elevador, j);
          })}

          {/* ✅ LÍNEAS DEL PISO */}
          {pisos.map((piso, i) => {
            const y = offsetY + i * altoCelda;
            const esFilaAdicional = !pisoEnRango(piso);
            
            const hayCabinasEnPiso = pisoEnRango(piso) && elevadoresMostrar.some(e =>
              e.datos?.cabinas?.some(c => c.piso_actual === piso)
            );
            const esPisoPuertasFijas = piso === pisoMaximo;
            const activo = (hayCabinasEnPiso || esPisoPuertasFijas) && pisoEnRango(piso);
            const tieneLlamada = pisoEnRango(piso) && pisoTieneLlamada(piso);
            
            // ✅ NUEVO: Detectar si hay un elevador fuera de rango en este piso
            const hayElevadorFueraDeRango = esFilaAdicional && hayElevadorFueraDeRangoEnPiso(piso);

            let pisoColor;
            if (esFilaAdicional) {
              // ✅ Naranja si hay elevador fuera de rango, gris si no
              pisoColor = hayElevadorFueraDeRango 
                ? '#f97316'
                : (isDark ? '#64748b' : '#94a3b8');
            } else if (tieneLlamada) {
              pisoColor = colorLlamadaPiso;
            } else if (activo) {
              pisoColor = isDark ? '#22d3ee' : '#3b82f6';
            } else {
              pisoColor = isDark ? '#334155' : '#94a3b8';
            }

            // ✅ Para filas adicionales, el círculo y la línea se activan si hay elevador
            const esActivo = esFilaAdicional ? hayElevadorFueraDeRango : activo;
            const labelPiso = esFilaAdicional ? '-' : piso;

            return (
              <div key={`piso-${piso}`} className="absolute" style={{ top: y, left: 0, right: 0, height: altoCelda }}>
                {/* Columna de pisos (izquierda) */}
                <div className="absolute" style={{ left: 8, width: 36, top: '50%', transform: 'translateY(-50%)' }}>
                  <IconPiso 
                    numero={labelPiso}
                    activo={esFilaAdicional ? false : (esActivo || tieneLlamada)}
                    color={pisoColor}
                    textColor={isDark ? '#ffffff' : '#1e293b'}
                    isDark={isDark}
                  />
                  {esFilaAdicional && hayElevadorFueraDeRango && (
                    <div className="absolute -top-1 -right-1 text-[8px] text-orange-500">⚠️</div>
                  )}
                  {tieneLlamada && (
                    <div className="absolute -top-1 -right-1 text-[8px]" style={{ color: colorLlamadaPiso }}>🟣</div>
                  )}
                </div>

                {/* Indicadores de sentido (izquierda) */}
                <div className="absolute flex items-center gap-1" style={{ left: 48, top: '50%', transform: 'translateY(-50%)' }}>
                  <div 
                    className="w-2.5 h-2.5 rounded-full transition-all duration-300" 
                    style={{ 
                      backgroundColor: colores.subiendo,
                      opacity: haySubiendoEnPiso(piso) ? 1 : 0.15,
                      boxShadow: haySubiendoEnPiso(piso) ? `0 0 10px ${colores.subiendo}` : 'none'
                    }} 
                  />
                  <div 
                    className="w-2.5 h-2.5 rounded-full transition-all duration-300" 
                    style={{ 
                      backgroundColor: colores.bajando,
                      opacity: hayBajandoEnPiso(piso) ? 1 : 0.15,
                      boxShadow: hayBajandoEnPiso(piso) ? `0 0 10px ${colores.bajando}` : 'none'
                    }} 
                  />
                </div>

                {/* Línea del piso */}
                <div 
                  className="absolute h-px transition-all duration-300"
                  style={{
                    left: 68,
                    right: 100,
                    top: '50%',
                    background: tieneLlamada 
                      ? `linear-gradient(90deg, ${colorLlamadaPiso}80 0%, ${colorLlamadaPiso}20 100%)`
                      : (esFilaAdicional && hayElevadorFueraDeRango)
                        ? `linear-gradient(90deg, #f9731680 0%, #f9731620 100%)`
                        : esActivo 
                          ? (isDark ? 'linear-gradient(90deg, rgba(34,211,238,0.4) 0%, rgba(34,211,238,0.1) 100%)' : 'linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%)')
                          : (isDark ? 'linear-gradient(90deg, rgba(51,65,85,0.3) 0%, rgba(51,65,85,0.1) 100%)' : 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.03) 100%)'),
                    opacity: (esActivo || tieneLlamada || (esFilaAdicional && hayElevadorFueraDeRango)) ? 1 : 0.3
                  }}
                />

                {/* Indicadores de sentido (derecha) */}
                <div className="absolute flex items-center gap-1" style={{ right: 48, top: '50%', transform: 'translateY(-50%)' }}>
                  <div 
                    className="w-2.5 h-2.5 rounded-full transition-all duration-300" 
                    style={{ 
                      backgroundColor: colores.subiendo,
                      opacity: haySubiendoEnPiso(piso) ? 1 : 0.15,
                      boxShadow: haySubiendoEnPiso(piso) ? `0 0 10px ${colores.subiendo}` : 'none'
                    }} 
                  />
                  <div 
                    className="w-2.5 h-2.5 rounded-full transition-all duration-300" 
                    style={{ 
                      backgroundColor: colores.bajando,
                      opacity: hayBajandoEnPiso(piso) ? 1 : 0.15,
                      boxShadow: hayBajandoEnPiso(piso) ? `0 0 10px ${colores.bajando}` : 'none'
                    }} 
                  />
                </div>

                {/* Columna de pisos (derecha) */}
                <div className="absolute" style={{ right: 8, width: 36, top: '50%', transform: 'translateY(-50%)' }}>
                  <IconPiso 
                    numero={labelPiso}
                    activo={esFilaAdicional ? false : (esActivo || tieneLlamada)}
                    color={pisoColor}
                    textColor={isDark ? '#ffffff' : '#1e293b'}
                    isDark={isDark}
                  />
                  {esFilaAdicional && hayElevadorFueraDeRango && (
                    <div className="absolute -top-1 -right-1 text-[8px] text-orange-500">⚠️</div>
                  )}
                  {tieneLlamada && (
                    <div className="absolute -top-1 -right-1 text-[8px]" style={{ color: colorLlamadaPiso }}>🟣</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* ✅ ETIQUETAS SUPERIORES DE ELEVADORES */}
          {mostrarEtiquetas && elevadoresMostrar.map((elevador, j) => {
            const x = offsetX + j * anchoCelda + anchoCelda / 2;
            const colorEstado = getEstadoElevadorColor(elevador);
            return (
              <div 
                key={`label-${elevador.id}`}
                className="absolute text-center"
                style={{ 
                  left: x,
                  top: offsetY - 30,
                  transform: 'translateX(-50%)',
                  minWidth: `${anchoCelda - 10}px`
                }}
              >
                <div 
                  className="px-2 py-0.5 rounded-lg backdrop-blur-sm border text-[10px] font-bold whitespace-nowrap transition-all duration-300"
                  style={{
                    backgroundColor: `${colorEstado}30`,
                    borderColor: `${colorEstado}80`,
                    color: colorEstado
                  }}
                >
                  {elevador.nombre_corto || elevador.codigo}
                </div>
              </div>
            );
          })}

          {/* ✅ CABINAS VIAJERAS */}
          {elevadoresMostrar.map((elevador, j) => {
            const x = offsetX + j * anchoCelda + anchoCelda / 2;
            const datos = elevador.datos;
            const cabinas = datos?.cabinas || [];
            const colorEstado = getEstadoElevadorColor(elevador);

            return cabinas.map((cabina, idx) => {
              const pisoIndex = pisos.indexOf(cabina.piso_actual);
              if (pisoIndex === -1) return null;
              
              const y = offsetY + pisoIndex * altoCelda + (altoCelda / 2) - (iconSize / 2);
              const xCabina = x - (iconSize / 2);
              
              const apertura = cabina.apertura_puertas ?? 0;
              const puertaImg = getIconoPuerta(apertura);

              return (
                <div 
                  key={`cabina-${elevador.id}-${idx}`}
                  className="absolute transition-all duration-500 ease-out z-10"
                  style={{ 
                    left: xCabina,
                    top: y,
                    width: iconSize,
                    height: iconSize
                  }}
                >
                  {puertaImg ? (
                    <img 
                      src={puertaImg} 
                      alt={`Cabina ${idx + 1}`}
                      className="w-full h-full object-contain"
                      style={{ filter: `drop-shadow(0 0 12px ${colorEstado}80)` }}
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-2xl"
                      style={{ filter: `drop-shadow(0 0 12px ${colorEstado}80)` }}
                    >
                      🚪
                    </div>
                  )}

                  {cabina.llamada && (
                    <div 
                      className="absolute -top-2 -right-2 w-3 h-3 rounded-full animate-pulse"
                      style={{ 
                        backgroundColor: colorLlamadaPiso,
                        boxShadow: `0 0 10px ${colorLlamadaPiso}`
                      }}
                      title={`Llamada a piso ${cabina.piso_llamada}`}
                    />
                  )}

                  <div 
                    className="absolute inset-0 flex items-center justify-center text-[10px] font-bold pointer-events-none"
                    style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {cabina.piso_actual}
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* ✅ LEYENDA */}
      <div className={`flex-shrink-0 ${leyendaBg} backdrop-blur-sm border-t ${borderColor} px-4 py-2 text-xs flex flex-wrap gap-3 ${textColor}`}>
        {estados.filter(e => e.activo).slice(0, 8).map(estado => (
          <span key={estado.clave} className="flex items-center gap-1">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: estado.color }}
            />
            {estado.nombre}
          </span>
        ))}
        <span className={isDark ? 'text-slate-500' : 'text-gray-300'}>|</span>
        <span className="flex items-center gap-1">
          <span 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: colorLlamadaPiso }}
          />
          Llamada a piso
        </span>
        <span className="flex items-center gap-1">
          <span 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: '#f97316' }}
          />
          Fuera de rango
        </span>
        <span className="ml-auto text-[10px] opacity-50">
          Pisos: {pisoMinimo} → {pisoMaximo}
        </span>
      </div>
    </div>
  );
};

export default MatrizMinimalista;
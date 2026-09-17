// frontend/src/components/pages/Visualizacion/VisualizacionInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { interfaceVisualService } from '../../../services/interfaceVisualService';
import { emuladorService } from '../../../services/emuladorService';
import { variableScadaService } from '../../../services/variableScadaService';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const VisualizacionInterface = () => {
  const { id } = useParams();
  const [interfaceData, setInterfaceData] = useState(null);
  const [datosEmulador, setDatosEmulador] = useState(null);
  const [variablesScada, setVariablesScada] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [valoresCards, setValoresCards] = useState({});
  const [cardsExpandidas, setCardsExpandidas] = useState({});
  const [posicionesVisuales, setPosicionesVisuales] = useState({});
  const containerRef = useRef(null);
  const pageTitle = useNombreInterfaz('visualizacion');

  useEffect(() => {
    cargarInterface();
    cargarVariablesScada();
  }, [id]);

  useEffect(() => {
    if (interfaceData?.plc_origen) {
      const interval = setInterval(() => {
        cargarDatosEmulador(interfaceData.plc_origen);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [interfaceData]);

  useEffect(() => {
    if (interfaceData && variablesScada.length > 0 && datosEmulador) {
      actualizarValoresCards();
    }
  }, [interfaceData, variablesScada, datosEmulador]);

  const cargarInterface = async () => {
    try {
      const data = await interfaceVisualService.getById(id);
      setInterfaceData(data);
      if (data.plc_origen) {
        await cargarDatosEmulador(data.plc_origen);
      }
    } catch (err) {
      console.error('Error cargando interfaz:', err);
      setError('No se pudo cargar la interfaz');
    } finally {
      setLoading(false);
    }
  };

  const cargarVariablesScada = async () => {
    try {
      const result = await variableScadaService.getAll({ activo: true });
      setVariablesScada(result.data);
    } catch (err) {
      console.error('Error cargando variables SCADA:', err);
    }
  };

  const cargarDatosEmulador = async (plc) => {
    try {
      const data = await emuladorService.obtenerDatos(plc);
      setDatosEmulador(data);
    } catch (err) {
      console.error('Error cargando datos del emulador:', err);
    }
  };

  const actualizarValoresCards = () => {
    if (!interfaceData?.cards || !variablesScada.length || !datosEmulador?.plc?.registros) {
      return;
    }

    const nuevosValores = {};

    interfaceData.cards.forEach((card, index) => {
      if (card.variable_scada_id) {
        const variable = variablesScada.find(v => 
          (v.id_variable || v.id) === card.variable_scada_id
        );
        
        if (variable) {
          const direccion = variable.direccion_modbus;
          const registro = datosEmulador.plc.registros[direccion];
          
          if (registro) {
            nuevosValores[index] = {
              valor: registro.valor,
              nombre: registro.nombre,
              hex: registro.hex,
              unidad: variable.unidad || '',
              descripcion: registro.descripcion || '',
              direccion: direccion,
              variable_nombre: variable.nombre || variable.titulo || '',
              estado: card.sku || 'SKU',
            };
          }
        }
      }
    });

    setValoresCards(nuevosValores);
  };

  const toggleCardExpandida = (index) => {
    const nuevaExpandida = !cardsExpandidas[index];
    
    if (nuevaExpandida) {
      // Al expandir, calcular posición visual para que no se salga del contenedor
      const card = interfaceData?.cards?.[index];
      if (card && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth || 800;
        const containerHeight = containerRef.current.offsetHeight || 600;
        const cardWidth = 280; // Ancho de la card expandida
        const cardHeight = 220; // Alto de la card expandida
        const margin = 20;
        
        // Posición original
        let x = card.x || 20;
        let y = card.y || 20;
        
        // Ajustar en X: si la card está demasiado cerca del borde derecho, moverla a la izquierda
        if (x + cardWidth + margin > containerWidth) {
          x = Math.max(margin, containerWidth - cardWidth - margin);
        }
        
        // Ajustar en Y: si la card está demasiado cerca del borde inferior, moverla hacia arriba
        if (y + cardHeight + margin > containerHeight) {
          y = Math.max(margin, containerHeight - cardHeight - margin);
        }
        
        // Guardar la nueva posición visual (no persistente)
        setPosicionesVisuales(prev => ({
          ...prev,
          [index]: {
            x: x,
            y: y
          }
        }));
      }
    } else {
      // Al contraer, eliminar la posición visual (vuelve a la original)
      setPosicionesVisuales(prev => {
        const newPos = { ...prev };
        delete newPos[index];
        return newPos;
      });
    }
    
    setCardsExpandidas(prev => ({
      ...prev,
      [index]: nuevaExpandida
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-primary-500">Cargando interfaz...</span>
      </div>
    );
  }

  if (error || !interfaceData) {
    return (
      <div className="bg-red-50 text-red-800 p-6 rounded-xl shadow-card">
        <h3 className="font-semibold">❌ Error</h3>
        <p className="text-sm">{error || 'Interfaz no encontrada'}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative rounded-xl overflow-hidden shadow-2xl"
      style={{
        width: interfaceData.x_final || '100%',
        height: interfaceData.y_final || '600px',
        backgroundImage: interfaceData.imagen_fondo ? `url(${interfaceData.imagen_fondo})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0a0e1a',
        minHeight: '400px',
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {(interfaceData.cards || []).map((card, index) => {
        const valorData = valoresCards[index] || {};
        const valor = valorData.valor !== undefined ? valorData.valor : card.valor || 0;
        const unidad = valorData.unidad || '';
        const isExpandida = cardsExpandidas[index] || false;
        const estado = valorData.estado || card.sku || 'SKU';
        const titulo = valorData.variable_nombre || card.nombre || 'Card';
        const direccion = valorData.direccion || '';
        const descripcion = valorData.descripcion || card.descripcion || '';

        // Obtener posición: si está expandida y tiene posición visual, usarla; sino la original
        const posX = posicionesVisuales[index]?.x !== undefined ? posicionesVisuales[index].x : (card.x || 20);
        const posY = posicionesVisuales[index]?.y !== undefined ? posicionesVisuales[index].y : (card.y || 20);

        const cardWidth = isExpandida ? 280 : 170;
        const cardHeight = isExpandida ? 220 : 100;

        return (
          <div
            key={index}
            className={`absolute bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border transition-all duration-300 ${
              isExpandida 
                ? 'border-cyan-400 shadow-cyan-500/30 z-30' 
                : 'border-cyan-500/30 hover:border-cyan-400/60 z-10'
            } hover:z-20`}
            style={{
              left: posX,
              top: posY,
              width: cardWidth,
              height: cardHeight,
              padding: isExpandida ? '16px' : '10px 14px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isExpandida 
                ? '0 8px 32px rgba(0, 200, 255, 0.25), 0 0 60px rgba(0, 200, 255, 0.08)' 
                : '0 4px 15px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-xl pointer-events-none" />
            
            {/* SKU / Estado con botón expandir */}
            <div className={`flex justify-between items-start relative z-10 ${isExpandida ? 'mb-1' : 'mb-0'}`}>
              <span className={`font-mono uppercase tracking-wider ${isExpandida ? 'text-[11px]' : 'text-[10px]'} text-cyan-400/70`}>
                {estado}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); toggleCardExpandida(index); }}
                className={`text-gray-500 hover:text-cyan-400 transition-colors text-xs ml-1 flex-shrink-0 ${isExpandida ? 'bg-slate-800/80 px-1.5 py-0.5 rounded' : ''}`}
                title={isExpandida ? 'Contraer' : 'Expandir'}
              >
                {isExpandida ? '✕' : '⤢'}
              </button>
            </div>

            {/* Valor + Unidad */}
            <div className={`flex items-end gap-1.5 relative z-10 ${isExpandida ? 'mt-1' : 'mt-0'}`}>
              <span className={`font-mono tracking-tight font-bold text-white ${isExpandida ? 'text-3xl' : 'text-xl'}`}>
                {valor}
              </span>
              {unidad && (
                <span className={`text-gray-400 ${isExpandida ? 'text-sm' : 'text-[10px]'}`}>
                  {unidad}
                </span>
              )}
            </div>

            {/* Título */}
            <div className={`text-gray-300 truncate font-medium relative z-10 ${isExpandida ? 'text-sm mt-1' : 'text-xs mt-0.5'}`}>
              {titulo}
            </div>

            {/* Contenido expandido */}
            {isExpandida && (
              <div className="mt-2 pt-2 border-t border-cyan-500/20 space-y-1 relative z-10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Dirección:</span>
                  <span className="text-cyan-300 font-mono">{direccion || '-'}</span>
                </div>
                {descripcion && (
                  <div className="text-[10px] text-gray-400 mt-1 max-h-16 overflow-y-auto whitespace-pre-wrap break-words leading-relaxed">
                    {descripcion}
                  </div>
                )}
              </div>
            )}

            {/* Información en hover (solo modo compacto) */}
            {!isExpandida && (
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-slate-900/95 rounded-xl p-3 flex flex-col justify-center z-20">
                <div className="text-[10px] text-cyan-400/70 truncate font-mono">
                  📍 {direccion || 'Sin dirección'}
                </div>
                {descripcion && (
                  <div className="text-[10px] text-gray-400 mt-1 max-h-12 overflow-hidden">
                    {descripcion.length > 80 ? descripcion.substring(0, 80) + '...' : descripcion}
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleCardExpandida(index); }}
                  className="text-[10px] text-cyan-400/70 hover:text-cyan-300 transition-colors mt-1 self-start"
                >
                  📖 Ver más
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Título de la interfaz */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-cyan-500/20 z-20">
        <div className="text-sm font-medium">{interfaceData.titulo}</div>
        {interfaceData.subtitulo && (
          <div className="text-xs text-gray-400">{interfaceData.subtitulo}</div>
        )}
      </div>

      {/* Estado de conexión */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-cyan-500/20 z-20">
        <div className={`w-2 h-2 rounded-full ${datosEmulador ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
        <span className="text-xs text-gray-300 font-mono">
          {datosEmulador ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
};

export default VisualizacionInterface;
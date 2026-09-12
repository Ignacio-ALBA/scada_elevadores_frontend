// frontend/src/components/pages/InterfazGrafica/CarruselElevadores.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ElevadorCard from './ElevadorCard';

const CarruselElevadores = ({
  elevadores,
  onElevadorSelect,
  elevadoresSeleccionados  = []
}) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const carruselRef = useRef(null);
  const containerRef = useRef(null);
  const [cardsPorPagina, setCardsPorPagina] = useState(4);
  const [cardWidth, setCardWidth] = useState(280);
  const [gap, setGap] = useState(16);
  const prevElevadoresLengthRef = useRef(0);

  // También log cuando se hace click en una card
  const handleCardClick = (elevadorId) => {
    // console.log('🖱️ Card clickeada - ID:', elevadorId);
    onElevadorSelect(elevadorId);
  };

  // Calcular cards por página según el ancho disponible
  const calcularCardsPorPagina = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const paddingTotal = 80; // padding izquierdo + derecho + flechas
    
    // ✅ Ancho máximo y mínimo de cada card
    const CARD_MIN_WIDTH = 220;
    const CARD_MAX_WIDTH = 320;
    const GAP_SIZE = 16;

    // Ancho disponible para las cards
    const availableWidth = containerWidth - paddingTotal;
    
    // Calcular cuántas cards caben con el ancho máximo
    let maxCards = Math.floor((availableWidth + GAP_SIZE) / (CARD_MAX_WIDTH + GAP_SIZE));
    
    // Limitar entre 1 y 6 cards
    maxCards = Math.max(1, Math.min(maxCards, 6));
    
    // Si el contenedor es muy pequeño, asegurar al menos 1 card
    if (availableWidth < CARD_MIN_WIDTH) {
      maxCards = 1;
    }

    // Calcular el ancho real de cada card
    const totalGap = (maxCards - 1) * GAP_SIZE;
    const realCardWidth = (availableWidth - totalGap) / maxCards;
    
    // ✅ Aplicar límites: no menos de CARD_MIN_WIDTH ni más de CARD_MAX_WIDTH
    let finalCardWidth = Math.min(Math.max(realCardWidth, CARD_MIN_WIDTH), CARD_MAX_WIDTH);
    
    // Si el ancho real es menor que el mínimo, reducir el número de cards
    if (realCardWidth < CARD_MIN_WIDTH && maxCards > 1) {
      maxCards = maxCards - 1;
      const newTotalGap = (maxCards - 1) * GAP_SIZE;
      const newRealCardWidth = (availableWidth - newTotalGap) / maxCards;
      finalCardWidth = Math.min(Math.max(newRealCardWidth, CARD_MIN_WIDTH), CARD_MAX_WIDTH);
    }

    // Calcular gap real
    const finalGap = maxCards > 1 
      ? (availableWidth - finalCardWidth * maxCards) / (maxCards - 1)
      : 0;

    setCardsPorPagina(maxCards);
    setCardWidth(finalCardWidth);
    setGap(Math.max(8, Math.min(finalGap, 24)));

  }, []);

  // ✅ Recalcular al redimensionar
  useEffect(() => {
    calcularCardsPorPagina();
    
    const handleResize = () => {
      calcularCardsPorPagina();
    };
    
    window.addEventListener('resize', handleResize);
    
    const resizeObserver = new ResizeObserver(() => {
      calcularCardsPorPagina();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [calcularCardsPorPagina]);

  const totalPaginas = Math.max(1, Math.ceil(elevadores.length / cardsPorPagina));

  useEffect(() => {
    const currentLength = elevadores.length;
    if (prevElevadoresLengthRef.current !== currentLength) {
      prevElevadoresLengthRef.current = currentLength;
      if (scrollIndex >= totalPaginas) {
        setScrollIndex(Math.max(0, totalPaginas - 1));
      }
    }
  }, [elevadores.length, totalPaginas, scrollIndex]);

  const handleScroll = useCallback((direccion) => {
    const nuevoIndex = Math.max(0, Math.min(scrollIndex + direccion, totalPaginas - 1));
    setScrollIndex(nuevoIndex);
    
    if (carruselRef.current) {
      const offset = nuevoIndex * (cardWidth + gap) * cardsPorPagina;
      carruselRef.current.scrollTo({
        left: offset,
        behavior: 'smooth'
      });
    }
  }, [scrollIndex, totalPaginas, cardWidth, gap, cardsPorPagina]);

  useEffect(() => {
    if (!carruselRef.current) return;
    
    const targetScroll = scrollIndex * (cardWidth + gap) * cardsPorPagina;
    if (Math.abs(carruselRef.current.scrollLeft - targetScroll) > 5) {
      carruselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'auto'
      });
    }
  }, [cardsPorPagina, scrollIndex, cardWidth, gap]);

  const elevadoresVisibles = elevadores.slice(
    scrollIndex * cardsPorPagina,
    (scrollIndex + 1) * cardsPorPagina
  );

  if (elevadores.length === 0) {
    return (
      <div className="bg-slate-800/30 border-b border-slate-700 px-4 py-6 text-center text-slate-400">
        No hay elevadores configurados
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-slate-800/30 border-b border-slate-700 px-3 py-3 w-full">
      {/*  Indicador de selección */}
      {elevadoresSeleccionados.length > 0 && (
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs text-cyan-400">
            {elevadoresSeleccionados.length} elevador(es) seleccionado(s)
          </span>
          <button
            onClick={() => {
              // console.log('🧹 Botón "Limpiar selección" clickeado en Carrusel');
              onElevadorSelect(null);
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ✕ Limpiar selección
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Flecha izquierda */}
        <button
          onClick={() => handleScroll(-1)}
          disabled={scrollIndex === 0}
          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
            scrollIndex === 0
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          ◀
        </button>

        {/* Carrusel */}
        <div
          ref={carruselRef}
          className="flex-1 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          <div 
            className="flex transition-all duration-300"
            style={{ 
              gap: `${gap}px`,
              minWidth: 'max-content'
            }}
          >
            {elevadoresVisibles.map((elevador) => {
              const isSelected = elevadoresSeleccionados.includes(elevador.id);
              
              return (
                <div
                  key={elevador.id}
                  style={{ 
                    width: `${cardWidth}px`,
                    flexShrink: 0,
                    maxWidth: '320px',
                    minWidth: '220px'
                  }}
                >
                  <ElevadorCard
                    key={elevador.id}
                    elevador={elevador}
                    seleccionado={isSelected}
                    onClick={() => handleCardClick(elevador.id)} // ← Usar handleCardClick
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Flecha derecha */}
        <button
          onClick={() => handleScroll(1)}
          disabled={scrollIndex >= totalPaginas - 1}
          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
            scrollIndex >= totalPaginas - 1
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          ▶
        </button>
      </div>

      {/* Indicadores de página */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: totalPaginas }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setScrollIndex(i);
                if (carruselRef.current) {
                  const offset = i * (cardWidth + gap) * cardsPorPagina;
                  carruselRef.current.scrollTo({
                    left: offset,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === scrollIndex
                  ? 'w-6 bg-cyan-500'
                  : 'w-3 bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarruselElevadores;

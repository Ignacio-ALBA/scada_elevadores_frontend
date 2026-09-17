// frontend/src/components/pages/InterfazGrafica/vistas/VistaMejorada/CarruselMejorado.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ElevadorCardMejorado from './ElevadorCardMejorado';

const CarruselMejorado = ({
  elevadores,
  onElevadorSelect,
  elevadoresSeleccionados = [],
  isDark = false,
  onViewPopup = null,
  iconos = {},
  vistaActual = null
}) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const carruselRef = useRef(null);
  const containerRef = useRef(null);
  const [cardsPorPagina, setCardsPorPagina] = useState(4);
  const [cardWidth, setCardWidth] = useState(240);
  const [gap, setGap] = useState(16);
  const prevElevadoresLengthRef = useRef(0);

  // Glassmorphism
  const containerBg = isDark 
    ? 'bg-slate-800/30 backdrop-blur-sm border-slate-700/50' 
    : 'bg-white/30 backdrop-blur-sm border-gray-200/50';
  const textColor = isDark ? 'text-slate-400' : 'text-gray-500';
  const textColorSelected = isDark ? 'text-cyan-400' : 'text-primary-600';
  const buttonColor = isDark ? 'text-slate-400 hover:bg-slate-700/50 hover:text-white' : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-800';
  const buttonDisabled = isDark ? 'text-slate-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed';
  const indicatorBg = isDark ? 'bg-slate-600' : 'bg-gray-400';
  const indicatorActive = isDark ? 'bg-cyan-500' : 'bg-primary-500';

  const calcularCardsPorPagina = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const paddingTotal = 80;
    const CARD_MIN_WIDTH = 180;
    const CARD_MAX_WIDTH = 260;
    const GAP_SIZE = 16;
    const availableWidth = containerWidth - paddingTotal;
    let maxCards = Math.floor((availableWidth + GAP_SIZE) / (CARD_MAX_WIDTH + GAP_SIZE));
    maxCards = Math.max(1, Math.min(maxCards, 6));
    if (availableWidth < CARD_MIN_WIDTH) maxCards = 1;
    const totalGap = (maxCards - 1) * GAP_SIZE;
    const realCardWidth = (availableWidth - totalGap) / maxCards;
    let finalCardWidth = Math.min(Math.max(realCardWidth, CARD_MIN_WIDTH), CARD_MAX_WIDTH);
    if (realCardWidth < CARD_MIN_WIDTH && maxCards > 1) {
      maxCards = maxCards - 1;
      const newTotalGap = (maxCards - 1) * GAP_SIZE;
      const newRealCardWidth = (availableWidth - newTotalGap) / maxCards;
      finalCardWidth = Math.min(Math.max(newRealCardWidth, CARD_MIN_WIDTH), CARD_MAX_WIDTH);
    }
    const finalGap = maxCards > 1 
      ? (availableWidth - finalCardWidth * maxCards) / (maxCards - 1)
      : 0;
    setCardsPorPagina(maxCards);
    setCardWidth(finalCardWidth);
    setGap(Math.max(8, Math.min(finalGap, 24)));
  }, []);

  useEffect(() => {
    calcularCardsPorPagina();
    const handleResize = () => calcularCardsPorPagina();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => calcularCardsPorPagina());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
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
      if (scrollIndex >= totalPaginas) setScrollIndex(Math.max(0, totalPaginas - 1));
    }
  }, [elevadores.length, totalPaginas, scrollIndex]);

  const handleScroll = useCallback((direccion) => {
    const nuevoIndex = Math.max(0, Math.min(scrollIndex + direccion, totalPaginas - 1));
    setScrollIndex(nuevoIndex);
    if (carruselRef.current) {
      const offset = nuevoIndex * (cardWidth + gap) * cardsPorPagina;
      carruselRef.current.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [scrollIndex, totalPaginas, cardWidth, gap, cardsPorPagina]);

  useEffect(() => {
    if (!carruselRef.current) return;
    const targetScroll = scrollIndex * (cardWidth + gap) * cardsPorPagina;
    if (Math.abs(carruselRef.current.scrollLeft - targetScroll) > 5) {
      carruselRef.current.scrollTo({ left: targetScroll, behavior: 'auto' });
    }
  }, [cardsPorPagina, scrollIndex, cardWidth, gap]);

  const elevadoresVisibles = elevadores.slice(
    scrollIndex * cardsPorPagina,
    (scrollIndex + 1) * cardsPorPagina
  );

  if (elevadores.length === 0) {
    return (
      <div className={`${containerBg} px-4 py-4 text-center ${textColor} border-b`}>
        No hay elevadores configurados
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${containerBg} px-3 py-2 w-full border-b backdrop-blur-sm`} style={{ minHeight: '56px' }}>
      {/* Header del carrusel */}
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium ${textColor}`}>
          🛗 Elevadores ({elevadores.length})
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-xl transition-all duration-300 ${isDark ? 'hover:bg-slate-700/50 text-slate-400' : 'hover:bg-gray-200/50 text-gray-500'}`}
          title={collapsed ? 'Expandir carrusel' : 'Contraer carrusel'}
        >
          {collapsed ? '▼' : '▲'}
        </button>
      </div>

      {/* Contenido colapsable */}
      <div className={`transition-all duration-300 overflow-hidden ${collapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
        {elevadoresSeleccionados.length > 0 && (
          <div className="flex items-center justify-between mb-1 px-2">
            <span className={`text-xs ${textColorSelected}`}>
              {elevadoresSeleccionados.length} elevador(es) seleccionado(s)
            </span>
            <button
              onClick={() => onElevadorSelect(null)}
              className={`text-xs ${textColor} hover:${isDark ? 'text-white' : 'text-gray-800'} transition-colors`}
            >
              ✕ Limpiar selección
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll(-1)}
            disabled={scrollIndex === 0}
            className={`flex-shrink-0 p-1.5 rounded-xl transition-all duration-300 ${
              scrollIndex === 0 ? buttonDisabled : buttonColor
            }`}
          >
            ◀
          </button>

          <div
            ref={carruselRef}
            className="flex-1 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex transition-all duration-500" style={{ gap: `${gap}px`, minWidth: 'max-content' }}>
              {elevadoresVisibles.map((elevador) => {
                const isSelected = elevadoresSeleccionados.includes(elevador.id);
                return (
                  <div
                    key={elevador.id}
                    style={{ width: `${cardWidth}px`, flexShrink: 0, maxWidth: '260px', minWidth: '180px' }}
                  >
                    <ElevadorCardMejorado
                      elevador={elevador}
                      seleccionado={isSelected}
                      onClick={() => onElevadorSelect(elevador.id)}
                      isDark={isDark}
                      onViewPopup={onViewPopup}
                      iconos={iconos}
                      vistaActual={vistaActual}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleScroll(1)}
            disabled={scrollIndex >= totalPaginas - 1}
            className={`flex-shrink-0 p-1.5 rounded-xl transition-all duration-300 ${
              scrollIndex >= totalPaginas - 1 ? buttonDisabled : buttonColor
            }`}
          >
            ▶
          </button>
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setScrollIndex(i);
                  if (carruselRef.current) {
                    const offset = i * (cardWidth + gap) * cardsPorPagina;
                    carruselRef.current.scrollTo({ left: offset, behavior: 'smooth' });
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === scrollIndex
                    ? `w-6 ${indicatorActive}`
                    : `w-2.5 ${indicatorBg}`
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarruselMejorado;
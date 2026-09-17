// frontend/src/components/pages/InterfazGrafica/vistas/VistaMinimalista/CarruselMinimalista.jsx
import React, { useState, useRef, useEffect } from 'react';
import ElevadorCardMinimalista from './ElevadorCardMinimalista';
import { useDraggable } from './useDraggable';

const CarruselMinimalista = ({
  posicion,
  onPositionChange,
  containerRef: parentContainerRef,
  elevadores,
  onElevadorSelect,
  elevadoresSeleccionados = [],
  isDark = false,
  onViewPopup = null,
  iconos = {},
  vistaActual = null,
  expandido = false,
  onToggleExpand = null
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Hook de drag
  const { position, isDragging, elementRef, handleMouseDown } = useDraggable({
    initialPosition: posicion,
    onPositionChange: onPositionChange,
    containerRef: parentContainerRef,
    enabled: true,
  });

  const containerBg = isDark 
    ? 'bg-slate-800/60 backdrop-blur-md border-slate-700/50' 
    : 'bg-white/60 backdrop-blur-md border-gray-200/50';
  const buttonColor = isDark ? 'text-slate-400 hover:bg-slate-700/50' : 'text-gray-500 hover:bg-gray-200/50';
  const buttonDisabled = isDark ? 'text-slate-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed';

  const totalCards = elevadores.length;

  const handlePrev = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    if (onToggleExpand) onToggleExpand();
  };

  if (totalCards === 0) {
    return null;
  }

  const elevadorActual = elevadores[currentIndex];
  const isSelected = elevadoresSeleccionados.includes(elevadorActual?.id);

  return (
    <div
      ref={elementRef}
      className={`absolute z-20 ${containerBg} border rounded-lg shadow-lg transition-shadow ${
        isDragging ? 'shadow-2xl cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: 'fit-content',
        transform: 'translate(-50%, -50%)',
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* ✅ Fila única: ◀ [Card] ▶ [▲/▼] */}
      <div className="flex items-center gap-1 px-1.5 py-1">
        {/* Botón anterior */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex-shrink-0 p-1 rounded text-[10px] ${
            currentIndex === 0 ? buttonDisabled : buttonColor
          } transition-all`}
          title="Anterior"
        >
          ◀
        </button>

        {/* Card actual */}
        <div style={{ width: expandido ? '220px' : '160px' }}>
          <ElevadorCardMinimalista
            elevador={elevadorActual}
            seleccionado={isSelected}
            onClick={() => onElevadorSelect(elevadorActual.id)}
            isDark={isDark}
            onViewPopup={onViewPopup}
            iconos={iconos}
            vistaActual={vistaActual}
            expandido={expandido}
          />
        </div>

        {/* Botón siguiente */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= totalCards - 1}
          className={`flex-shrink-0 p-1 rounded text-[10px] ${
            currentIndex >= totalCards - 1 ? buttonDisabled : buttonColor
          } transition-all`}
          title="Siguiente"
        >
          ▶
        </button>

        {/* Botón expandir/contraer */}
        <button
          onClick={handleToggleExpand}
          className={`flex-shrink-0 p-1 rounded text-[10px] ${buttonColor} transition-all`}
          title={expandido ? 'Comprimir carrusel' : 'Expandir carrusel'}
        >
          {expandido ? '▼' : '▲'}
        </button>
      </div>
    </div>
  );
};

export default CarruselMinimalista;
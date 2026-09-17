// frontend/src/components/pages/InterfazGrafica/vistas/VistaMinimalista/useDraggable.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para hacer elementos arrastrables y guardar posiciones en %
 * @param {Object} options
 * @param {Object} options.initialPosition - { x, y } en porcentaje (0-100)
 * @param {Function} options.onPositionChange - Callback cuando cambia la posición
 * @param {Object} options.containerRef - Ref al contenedor padre (para limitar)
 * @param {boolean} options.enabled - Si el drag está habilitado
 */
export const useDraggable = ({
  initialPosition = { x: 0, y: 0 },
  onPositionChange = null,
  containerRef = null,
  enabled = true,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const saveTimeoutRef = useRef(null);

  // Sincronizar posición externa
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  // Guardar con debounce
  const savePositionDebounced = useCallback((newPos) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (onPositionChange) {
        onPositionChange(newPos);
      }
    }, 500);
  }, [onPositionChange]);

  // Iniciar drag
  const handleMouseDown = useCallback((e) => {
    if (!enabled) return;
    if (!elementRef.current || !containerRef?.current) return;
    
    // Ignorar clics en botones u otros elementos interactivos
    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    
    setIsDragging(true);
  }, [enabled, position.x, position.y, containerRef]);

  // Mover
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!containerRef?.current || !elementRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();
      
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;
      
      // Calcular nueva posición en porcentaje
      let newXPercent = dragStartRef.current.posX + (deltaX / containerRect.width) * 100;
      let newYPercent = dragStartRef.current.posY + (deltaY / containerRect.height) * 100;
      
      // Limitar a los bordes
      const elementWidthPercent = (elementRect.width / containerRect.width) * 100;
      const elementHeightPercent = (elementRect.height / containerRect.height) * 100;
      
    //   newXPercent = Math.max(0, Math.min(newXPercent, 100 - elementWidthPercent));
      newXPercent = Math.max(0, Math.min(newXPercent, 100));
      newYPercent = Math.max(0, Math.min(newYPercent, 100 - elementHeightPercent));
      
      const newPos = { x: newXPercent, y: newYPercent };
      setPosition(newPos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      savePositionDebounced(position);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, containerRef, savePositionDebounced]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    position,
    isDragging,
    elementRef,
    handleMouseDown,
    setPosition,
  };
};
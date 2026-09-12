// frontend/src/hooks/useInactivity.js
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { configuracionService } from '../services/configuracionService';

export const useInactivity = (enabled = true) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const timeoutMinutesRef = useRef(30);
  const enabledRef = useRef(enabled);
  const isModalOpenRef = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [inactiveTime, setInactiveTime] = useState(0);

  // Cargar configuración de tiempo de inactividad
  useEffect(() => {
    const loadInactivityTime = async () => {
      try {
        const sistema = await configuracionService.getSistema();
        const minutes = parseInt(sistema.tiempo_inactividad) || 30;
        timeoutMinutesRef.current = minutes;
        console.log(`⏰ Tiempo de inactividad configurado: ${minutes} minutos`);
      } catch (error) {
        console.error('Error cargando tiempo de inactividad:', error);
      }
    };
    loadInactivityTime();
  }, []);

  // Función para resetear el contador de inactividad
  const resetInactivityTimer = () => {
    // Si el modal está abierto, NO resetear el contador
    if (isModalOpenRef.current) {
      // console.log('⏰ Modal abierto, ignorando reset de inactividad');
      return;
    }
    
    if (!enabledRef.current) return;
    
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Programar nuevo timeout
    const milliseconds = timeoutMinutesRef.current * 60 * 1000;
    timeoutRef.current = setTimeout(() => {
      const inactive = (Date.now() - lastActivityRef.current) / 1000 / 60;
      console.log(`⏰ Inactividad detectada: ${inactive.toFixed(1)} minutos`);
      setInactiveTime(inactive);
      setShowModal(true);
      isModalOpenRef.current = true;
    }, milliseconds);
  };

  //  Función para forzar el logout (ya no hay "Continuar")
  const handleForcedLogout = () => {
    isModalOpenRef.current = false;
    setShowModal(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    logout();
    navigate('/login');
  };

  // Event listeners para detectar actividad del usuario
  useEffect(() => {
    if (!enabled) {
      enabledRef.current = false;
      return;
    }

    enabledRef.current = true;

    const events = [
      'mousedown', 'mousemove', 'keydown', 'scroll', 
      'touchstart', 'click', 'wheel'
    ];

    const handleUserActivity = () => {
      // Si el modal está abierto, NO hacer nada
      if (isModalOpenRef.current) {
        // console.log('⏰ Modal abierto, ignorando actividad del usuario');
        return;
      }
      
      if (enabledRef.current) {
        resetInactivityTimer();
      }
    };

    // Resetear inmediatamente al montar
    resetInactivityTimer();

    // Agregar event listeners
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Limpiar
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled]);

  // Función para actualizar el tiempo de inactividad dinámicamente
  const updateInactivityTime = async () => {
    try {
      const sistema = await configuracionService.getSistema();
      const minutes = parseInt(sistema.tiempo_inactividad) || 30;
      timeoutMinutesRef.current = minutes;
      resetInactivityTimer();
      console.log(`⏰ Tiempo de inactividad actualizado: ${minutes} minutos`);
    } catch (error) {
      console.error('Error actualizando tiempo de inactividad:', error);
    }
  };

  return { 
    updateInactivityTime, 
    showModal, 
    inactiveTime, 
    handleForcedLogout  // Solo logout forzado
  };
};
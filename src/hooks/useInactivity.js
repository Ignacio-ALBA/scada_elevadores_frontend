// frontend/src/hooks/useInactivity.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { configuracionService } from '../services/configuracionService';

export const useInactivity = (enabled = true) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const timeoutMinutesRef = useRef(30);
  const isModalOpenRef = useRef(false);
  const logIntervalRef = useRef(null);
  
  const [showModal, setShowModal] = useState(false);
  const [inactiveTime, setInactiveTime] = useState(0);

  //  Detectar si estamos en interfaz gráfica
  const isInterfazGrafica = location.pathname.startsWith('/interfaz-grafica/');

  // Cargar configuración de tiempo de inactividad
  useEffect(() => {
    const loadInactivityTime = async () => {
      try {
        const sistema = await configuracionService.getSistema();
        const minutes = parseInt(sistema.tiempo_inactividad) || 30;
        timeoutMinutesRef.current = minutes;
        // console.log(` [Inactividad] Tiempo configurado: ${minutes} minutos`);
      } catch (error) {
        // console.error('Error cargando tiempo de inactividad:', error);
      }
    };
    loadInactivityTime();
  }, []);

  //  Función para detener TODO (timeout + intervalo de logs)
  const stopAll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (logIntervalRef.current) {
      clearInterval(logIntervalRef.current);
      logIntervalRef.current = null;
    }
  }, []);

  //  Función para forzar logout
  const handleForcedLogout = useCallback(() => {
    isModalOpenRef.current = false;
    setShowModal(false);
    stopAll();
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permisos');
    
    logout();
    navigate('/login');
  }, [logout, navigate, stopAll]);

  // ============================================
  //  EFECTO PRINCIPAL - Controla toda la lógica
  // ============================================
  useEffect(() => {
    // ==========================================
    // CASO 1: INTERFAZ GRÁFICA - DESACTIVAR TODO
    // ==========================================
    if (isInterfazGrafica) {
      // console.log(' [Inactividad] MODO INTERFAZ GRÁFICA - Desactivada completamente');
      
      //  Detener CUALQUIER timer o intervalo pendiente
      stopAll();
      
      //  Cerrar modal si estaba abierto
      if (isModalOpenRef.current) {
        setShowModal(false);
        isModalOpenRef.current = false;
      }
      
      //  Resetear la referencia de actividad a "ahora" para que cuando salgamos
      // el contador empiece desde 0 (no desde el valor viejo)
      lastActivityRef.current = Date.now();
      
      //  No agregar event listeners, no programar timeout
      // Salir del efecto
      return () => {
        // Cleanup: nada que hacer aquí, ya limpiamos todo arriba
      };
    }

    // ==========================================
    // CASO 2: NO INTERFAZ GRÁFICA - ACTIVAR INACTIVIDAD
    // ==========================================
    // console.log(' [Inactividad] MODO NORMAL - Activada');
    
    //  Resetear el contador a 0
    lastActivityRef.current = Date.now();
    
    //  Detener cualquier timer viejo
    stopAll();

    //  Función que resetea el timer (se llama en cada actividad del usuario)
    const resetTimer = () => {
      if (isModalOpenRef.current) return;
      
      // Cancelar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Actualizar referencia de actividad
      lastActivityRef.current = Date.now();
      
      // Programar nuevo timeout
      const milliseconds = timeoutMinutesRef.current * 60 * 1000;
      timeoutRef.current = setTimeout(() => {
        const inactive = (Date.now() - lastActivityRef.current) / 1000 / 60;
        // console.log(` [Inactividad] SESIÓN EXPIRADA por ${inactive.toFixed(1)} minutos sin actividad`);
        setInactiveTime(inactive);
        setShowModal(true);
        isModalOpenRef.current = true;
      }, milliseconds);
    };

    //  Programar el timeout inicial
    resetTimer();

    //  Iniciar intervalo de logs cada minuto
    logIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      // console.log(`⏱ [Inactividad] ${mins}m ${secs}s sin actividad (límite: ${timeoutMinutesRef.current}m)`);
    }, 60000);

    //  Event listeners para detectar actividad
    const events = [
      'mousedown', 'mousemove', 'keydown', 'scroll', 
      'touchstart', 'click', 'wheel', 'focus'
    ];

    const handleUserActivity = () => {
      if (isModalOpenRef.current) return;
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    //  Cleanup: cuando cambie la ruta o se desmonte
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      stopAll();
    };
  }, [isInterfazGrafica, stopAll]);

  // ============================================
  //  EFECTO PARA DETECTAR CAMBIO DE RUTA
  // ============================================
  // Cuando cambia la ruta, el useEffect principal se re-ejecuta porque
  // isInterfazGrafica cambia. Esto asegura que la lógica se reinicie.

  // Función para actualizar el tiempo de inactividad dinámicamente
  const updateInactivityTime = useCallback(async () => {
    try {
      const sistema = await configuracionService.getSistema();
      const minutes = parseInt(sistema.tiempo_inactividad) || 30;
      timeoutMinutesRef.current = minutes;
      // console.log(` [Inactividad] Tiempo actualizado: ${minutes} minutos`);
    } catch (error) {
      console.error('Error actualizando tiempo de inactividad:', error);
    }
  }, []);

  return { 
    updateInactivityTime, 
    showModal, 
    inactiveTime, 
    handleForcedLogout
  };
};
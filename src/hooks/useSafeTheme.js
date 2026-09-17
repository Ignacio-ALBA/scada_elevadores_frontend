// frontend/src/hooks/useSafeTheme.js
import { useContext } from 'react';
import { ThemeContext, TEMAS_HARDCODEADOS } from '../context/ThemeContext';

export const useSafeTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context) {
    return context;
  }
  
  //  Leer desde localStorage si el contexto no está disponible
  const usarTemasBD = JSON.parse(localStorage.getItem('usarTemasBD') || 'true');
  const temaActual = localStorage.getItem('tema_actual') || 'default';
  const temaConfig = TEMAS_HARDCODEADOS[temaActual] || TEMAS_HARDCODEADOS.default;
  
  return {
    temaActual: temaActual,
    temaConfig: temaConfig,
    TEMAS: TEMAS_HARDCODEADOS,
    loading: false,
    usarTemasBD: usarTemasBD,
    temasDisponibles: TEMAS_HARDCODEADOS,
    cambiarTema: async () => ({ success: false, error: 'ThemeProvider no disponible' }),
    cargarTema: async () => {},
    recargarTemas: async () => {},
  };
};
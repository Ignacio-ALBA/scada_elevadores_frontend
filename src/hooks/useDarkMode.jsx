import { useState, useEffect } from 'react';
import { useSafeTheme } from './useSafeTheme';

/**
 * Hook personalizado para manejar el modo oscuro de forma segura
 * Evita lecturas directas de localStorage en el cuerpo del componente
 */
export const useDarkMode = () => {
  const { temaActual } = useSafeTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = temaActual === 'oscuro';
    setIsDark(dark);
  }, [temaActual]);

  return isDark;
};

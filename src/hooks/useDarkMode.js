// frontend/src/hooks/useDarkMode.jsx
import { useLocation } from 'react-router-dom';

export const useDarkMode = () => {
  const location = useLocation();
  
  // ✅ Páginas que usan modo oscuro
  const darkPages = [
    '/interfaz-grafica',
    '/ms-parametros',
    '/monitor-scada'
  ];
  
  const isDark = darkPages.some(path => location.pathname.startsWith(path));
  
  return { isDark };
};
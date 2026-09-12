// frontend/src/hooks/usePageTitle.jsx
import { useEffect } from 'react';
import { configuracionService } from '../services/configuracionService';

export const usePageTitle = (defaultTitle = 'SmartLift - SCADA Elevadores') => {
  useEffect(() => {
    const actualizar = async () => {
      try {
        const config = await configuracionService.getSistemaPublic();
        
        // Actualizar título
        const titulo = config.nombre_pestana || defaultTitle;
        document.title = titulo;
        
        // Actualizar favicon
        if (config.logotipo_pestana) {
          let link = document.querySelector("link[rel*='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = config.logotipo_pestana;
        }
      } catch (error) {
        console.warn('Error cargando configuración:', error);
        document.title = defaultTitle;
      }
    };
    
    actualizar();
  }, [defaultTitle]);
};
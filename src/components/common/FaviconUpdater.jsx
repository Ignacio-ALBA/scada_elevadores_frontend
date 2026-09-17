// frontend/src/components/common/FaviconUpdater.jsx
import React, { useEffect } from 'react';
import { configuracionService } from '../../services/configuracionService';

const FaviconUpdater = () => {
  useEffect(() => {
    const actualizarFavicon = async () => {
      try {
        const data = await configuracionService.getSistemaPublic();
        
        if (data.logotipo_pestana) {
          let link = document.querySelector("link[rel*='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.logotipo_pestana;
          
          // ✅ También actualizar el título de la pestaña
          if (data.nombre_pestana) {
            document.title = data.nombre_pestana;
          }
        } else {
          // ✅ Si no hay logotipo, usar el favicon por defecto
          let link = document.querySelector("link[rel*='icon']");
          if (link) {
            link.href = '/favicon.ico';
          }
        }
      } catch (error) {
        console.error('Error cargando favicon:', error);
      }
    };
    
    actualizarFavicon();
  }, []);

  return null;
};

export default FaviconUpdater;
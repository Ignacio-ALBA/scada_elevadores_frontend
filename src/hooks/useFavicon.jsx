// frontend/src/hooks/useFavicon.jsx
import { useEffect } from 'react';
import { configuracionService } from '../services/configuracionService';

export const useFavicon = (defaultFavicon = '/vite.svg') => {
  useEffect(() => {
    const actualizarFavicon = async () => {
      try {
        const config = await configuracionService.getSistemaPublic();
        const faviconUrl = config.logotipo_pestana || defaultFavicon;
        
        console.log('🔍 useFavicon - URL del favicon:', faviconUrl);
        
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = faviconUrl;
        
        // Actualizar tipo según extensión
        if (faviconUrl.endsWith('.ico')) {
          link.type = 'image/x-icon';
        } else if (faviconUrl.endsWith('.png')) {
          link.type = 'image/png';
        } else if (faviconUrl.endsWith('.svg')) {
          link.type = 'image/svg+xml';
        }
      } catch (error) {
        console.warn('Error cargando favicon:', error);
        const link = document.querySelector("link[rel*='icon']");
        if (link) {
          link.href = defaultFavicon;
        }
      }
    };
    
    actualizarFavicon();
  }, [defaultFavicon]);
};
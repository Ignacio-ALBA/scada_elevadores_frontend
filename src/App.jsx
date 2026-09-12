// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PermisoProvider } from './context/PermisoContext';
import { InactivityProvider } from './context/InactivityContext';
import { usePageTitle } from './hooks/usePageTitle';
import { useFavicon } from './hooks/useFavicon';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuth } from './context/AuthContext';
import { configuracionService } from './services/configuracionService';
import './index.css';

function App() {
  const { user } = useAuth();

  usePageTitle('SmartLift - SCADA Elevadores');
  useFavicon('/vite.svg');
  const timeoutMinutes = parseInt(localStorage.getItem('tiempo_inactividad')) || 10;

  useEffect(() => {
    if (user) {
      const cargarConfiguracion = async () => {
        try {
          const data = await configuracionService.getSistemaPublic();
          console.log('🔍 App - Config recibida:', data);
          
          // ✅ Actualizar título
          if (data.nombre_pestana) {
            document.title = data.nombre_pestana;
          }
          
          // ✅ Actualizar favicon
          if (data.logotipo_pestana) {
            let link = document.querySelector("link[rel*='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = data.logotipo_pestana;
          }
        } catch (error) {
          console.error('Error cargando configuración:', error);
        }
      };
      cargarConfiguracion();
    }
  }, [user]);

  return (
    <AuthProvider>
      <PermisoProvider>
        <InactivityProvider timeoutMinutes={timeoutMinutes}>
          <RouterProvider router={router} />
        </InactivityProvider>
      </PermisoProvider>
    </AuthProvider>
  );
}

export default App;
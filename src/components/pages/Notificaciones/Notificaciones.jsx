// frontend/src/components/pages/Notificaciones/Notificaciones.jsx
import React, { useEffect, useState } from 'react';
import { useSafeTheme } from '../../../hooks/useSafeTheme';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const Notificaciones = () => {
  const pageTitle = useNombreInterfaz('notificaciones');
  const { temaActual } = useSafeTheme();
  const isDarkMode = temaActual === 'oscuro';

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-primary-500'}`}>
          {pageTitle}
        </h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-text-secondary'}>
          Centro de notificaciones del sistema
        </p>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDarkMode ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-12 flex flex-col items-center justify-center`}>
        <div className="text-6xl mb-4">🔔</div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          En construcción
        </h2>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Estamos trabajando en el centro de notificaciones.
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Próximamente disponible.
        </p>
      </div>
    </div>
  );
};

export default Notificaciones;
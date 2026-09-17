// frontend/src/components/common/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = ({ isDark = false }) => {
  return (
    <div className={`flex items-center justify-center h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto" 
             style={{ borderColor: isDark ? '#38bdf8' : '#3b82f6' }} />
        <p className={`mt-4 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Cargando aplicación...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
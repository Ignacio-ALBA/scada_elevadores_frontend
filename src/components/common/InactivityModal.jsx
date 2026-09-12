// frontend/src/components/common/InactivityModal.jsx
import React, { useEffect } from 'react';

const InactivityModal = ({ isOpen, onLogout, inactiveTime }) => {
  useEffect(() => {
    if (isOpen) {
      // ✅ Auto-logout después de 10 segundos si el usuario no hace nada
      const timer = setTimeout(() => {
        onLogout();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onLogout]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-4 animate-pulse">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h3 className="text-xl font-bold text-red-600 mb-2">
            Sesión expirada
          </h3>
          <p className="text-text-secondary mb-2">
            Has estado inactivo por <strong>{inactiveTime.toFixed(1)} minutos</strong>.
          </p>
          <p className="text-text-muted text-sm mb-6">
            Por seguridad, tu sesión será cerrada automáticamente.
          </p>
          <div className="flex justify-center">
            <button
              onClick={onLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar sesión ahora
            </button>
          </div>
          <p className="text-xs text-text-muted mt-4">
            La sesión se cerrará automáticamente en unos segundos...
          </p>
        </div>
      </div>
    </div>
  );
};

export default InactivityModal;
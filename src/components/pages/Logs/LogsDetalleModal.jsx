// frontend/src/components/pages/Logs/LogsDetalleModal.jsx
import React from 'react';

const LogsDetalleModal = ({ isOpen, onClose, log, isDark = false }) => {
  if (!isOpen || !log) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTipoColor = (tipo) => {
    const colores = {
      'login': isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      'logout': isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800',
      'navegacion': isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
      'accion': isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800',
      'error': isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
      'auditoria': isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
    };
    return colores[tipo] || (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800');
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      'login': 'Login',
      'logout': 'Logout',
      'navegacion': 'Navegación',
      'accion': 'Acción',
      'error': 'Error',
      'auditoria': 'Auditoría',
    };
    return labels[tipo] || tipo;
  };

  const renderDatos = (datos) => {
    if (!datos) return <span className={isDark ? 'text-gray-400' : 'text-text-muted'}>Sin datos adicionales</span>;
    try {
      const parsed = typeof datos === 'string' ? JSON.parse(datos) : datos;
      return (
        <pre className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg text-sm overflow-auto max-h-60 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{datos}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden`}>
          {/* Header */}
          <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>Detalle del Log</h2>
              <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(log.tipo)}`}>
                {getTipoLabel(log.tipo)}
              </span>
            </div>
            <button
              onClick={onClose}
              className={isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Fecha y Hora</label>
                  <div className={`mt-1 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{formatDate(log.timestamp)}</div>
                </div>
                <div>
                  <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Usuario</label>
                  <div className={`mt-1 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{log.usuario || '-'}</div>
                </div>
                <div>
                  <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>IP Address</label>
                  <div className={`mt-1 text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{log.ip_address || '-'}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Origen</label>
                  <div className={`mt-1 text-sm break-all ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{log.origen || '-'}</div>
                </div>
                <div>
                  <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Ruta / Módulo</label>
                  <div className={`mt-1 text-sm font-mono break-all ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{log.ruta || log.modulo || '-'}</div>
                </div>
                <div>
                  <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>User Agent</label>
                  <div className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'} break-all`}>{log.user_agent || '-'}</div>
                </div>
              </div>
            </div>

            {/* Mensaje */}
            <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Mensaje</label>
              <div className={`mt-2 p-3 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {log.mensaje || '-'}
              </div>
            </div>

            {/* Datos adicionales */}
            {(log.datos || log.datos_anteriores || log.datos_nuevos) && (
              <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Datos Adicionales</label>
                <div className="mt-2">
                  {log.datos && (
                    <div className="mb-2">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Datos:</span>
                      {renderDatos(log.datos)}
                    </div>
                  )}
                  {log.datos_anteriores && (
                    <div className="mb-2">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Datos Anteriores:</span>
                      {renderDatos(log.datos_anteriores)}
                    </div>
                  )}
                  {log.datos_nuevos && (
                    <div>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Datos Nuevos:</span>
                      {renderDatos(log.datos_nuevos)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} ${isDark ? 'bg-gray-700' : 'bg-gray-50'} flex justify-end`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                  : 'bg-primary-500 text-white hover:bg-primary-700'
              }`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsDetalleModal;
import React from 'react';

const LogsDetalleModal = ({ isOpen, onClose, log }) => {
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

  // Obtener color según tipo
  const getTipoColor = (tipo) => {
    const colores = {
      'login': 'bg-green-100 text-green-800',
      'logout': 'bg-gray-100 text-gray-800',
      'navegacion': 'bg-blue-100 text-blue-800',
      'accion': 'bg-purple-100 text-purple-800',
      'error': 'bg-red-100 text-red-800',
      'auditoria': 'bg-yellow-100 text-yellow-800',
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800';
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

  // Renderizar datos adicionales (JSON)
  const renderDatos = (datos) => {
    if (!datos) return <span className="text-text-muted">Sin datos adicionales</span>;
    try {
      const parsed = typeof datos === 'string' ? JSON.parse(datos) : datos;
      return (
        <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-auto max-h-60">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return <span className="text-sm">{datos}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-primary-500">Detalle del Log</h2>
              <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(log.tipo)}`}>
                {getTipoLabel(log.tipo)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información general */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Fecha y Hora</label>
                  <div className="mt-1 text-sm font-medium">{formatDate(log.timestamp)}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Usuario</label>
                  <div className="mt-1 text-sm font-medium">{log.usuario || '-'}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider">IP Address</label>
                  <div className="mt-1 text-sm font-mono">{log.ip_address || '-'}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Origen</label>
                  <div className="mt-1 text-sm break-all">{log.origen || '-'}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Ruta / Módulo</label>
                  <div className="mt-1 text-sm font-mono break-all">{log.ruta || log.modulo || '-'}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider">User Agent</label>
                  <div className="mt-1 text-xs text-text-muted break-all">{log.user_agent || '-'}</div>
                </div>
              </div>
            </div>

            {/* Mensaje */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Mensaje</label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                {log.mensaje || '-'}
              </div>
            </div>

            {/* Datos adicionales */}
            {(log.datos || log.datos_anteriores || log.datos_nuevos) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Datos Adicionales</label>
                <div className="mt-2">
                  {log.datos && (
                    <div className="mb-2">
                      <span className="text-xs text-text-muted">Datos:</span>
                      {renderDatos(log.datos)}
                    </div>
                  )}
                  {log.datos_anteriores && (
                    <div className="mb-2">
                      <span className="text-xs text-text-muted">Datos Anteriores:</span>
                      {renderDatos(log.datos_anteriores)}
                    </div>
                  )}
                  {log.datos_nuevos && (
                    <div>
                      <span className="text-xs text-text-muted">Datos Nuevos:</span>
                      {renderDatos(log.datos_nuevos)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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
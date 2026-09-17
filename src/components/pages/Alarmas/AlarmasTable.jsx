// frontend/src/components/pages/Alarmas/AlarmasTable.jsx
import React from 'react';

const AlarmasTable = ({ 
  alarmas, 
  loading, 
  onConfirmar, 
  onResolver, 
  onDelete, 
  onEdit,
  isDark = false
}) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPrioridadColor = (prioridad) => {
    const colores = {
      alta: 'bg-red-100 text-red-800',
      media: 'bg-yellow-100 text-yellow-800',
      baja: 'bg-green-100 text-green-800'
    };
    if (isDark) {
      return {
        alta: 'bg-red-900/50 text-red-300',
        media: 'bg-yellow-900/50 text-yellow-300',
        baja: 'bg-green-900/50 text-green-300'
      }[prioridad] || 'bg-gray-700 text-gray-300';
    }
    return colores[prioridad] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoLabel = (alarma) => {
    if (alarma.resuelta) return 'Resuelta';
    if (alarma.confirmada) return 'Confirmada';
    return 'Activa';
  };

  const getEstadoColor = (alarma) => {
    if (alarma.resuelta) {
      return isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800';
    }
    if (alarma.confirmada) {
      return isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800';
    }
    return isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-card p-8 flex justify-center`}>
        <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando alarmas...</span>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Fecha
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Elevador
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Mensaje
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Prioridad
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Estado
              </th>
              <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {alarmas.length === 0 ? (
              <tr>
                <td colSpan="6" className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  No hay alarmas registradas
                </td>
              </tr>
            ) : (
              alarmas.map((alarma) => (
                <tr key={alarma.id || alarma.id_alarma} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    {formatDate(alarma.timestamp || alarma.created_at)}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    <div className="font-medium">{alarma.codigo_elevador || '-'}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                      {alarma.elevador_nombre || ''}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {alarma.mensaje || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(alarma.prioridad)}`}>
                      {alarma.prioridad || 'Media'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(alarma)}`}>
                      {getEstadoLabel(alarma)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-1 flex-wrap">
                      {!alarma.resuelta && (
                        <>
                          {!alarma.confirmada && (
                            <button
                              onClick={() => onConfirmar(alarma.id || alarma.id_alarma)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                isDark 
                                  ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' 
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                            >
                              Confirmar
                            </button>
                          )}
                          <button
                            onClick={() => onResolver(alarma.id || alarma.id_alarma)}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              isDark 
                                ? 'bg-green-900/50 text-green-300 hover:bg-green-800/50' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            Resolver
                          </button>
                          <button
                            onClick={() => onEdit(alarma)}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              isDark 
                                ? 'bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/50' 
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            Editar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onDelete(alarma.id || alarma.id_alarma)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          isDark 
                            ? 'bg-red-900/50 text-red-300 hover:bg-red-800/50' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className={`px-4 py-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
        Mostrando {alarmas.length} alarmas
      </div>
    </div>
  );
};

export default AlarmasTable;
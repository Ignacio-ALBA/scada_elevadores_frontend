// frontend/src/components/pages/Alarmas/AlarmasTable.jsx
import React, { useState } from 'react';

const AlarmasTable = ({ 
  alarmas = [], 
  loading = false, 
  onConfirmar, 
  onResolver, 
  onDelete,
  onEdit 
}) => {
  // Mostrar mensaje si no hay datos después del filtro
  if (!loading && alarmas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-text-muted text-lg">No hay alarmas que coincidan con los filtros</p>
          <p className="text-text-muted text-sm mt-1">Prueba ajustando los criterios de búsqueda</p>
        </div>
      </div>
    );
  }

  const [confirmando, setConfirmando] = useState(null);
  const [resolviendo, setResolviendo] = useState(null);

  const alarmasList = Array.isArray(alarmas) ? alarmas : [];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="flex justify-center py-8">
          <span className="text-primary-500">Cargando alarmas...</span>
        </div>
      </div>
    );
  }

  if (alarmasList.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="text-center py-8 text-text-muted">
          No hay alarmas para mostrar
        </div>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPrioridadColor = (prioridad) => {
    const colors = {
      alta: 'bg-red-100 text-red-800',
      media: 'bg-yellow-100 text-yellow-800',
      baja: 'bg-green-100 text-green-800'
    };
    return colors[prioridad?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const handleConfirmar = async (id) => {
    if (!window.confirm('¿Confirmar esta alarma?')) return;
    setConfirmando(id);
    try {
      await onConfirmar(id);
    } catch (error) {
      console.error('Error confirmando alarma:', error);
    } finally {
      setConfirmando(null);
    }
  };

  const handleResolver = async (id) => {
    if (!window.confirm('¿Resolver esta alarma?')) return;
    setResolviendo(id);
    try {
      await onResolver(id);
    } catch (error) {
      console.error('Error resolviendo alarma:', error);
    } finally {
      setResolviendo(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta alarma? Esta acción no se puede deshacer.')) return;
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Error eliminando alarma:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Fecha/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Elevador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Mensaje
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {alarmasList.map((alarma) => {
              const id = alarma.id || alarma.id_alarma;
              const isConfirming = confirmando === id;
              const isResolving = resolviendo === id;
              const estaResuelta = alarma.resuelta === true;
              const estaConfirmada = alarma.confirmada === true;

              return (
                <tr key={id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(alarma.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-primary-500 text-sm">
                      {alarma.codigo_elevador || '-'}
                    </div>
                    <div className="text-xs text-text-muted">
                      {alarma.elevador_nombre || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">
                    {alarma.mensaje || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPrioridadColor(alarma.prioridad)}`}>
                      {alarma.prioridad || 'media'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      estaResuelta ? 'bg-green-100 text-green-800' :
                      estaConfirmada ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {estaResuelta ? '✅ Resuelta' :
                       estaConfirmada ? '⏳ Confirmada' : '🔴 Activa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center gap-2 flex-wrap">
                      {/* Editar */}
                      <button
                        onClick={() => onEdit && onEdit(alarma)}
                        disabled={estaResuelta}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-40"
                        title={estaResuelta ? 'No se puede editar una alarma resuelta' : 'Editar alarma'}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>

                      {/* Confirmar */}
                      {!estaConfirmada && !estaResuelta && (
                        <button
                          onClick={() => handleConfirmar(id)}
                          disabled={isConfirming}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors disabled:opacity-40"
                          title="Confirmar alarma"
                        >
                          {isConfirming ? (
                            <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.707a1 1 0 01-1.414 0L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 010 1.414z"/>
                            </svg>
                          )}
                        </button>
                      )}

                      {/* Resolver */}
                      {estaConfirmada && !estaResuelta && (
                        <button
                          onClick={() => handleResolver(id)}
                          disabled={isResolving}
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded transition-colors disabled:opacity-40"
                          title="Resolver alarma"
                        >
                          {isResolving ? (
                            <span className="inline-block w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.707a1 1 0 01-1.414 0L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 010 1.414z"/>
                            </svg>
                          )}
                        </button>
                      )}

                      {/* Eliminar */}
                      {!estaResuelta && (
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar alarma"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                          </svg>
                        </button>
                      )}

                      {estaResuelta && (
                        <span className="text-xs text-green-500 font-medium">Completada</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlarmasTable;
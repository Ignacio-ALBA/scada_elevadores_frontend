// frontend/src/components/pages/Eventos/EventosTable.jsx
import React from 'react';

const EventosTable = ({ 
  eventos, 
  loading, 
  totalPages, 
  currentPage, 
  pageSize,
  onPageChange,
  onPageSizeChange,
  total,
  isDark = false
}) => {
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
    const colores = {
      alta: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
      media: isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      baja: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
    };
    return colores[prioridad] || (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800');
  };

  if (loading) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-card p-8 flex justify-center`}>
        <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando eventos...</span>
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
                Fecha/Hora
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Tipo
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Descripción
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Elevador
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Prioridad
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Usuario
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {eventos.length === 0 ? (
              <tr>
                <td colSpan="6" className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  No hay eventos para mostrar
                </td>
              </tr>
            ) : (
              eventos.map((evento, index) => (
                <tr key={evento.id || index} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    {formatDate(evento.timestamp || evento.fecha_hora)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      evento.tipo === 'alarma' 
                        ? isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'
                        : evento.tipo === 'mantenimiento'
                        ? isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                        : isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {evento.tipo || 'Evento'}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {evento.descripcion || '-'}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="font-medium">{evento.elevador_codigo || '-'}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                      {evento.elevador_nombre || ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {evento.prioridad ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(evento.prioridad)}`}>
                        {evento.prioridad}
                      </span>
                    ) : (
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>-</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {evento.usuario || 'Sistema'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className={`px-4 py-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t flex flex-wrap justify-between items-center gap-2`}>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
              Mostrando {eventos.length} de {total} eventos
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={`px-2 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-lg transition-colors disabled:opacity-50 ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              ◀ Anterior
            </button>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-lg transition-colors disabled:opacity-50 ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Siguiente ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventosTable;
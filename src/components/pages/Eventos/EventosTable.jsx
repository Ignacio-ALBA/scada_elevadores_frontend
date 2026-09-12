// frontend/src/components/pages/Eventos/EventosTable.jsx
import React from 'react';

const EventosTable = ({ 
  eventos = [], 
  loading = false, 
  totalPages = 1, 
  currentPage = 1, 
  pageSize = 10, 
  onPageChange, 
  onPageSizeChange,
  total = 0
}) => {
  const eventosList = Array.isArray(eventos) ? eventos : [];

  // console.log('📊 EventosTable - Eventos recibidos:', eventos.length);
  // console.log('📊 EventosTable - Primer evento:', eventos[0]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="flex justify-center py-8">
          <span className="text-primary-500">Cargando eventos...</span>
        </div>
      </div>
    );
  }

  if (eventosList.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-text-muted text-lg">No hay eventos que coincidan con los filtros</p>
          <p className="text-text-muted text-sm mt-1">Prueba ajustando los criterios de búsqueda</p>
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
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Tipo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {eventosList.map((evento) => (
              <tr key={evento.id || evento.id_evento} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatDate(evento.timestamp || evento.fecha_hora || evento.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-primary-500 text-sm">
                    {evento.elevador_codigo || evento.codigo || '-'}
                  </div>
                  <div className="text-xs text-text-muted">
                    {evento.elevador_nombre || evento.nombre || ''}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm max-w-xs truncate">
                  {evento.descripcion || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {evento.usuario || 'Sistema'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    evento.tipo === 'alarma' || evento.id_tipo ? 'bg-red-100 text-red-800' : 
                    evento.descripcion?.includes('Mantenimiento') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {evento.tipo === 'alarma' || evento.id_tipo ? 'Alarma' : 
                     evento.descripcion?.includes('Mantenimiento') ? 'Mantenimiento' : 'Evento'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-wrap gap-2">
        <span className="text-sm text-text-muted">
          Mostrando {eventosList.length} de {total} eventos
        </span>
        <div className="flex items-center gap-4">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange && onPageSizeChange(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ◀
            </button>
            <span className="text-sm text-text-muted px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventosTable;
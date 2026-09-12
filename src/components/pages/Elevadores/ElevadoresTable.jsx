import React from 'react';

// SVG Iconos inline
const IconEdit = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
  </svg>
);

const IconDelete = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
  </svg>
);

const statusClasses = {
  operativo: 'bg-green-100 text-green-800',
  mantenimiento: 'bg-orange-100 text-orange-800',
  falla: 'bg-red-100 text-red-800',
  desconectado: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  operativo: 'Operativo',
  mantenimiento: 'En Mantenimiento',
  falla: 'Con Falla',
  desconectado: 'Desconectado',
};

const ElevadoresTable = ({ elevadores, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-card flex justify-center">
        <span className="text-primary-500">Cargando elevadores...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Edificio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Capacidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Piso Mín.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Piso Máx.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Último Mant.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {elevadores.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-text-muted">
                  No hay elevadores registrados
                </td>
              </tr>
            ) : (
              elevadores.map((elevador) => (
                <tr key={elevador.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-primary-500">
                    {elevador.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {elevador.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {elevador.edificio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {elevador.tipo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {elevador.capacidad_personas} pers / {elevador.capacidad_kg} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {elevador.piso_minimo !== null ? elevador.piso_minimo : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {elevador.piso_maximo !== null ? elevador.piso_maximo : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[elevador.estado_operativo] || 'bg-gray-100'}`}>
                      {statusLabels[elevador.estado_operativo] || elevador.estado_operativo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {elevador.ultimo_mantenimiento ? new Date(elevador.ultimo_mantenimiento).toLocaleDateString('es-MX') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(elevador)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <IconEdit />
                      </button>
                      <button
                        onClick={() => onDelete(elevador.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <IconDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-text-muted">
        Mostrando {elevadores.length} elevadores
      </div>
    </div>
  );
};

export default ElevadoresTable;
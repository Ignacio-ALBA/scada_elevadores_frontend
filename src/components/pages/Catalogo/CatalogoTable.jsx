import React, { useState } from 'react';

const CatalogoTable = ({
  data,
  columns,
  loading,
  onEdit,
  onDelete,
  onCreate,
  canEdit = false,
  title = '',
  emptyMessage = 'No hay registros',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(item).some(
      value => String(value).toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      {/* Header con búsqueda y botón crear */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">
            Total: {filteredData.length} registros
          </span>
          {canEdit && (
            <button
              onClick={onCreate}
              className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
              </svg>
              Nuevo
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-text-secondary">
                  {col.label}
                </th>
              ))}
              {canEdit && (
                <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (canEdit ? 1 : 0)} className="px-4 py-8 text-center text-text-muted">
                  Cargando...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (canEdit ? 1 : 0)} className="px-4 py-8 text-center text-text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm">
                      {col.render ? col.render(item) : item[col.key] || '-'}
                    </td>
                  ))}
                  {canEdit && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDelete(item.id || item.id_rol || item.id_usuario || item.id_controlador)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogoTable;
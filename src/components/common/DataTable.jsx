// frontend/src/components/common/DataTable.jsx
import React from 'react';
import { useSafeTheme } from '../../hooks/useSafeTheme';

const DataTable = ({ 
  columns, 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  canEdit = true,
  canDelete = true,
  emptyMessage = 'No hay registros',
  isDark = false
}) => {
  const { temaActual } = useSafeTheme();
  const dark = isDark || temaActual === 'oscuro';

  if (loading) {
    return (
      <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-card p-8 flex justify-center`}>
        <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Cargando...</span>
      </div>
    );
  }

  return (
    <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${dark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={dark ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {col.label}
                </th>
              ))}
              {(canEdit || canDelete) && (
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + ((canEdit || canDelete) ? 1 : 0)} className={`px-4 py-8 text-center ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className={dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-sm ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {col.render ? col.render(item) : item[col.key] || '-'}
                    </td>
                  ))}
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {canEdit && onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-blue-400 hover:bg-gray-600' : 'text-blue-600 hover:bg-blue-50'}`}
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}
                        {canDelete && onDelete && (
                          <button
                            onClick={() => onDelete(item.id || item.id_empresa || item.id_edificio || item.id_cabina)}
                            className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-red-50'}`}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        )}
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

export default DataTable;
// frontend/src/components/pages/Mantenimiento/MantenimientoTable.jsx
import React from 'react';

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

const estadoColors = {
  programado: 'bg-blue-100 text-blue-800',
  en_progreso: 'bg-yellow-100 text-yellow-800',
  realizado: 'bg-green-100 text-green-800',
  cancelado: 'bg-gray-100 text-gray-800',
  pendiente: 'bg-blue-100 text-blue-800',
};

const estadoLabels = {
  programado: 'Programado',
  en_progreso: 'En Progreso',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
  pendiente: 'Pendiente',
};

const MantenimientoTable = ({ 
  mantenimientos, 
  onEdit, 
  onDelete, 
  loading, 
  onSort, 
  sortConfig,
  isDark = false 
}) => {
  if (loading) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-card p-8 flex justify-center`}>
        <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando mantenimientos...</span>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      if (typeof date === 'string') {
        const datePart = date.split('T')[0];
        if (!datePart) return '-';
        const parts = datePart.split('-');
        if (parts.length !== 3) return '-';
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      if (date instanceof Date) {
        return date.toLocaleDateString('es-MX');
      }
      return '-';
    } catch (e) {
      return '-';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return '-';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getTipoColor = (tipo) => {
    const colores = {
      preventivo: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
      correctivo: isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800',
      predictivo: isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800',
      urgente: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
    };
    return colores[tipo] || (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800');
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      preventivo: 'Preventivo',
      correctivo: 'Correctivo',
      predictivo: 'Predictivo',
      urgente: 'Urgente',
    };
    return labels[tipo] || tipo;
  };

  const getEstadoColor = (estado) => {
    if (isDark) {
      const darkColors = {
        programado: 'bg-blue-900/50 text-blue-300',
        en_progreso: 'bg-yellow-900/50 text-yellow-300',
        realizado: 'bg-green-900/50 text-green-300',
        cancelado: 'bg-gray-700 text-gray-300',
        pendiente: 'bg-blue-900/50 text-blue-300',
      };
      return darkColors[estado] || 'bg-gray-700 text-gray-300';
    }
    return estadoColors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoLabel = (estado) => {
    return estadoLabels[estado] || estado;
  };

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th 
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-text-secondary hover:text-primary-500'}`}
                onClick={() => onSort('codigo_elevador')}
              >
                Elevador {getSortIcon('codigo_elevador')}
              </th>
              <th 
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-text-secondary hover:text-primary-500'}`}
                onClick={() => onSort('tipo')}
              >
                Tipo {getSortIcon('tipo')}
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Descripción
              </th>
              <th 
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-text-secondary hover:text-primary-500'}`}
                onClick={() => onSort('fecha_programada')}
              >
                Fecha Prog. {getSortIcon('fecha_programada')}
              </th>
              <th 
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-text-secondary hover:text-primary-500'}`}
                onClick={() => onSort('estado')}
              >
                Estado {getSortIcon('estado')}
              </th>
              <th 
                className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-text-secondary hover:text-primary-500'}`}
                onClick={() => onSort('costo')}
              >
                Costo {getSortIcon('costo')}
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {mantenimientos.length === 0 ? (
              <tr>
                <td colSpan="7" className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  No hay mantenimientos registrados
                </td>
              </tr>
            ) : (
              mantenimientos.map((item) => (
                <tr key={item.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    <div className="font-medium text-primary-500">{item.codigo_elevador || '-'}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>{item.elevador || '-'}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(item.tipo)}`}>
                      {getTipoLabel(item.tipo)}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {item.descripcion || '-'}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatDate(item.fecha_programada)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(item.estado)}`}>
                      {getEstadoLabel(item.estado)}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatCurrency(item.costo)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-cyan-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`}
                        title="Editar"
                      >
                        <IconEdit />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}`}
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
    </div>
  );
};

export default MantenimientoTable;
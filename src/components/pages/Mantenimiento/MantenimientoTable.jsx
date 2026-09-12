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

const MantenimientoTable = ({ mantenimientos, onEdit, onDelete, loading, onSort, sortConfig }) => {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-card flex justify-center">
        <span className="text-primary-500">Cargando mantenimientos...</span>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return '-';
    try {
        // Si es string ISO (2026-07-29T00:00:00), tomar solo la fecha sin conversión de zona horaria
        if (typeof date === 'string') {
            // Extraer solo la parte de la fecha YYYY-MM-DD
            const datePart = date.split('T')[0];
            if (!datePart) return '-';
            // Convertir a formato dd/mm/yyyy
            const parts = datePart.split('-');
            if (parts.length !== 3) return '-';
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        // Si es un objeto Date
        if (date instanceof Date) {
            return date.toLocaleDateString('es-MX');
        }
        return '-';
    } catch (e) {
        console.error('Error formateando fecha:', e);
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
      preventivo: 'bg-blue-100 text-blue-800',
      correctivo: 'bg-orange-100 text-orange-800',
      predictivo: 'bg-purple-100 text-purple-800',
      urgente: 'bg-red-100 text-red-800',
    };
    return colores[tipo] || 'bg-gray-100 text-gray-800';
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

  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary-500"
                onClick={() => onSort('codigo_elevador')}
              >
                Elevador {getSortIcon('codigo_elevador')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary-500"
                onClick={() => onSort('tipo')}
              >
                Tipo {getSortIcon('tipo')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Descripción
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary-500"
                onClick={() => onSort('fecha_programada')}
              >
                Fecha Prog. {getSortIcon('fecha_programada')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary-500"
                onClick={() => onSort('estado')}
              >
                Estado {getSortIcon('estado')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary-500"
                onClick={() => onSort('costo')}
              >
                Costo {getSortIcon('costo')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mantenimientos.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-text-muted">
                  No hay mantenimientos registrados
                </td>
              </tr>
            ) : (
              mantenimientos.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-primary-500">{item.codigo_elevador || '-'}</div>
                    <div className="text-sm text-text-muted">{item.elevador || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoColor(item.tipo)}`}>
                      {getTipoLabel(item.tipo)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{item.descripcion || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(item.fecha_programada)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColors[item.estado] || 'bg-gray-100'}`}>
                      {estadoLabels[item.estado] || item.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatCurrency(item.costo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <IconEdit />
                      </button>
                      <button
                          onClick={() => onDelete(item.id)}
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
    </div>
  );
};

export default MantenimientoTable;
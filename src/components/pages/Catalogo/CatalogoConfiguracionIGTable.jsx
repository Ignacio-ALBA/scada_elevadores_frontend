// frontend/src/components/pages/Catalogo/CatalogoConfiguracionIGTable.jsx
import React, { useState } from 'react';
import { configuracionIGService } from '../../../services/configuracionIGService';

const IconChevronUp = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/>
  </svg>
);

const IconChevronDown = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
  </svg>
);

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

const CatalogoConfiguracionIGTable = ({
  configuraciones,
  loading,
  onEdit,
  onDelete,
  onToggleActivo,
  onReordenar,
  puedeEditar,
  puedeEliminar,
  filterActivo,
  isDark = false
}) => {
  const [reordenando, setReordenando] = useState(false);

  const handleMover = async (index, direccion) => {
    const nuevasConfigs = [...configuraciones];
    const nuevoIndex = direccion === 'up' ? index - 1 : index + 1;
    
    if (nuevoIndex < 0 || nuevoIndex >= nuevasConfigs.length) return;
    
    const temp = nuevasConfigs[index];
    nuevasConfigs[index] = nuevasConfigs[nuevoIndex];
    nuevasConfigs[nuevoIndex] = temp;
    
    const configsConOrden = nuevasConfigs.map((c, i) => ({
      id: c.id_configuracion,
      orden: i
    }));
    
    setReordenando(true);
    try {
      await configuracionIGService.reordenar(configsConOrden);
      if (onReordenar) {
        await onReordenar();
      }
    } catch (error) {
      console.error('Error reordenando:', error);
    } finally {
      setReordenando(false);
    }
  };

  const getEmptyMessage = () => {
    if (filterActivo === true) return 'No hay configuraciones activas';
    if (filterActivo === false) return 'No hay configuraciones inactivas';
    return 'No hay configuraciones registradas';
  };

  if (loading || reordenando) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-card flex justify-center`}>
        <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>
          {reordenando ? 'Actualizando orden...' : 'Cargando configuraciones...'}
        </span>
      </div>
    );
  }

  if (configuraciones.length === 0) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-card text-center`}>
        <p className={isDark ? 'text-gray-400' : 'text-text-muted'}>{getEmptyMessage()}</p>
        {filterActivo === false && (
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>
            Las configuraciones inactivas pueden reactivarse desde el modal de edición
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-16 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Orden
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Nombre
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Nombre Corto
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Zona
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Elevadores
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Cabinas
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Estado
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {configuraciones.map((configuracion, index) => (
              <tr key={configuracion.id_configuracion} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleMover(index, 'up')}
                      disabled={index === 0 || reordenando}
                      className={`p-1 disabled:opacity-30 transition-colors ${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-400 hover:text-primary-500'}`}
                      title="Mover arriba"
                    >
                      <IconChevronUp />
                    </button>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>
                      {index + 1}
                    </span>
                    <button
                      onClick={() => handleMover(index, 'down')}
                      disabled={index === configuraciones.length - 1 || reordenando}
                      className={`p-1 disabled:opacity-30 transition-colors ${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-400 hover:text-primary-500'}`}
                      title="Mover abajo"
                    >
                      <IconChevronDown />
                    </button>
                  </div>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap font-medium ${isDark ? 'text-cyan-400' : 'text-gray-900'}`}>
                  {configuracion.nombre}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {configuracion.nombre_corto || '-'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {configuracion.zona || '-'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {configuracion.elevadores?.length || 0}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {configuracion.cabinas?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {configuracion.estado === 'eliminado' ? (
                    <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'}`}>Eliminado</span>
                  ) : configuracion.estado === 'activo' || configuracion.activo === true ? (
                    <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'}`}>Activo</span>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>Inactivo</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    {puedeEditar && configuracion.estado !== 'eliminado' && (
                      <button
                        onClick={() => onEdit(configuracion)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'text-cyan-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`}
                        title="Editar"
                      >
                        <IconEdit />
                      </button>
                    )}
                    {puedeEliminar && configuracion.estado !== 'eliminado' && (
                      <button
                        onClick={() => onDelete(configuracion.id_configuracion)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}`}
                        title="Eliminar"
                      >
                        <IconDelete />
                      </button>
                    )}
                    {configuracion.estado === 'eliminado' && (
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Eliminado</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`px-6 py-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'} flex justify-between`}>
        <span>Mostrando {configuraciones.length} configuraciones</span>
        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Usa las flechas ↑↓ para reordenar</span>
      </div>
    </div>
  );
};

export default CatalogoConfiguracionIGTable;
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const CatalogoRoles = ({ canEdit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [estadoTarget, setEstadoTarget] = useState(null);
  const [estadoAccion, setEstadoAccion] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    nivel_jerarquia: 999,
    descripcion: '',
  });
  const [message, setMessage] = useState(null);
  const pageTitle = useNombreInterfaz('roles');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/roles/');
      setData(response.data);
    } catch (error) {
      console.error('Error cargando roles:', error);
      setMessage({ type: 'error', text: 'Error al cargar los roles' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      nombre: '',
      nivel_jerarquia: 999,
      descripcion: '',
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    if (item.estado === 'eliminado') {
      setMessage({ type: 'error', text: 'No se puede editar un rol eliminado' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    setEditingItem(item);
    setFormData({
      nombre: item.nombre || '',
      nivel_jerarquia: item.nivel_jerarquia || 999,
      descripcion: item.descripcion || '',
    });
    setShowModal(true);
  };

  const openEstadoModal = (item, accion) => {
    if (item.estado === 'eliminado') {
      setMessage({ type: 'error', text: 'No se puede cambiar el estado de un rol eliminado' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    
    const id = item.id_rol || item.id;
    if (!id) {
      setMessage({ type: 'error', text: 'Error: ID del rol no encontrado' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    
    setEstadoTarget({ ...item, id: id });
    setEstadoAccion(accion);
    setShowEstadoModal(true);
  };

  const handleCambiarEstado = async () => {
    const id = estadoTarget?.id || estadoTarget?.id_rol;
    if (!id) {
      setMessage({ type: 'error', text: 'Error: ID del rol no encontrado' });
      setShowEstadoModal(false);
      setEstadoTarget(null);
      setEstadoAccion('');
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    
    try {
      await api.patch(`/roles/${id}/estado`, { estado: estadoAccion });
      setMessage({ type: 'success', text: `Rol cambiado a '${estadoAccion}'` });
      await cargarDatos();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      const errorMsg = error.response?.data?.detail || 'Error al cambiar estado';
      if (typeof errorMsg === 'string') {
        setMessage({ type: 'error', text: errorMsg });
      } else {
        setMessage({ type: 'error', text: 'Error al cambiar el estado del rol' });
      }
    } finally {
      setShowEstadoModal(false);
      setEstadoTarget(null);
      setEstadoAccion('');
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este rol? (No se podrá recuperar)')) return;
    try {
      await api.delete(`/roles/${id}`);
      setMessage({ type: 'success', text: 'Rol eliminado correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el rol' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'nivel_jerarquia' ? parseInt(value) || 999 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre) {
      setMessage({ type: 'error', text: 'El nombre del rol es requerido' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      if (editingItem) {
        await api.put(`/roles/${editingItem.id_rol || editingItem.id}`, formData);
        setMessage({ type: 'success', text: 'Rol actualizado correctamente' });
      } else {
        await api.post('/roles/', formData);
        setMessage({ type: 'success', text: 'Rol creado correctamente' });
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar el rol';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar el rol' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const estadoColors = {
    activo: 'bg-green-100 text-green-800',
    inactivo: 'bg-yellow-100 text-yellow-800',
    eliminado: 'bg-red-100 text-red-800',
  };

  const estadoLabels = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    eliminado: 'Eliminado',
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'nivel_jerarquia', label: 'Nivel' },
    { key: 'descripcion', label: 'Descripción' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[item.estado] || 'bg-gray-100'}`}>
          {estadoLabels[item.estado] || item.estado}
        </span>
      )
    },
  ];

  const accionesDisponibles = (item) => {
    if (item.estado === 'eliminado') return [];
    if (item.estado === 'activo') {
      return [
        { label: 'Desactivar', accion: 'inactivo', color: 'text-yellow-600 hover:bg-yellow-50' },
        { label: 'Eliminar', accion: 'eliminado', color: 'text-red-600 hover:bg-red-50' },
      ];
    }
    if (item.estado === 'inactivo') {
      return [
        { label: 'Activar', accion: 'activo', color: 'text-green-600 hover:bg-green-50' },
        { label: 'Eliminar', accion: 'eliminado', color: 'text-red-600 hover:bg-red-50' },
      ];
    }
    return [];
  };

  return (
    <div>
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
          <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">Total: {data.length} roles</span>
            {canEdit && (
              <button
                onClick={handleCreate}
                className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                </svg>
                Nuevo
              </button>
            )}
          </div>
        </div>

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
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (canEdit ? 1 : 0)} className="px-4 py-8 text-center text-text-muted">
                    No hay roles registrados
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const itemId = item.id_rol || item.id;
                  return (
                    <tr key={itemId} className="hover:bg-gray-50">
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-sm">
                          {col.render ? col.render(item) : item[col.key] || '-'}
                        </td>
                      ))}
                      {canEdit && (
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-1 flex-wrap">
                            {item.estado !== 'eliminado' && (
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                                title="Editar"
                              >
                                ✏️
                              </button>
                            )}
                            {accionesDisponibles(item).map((acc) => (
                              <button
                                key={acc.accion}
                                onClick={() => openEstadoModal({ ...item, id: itemId }, acc.accion)}
                                className={`p-1 rounded text-sm ${acc.color}`}
                                title={acc.label}
                              >
                                {acc.label === 'Activar' ? '✅' : 
                                 acc.label === 'Desactivar' ? '⏸️' : 
                                 '🗑️'}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-500">
                {editingItem ? 'Editar Rol' : 'Nuevo Rol'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Nivel de Jerarquía
                  </label>
                  <input
                    type="number"
                    name="nivel_jerarquia"
                    value={formData.nivel_jerarquia}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Número menor = mayor privilegio (ej: 1 = SuperAdmin)
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Descripción del rol..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para confirmar cambio de estado */}
      {showEstadoModal && estadoTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-primary-500 mb-4">
              Confirmar cambio de estado
            </h3>
            <p className="text-text-secondary mb-2">
              ¿Estás seguro de cambiar el rol <strong>{estadoTarget.nombre}</strong>?
            </p>
            <p className="text-sm text-text-muted mb-4">
              Estado actual: <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColors[estadoTarget.estado]}`}>
                {estadoLabels[estadoTarget.estado]}
              </span>
              {' → '}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColors[estadoAccion]}`}>
                {estadoLabels[estadoAccion]}
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowEstadoModal(false); setEstadoTarget(null); setEstadoAccion(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCambiarEstado}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoRoles;
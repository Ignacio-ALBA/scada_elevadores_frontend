// frontend/src/components/pages/Catalogo/CatalogoRoles.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import SearchBar from '../../common/SearchBar';
import DataTable from '../../common/DataTable';

const CatalogoRoles = ({ canEdit }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [data, searchTerm]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/roles/');
      setData(response.data.data || []);
    } catch (error) {
      console.error('Error cargando roles:', error);
      setMessage({ type: 'error', text: 'Error al cargar los roles' });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let result = data;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        item.nombre?.toLowerCase().includes(term) ||
        item.descripcion?.toLowerCase().includes(term)
      );
    }
    setFilteredData(result);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
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

  // ✅ Botones de acción con estilos dinámicos
  const renderActions = (item) => {
    const itemId = item.id_rol || item.id;
    const actions = [];
    
    if (item.estado !== 'eliminado') {
      actions.push(
        <button
          key="edit"
          onClick={() => handleEdit(item)}
          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-blue-400 hover:bg-gray-600' : 'text-blue-600 hover:bg-blue-50'}`}
          title="Editar"
        >
          ✏️
        </button>
      );
    }
    
    accionesDisponibles(item).forEach((acc) => {
      actions.push(
        <button
          key={acc.accion}
          onClick={() => openEstadoModal({ ...item, id: itemId }, acc.accion)}
          className={`p-1.5 rounded-lg transition-colors ${
            isDark 
              ? acc.accion === 'activo' ? 'text-green-400 hover:bg-gray-600' 
                : acc.accion === 'inactivo' ? 'text-yellow-400 hover:bg-gray-600'
                : 'text-red-400 hover:bg-gray-600'
              : acc.color
          }`}
          title={acc.label}
        >
          {acc.label === 'Activar' ? '✅' : 
           acc.label === 'Desactivar' ? '⏸️' : 
           '🗑️'}
        </button>
      );
    });
    
    return actions;
  };

  return (
    <div>
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>
            Gestiona los roles del sistema
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleCreate}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm ${
              isDark 
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
            </svg>
            Nuevo Rol
          </button>
        )}
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClear={handleClearFilters}
        placeholder="Buscar por nombre o descripción..."
        totalItems={data.length}
        filteredItems={filteredData.length}
        isDark={isDark}
      />

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    {col.label}
                  </th>
                ))}
                {canEdit && (
                  <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (canEdit ? 1 : 0)} className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Cargando...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (canEdit ? 1 : 0)} className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    No hay roles registrados
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id_rol || item.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {col.render ? col.render(item) : item[col.key] || '-'}
                      </td>
                    ))}
                    {canEdit && (
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-1 flex-wrap">
                          {renderActions(item)}
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

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
                {editingItem ? 'Editar Rol' : 'Nuevo Rol'}
              </h2>
              <button onClick={() => setShowModal(false)} className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Nivel de Jerarquía
                  </label>
                  <input
                    type="number"
                    name="nivel_jerarquia"
                    value={formData.nivel_jerarquia}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Número menor = mayor privilegio (ej: 1 = SuperAdmin)
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="Descripción del rol..."
                  />
                </div>
              </div>
              <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button type="button" onClick={() => setShowModal(false)} className={`px-6 py-2 border rounded-lg transition-colors shadow-sm ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-md'
                }`}>
                  Cancelar
                </button>
                <button type="submit" className={`px-6 py-2 rounded-lg transition-colors shadow-sm ${
                  isDark 
                    ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
                }`}>
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
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-md w-full p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
              Confirmar cambio de estado
            </h3>
            <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
              ¿Estás seguro de cambiar el rol <strong>{estadoTarget.nombre}</strong>?
            </p>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
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
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleCambiarEstado}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
                    : 'bg-primary-500 text-white hover:bg-primary-700'
                }`}
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
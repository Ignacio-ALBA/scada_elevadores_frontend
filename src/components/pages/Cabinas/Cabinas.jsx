// frontend/src/components/pages/Cabinas/Cabinas.jsx
import React, { useState, useEffect } from 'react';
import { cabinaService } from '../../../services/cabinaService';
import { elevadorService } from '../../../services/elevadorService';
import { usePermisos } from '../../../context/PermisoContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import SearchBar from '../../common/SearchBar';
import DataTable from '../../common/DataTable';

const Cabinas = () => {
  const [cabinas, setCabinas] = useState([]);
  const [filteredCabinas, setFilteredCabinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [elevadores, setElevadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  const { puedeCrear, puedeEditar, puedeEliminar } = usePermisos();
  const pageTitle = useNombreInterfaz('catalogo_cabinas');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  const [formData, setFormData] = useState({
    id_elevador: '',
    nombre: '',
    nombre_corto: '',
    descripcion: '',
    activo: true,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [cabinas, searchTerm]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [cabinasResult, elevadoresResult] = await Promise.all([
        cabinaService.getAll({ activo: true }),
        elevadorService.getAll({ activo: true })
      ]);
      setCabinas(cabinasResult.data);
      setElevadores(elevadoresResult.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos' });
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let result = [...cabinas];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        item.nombre?.toLowerCase().includes(term) ||
        item.nombre_corto?.toLowerCase().includes(term) ||
        item.descripcion?.toLowerCase().includes(term)
      );
    }
    // Ordenar por elevador
    result.sort((a, b) => {
      const elevadorA = elevadores.find(e => (e.id_elevador || e.id) === a.id_elevador);
      const elevadorB = elevadores.find(e => (e.id_elevador || e.id) === b.id_elevador);
      const nombreA = elevadorA?.nombre || elevadorA?.codigo || '';
      const nombreB = elevadorB?.nombre || elevadorB?.codigo || '';
      return nombreA.localeCompare(nombreB);
    });
    setFilteredCabinas(result);
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
      id_elevador: '',
      nombre: '',
      nombre_corto: '',
      descripcion: '',
      activo: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id_elevador: item.id_elevador || '',
      nombre: item.nombre || '',
      nombre_corto: item.nombre_corto || '',
      descripcion: item.descripcion || '',
      activo: item.activo !== undefined ? item.activo : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar esta cabina?')) return;
    try {
      await cabinaService.delete(id);
      setMessage({ type: 'success', text: 'Cabina desactivada correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al desactivar la cabina' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_elevador || !formData.nombre) {
      setMessage({ type: 'error', text: 'Elevador y nombre son requeridos' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        id_elevador: parseInt(formData.id_elevador),
      };

      if (editingItem) {
        await cabinaService.update(editingItem.id_cabina || editingItem.id, dataToSend);
        setMessage({ type: 'success', text: 'Cabina actualizada correctamente' });
      } else {
        await cabinaService.create(dataToSend);
        setMessage({ type: 'success', text: 'Cabina creada correctamente' });
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar la cabina';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const getElevadorNombre = (id) => {
    const elevador = elevadores.find(e => (e.id_elevador || e.id) === id);
    return elevador ? (elevador.nombre || elevador.codigo) : '-';
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'nombre_corto', label: 'Nombre Corto' },
    { 
      key: 'id_elevador', 
      label: 'Elevador',
      render: (item) => getElevadorNombre(item.id_elevador)
    },
    { 
      key: 'activo', 
      label: 'Estado',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${item.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.activo ? 'Activa' : 'Inactiva'}
        </span>
      )
    },
  ];

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${isDark ? 'text-gray-400' : 'text-primary-500'}`}>
        <span>Cargando datos...</span>
      </div>
    );
  }

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
            Gestiona las cabinas de cada elevador
          </p>
        </div>
        {puedeCrear('cabinas') && (
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
            Nueva Cabina
          </button>
        )}
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClear={handleClearFilters}
        placeholder="Buscar por nombre, nombre corto o descripción..."
        totalItems={cabinas.length}
        filteredItems={filteredCabinas.length}
        isDark={isDark}
      />

      <DataTable
        columns={columns}
        data={filteredCabinas}
        loading={loading}
        onEdit={puedeEditar('cabinas') ? handleEdit : null}
        onDelete={puedeEliminar('cabinas') ? handleDelete : null}
        canEdit={puedeEditar('cabinas')}
        canDelete={puedeEliminar('cabinas')}
        emptyMessage="No hay cabinas registradas"
        isDark={isDark}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
                {editingItem ? 'Editar Cabina' : 'Nueva Cabina'}
              </h2>
              <button onClick={handleCancel} className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Elevador *
                  </label>
                  <select
                    name="id_elevador"
                    value={formData.id_elevador}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="">Seleccionar elevador</option>
                    {elevadores.map((e) => (
                      <option key={e.id_elevador || e.id} value={e.id_elevador || e.id}>
                        {e.nombre || e.codigo}
                      </option>
                    ))}
                  </select>
                </div>

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
                    Nombre Corto
                  </label>
                  <input
                    type="text"
                    name="nombre_corto"
                    value={formData.nombre_corto}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="2"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Activa</label>
                </div>
              </div>

              <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button type="button" onClick={handleCancel} className={`px-6 py-2 border rounded-lg transition-colors shadow-sm ${
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
    </div>
  );
};

export default Cabinas;
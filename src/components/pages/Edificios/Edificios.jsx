// frontend/src/components/pages/Edificios/Edificios.jsx
import React, { useState, useEffect } from 'react';
import { edificioService } from '../../../services/edificioService';
import { empresaService } from '../../../services/empresaService';
import { usePermisos } from '../../../context/PermisoContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import SearchBar from '../../common/SearchBar';
import DataTable from '../../common/DataTable';

const Edificios = () => {
  const [edificios, setEdificios] = useState([]);
  const [filteredEdificios, setFilteredEdificios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  const { puedeCrear, puedeEditar, puedeEliminar } = usePermisos();
  const pageTitle = useNombreInterfaz('edificios');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  const [formData, setFormData] = useState({
    id_empresa: '',
    nombre: '',
    nombre_corto: '',
    ubicacion: '',
    descripcion: '',
    numero_pisos: 0,
    latitud: '',
    longitud: '',
    activo: true,
  });

  useEffect(() => {
    cargarDatos();
    cargarEmpresas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [edificios, searchTerm]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await edificioService.getAll({ activo: true });
      setEdificios(data);
    } catch (error) {
      console.error('Error cargando edificios:', error);
      setMessage({ type: 'error', text: 'Error al cargar los edificios' });
    } finally {
      setLoading(false);
    }
  };

  const cargarEmpresas = async () => {
    try {
      const data = await empresaService.getAll({ activo: true });
      setEmpresas(data);
    } catch (error) {
      console.error('Error cargando empresas:', error);
      setMessage({ type: 'error', text: 'Error al cargar las empresas' });
    }
  };

  const aplicarFiltros = () => {
    let result = edificios;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        item.nombre?.toLowerCase().includes(term) ||
        item.nombre_corto?.toLowerCase().includes(term) ||
        item.ubicacion?.toLowerCase().includes(term)
      );
    }
    setFilteredEdificios(result);
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
      id_empresa: '',
      nombre: '',
      nombre_corto: '',
      ubicacion: '',
      descripcion: '',
      numero_pisos: 0,
      latitud: '',
      longitud: '',
      activo: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id_empresa: item.id_empresa || '',
      nombre: item.nombre || '',
      nombre_corto: item.nombre_corto || '',
      ubicacion: item.ubicacion || '',
      descripcion: item.descripcion || '',
      numero_pisos: item.numero_pisos || 0,
      latitud: item.latitud || '',
      longitud: item.longitud || '',
      activo: item.activo !== undefined ? item.activo : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar este edificio?')) return;
    try {
      await edificioService.delete(id);
      setMessage({ type: 'success', text: 'Edificio desactivado correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al desactivar el edificio' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_empresa) {
      setMessage({ type: 'error', text: 'Debes seleccionar una empresa' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    if (!formData.nombre) {
      setMessage({ type: 'error', text: 'El nombre es requerido' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    const dataToSend = {
      id_empresa: parseInt(formData.id_empresa),
      nombre: formData.nombre,
      nombre_corto: formData.nombre_corto || null,
      ubicacion: formData.ubicacion || null,
      descripcion: formData.descripcion || null,
      numero_pisos: parseInt(formData.numero_pisos) || 0,
      latitud: formData.latitud ? parseFloat(formData.latitud) : null,
      longitud: formData.longitud ? parseFloat(formData.longitud) : null,
      activo: formData.activo,
    };

    try {
      if (editingItem) {
        await edificioService.update(editingItem.id_edificio || editingItem.id, dataToSend);
        setMessage({ type: 'success', text: 'Edificio actualizado correctamente' });
      } else {
        await edificioService.create(dataToSend);
        setMessage({ type: 'success', text: 'Edificio creado correctamente' });
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar el edificio';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const getEmpresaNombre = (id) => {
    const empresa = empresas.find(e => (e.id_empresa || e.id) === id);
    return empresa ? empresa.nombre : '-';
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'nombre_corto', label: 'Nombre Corto' },
    { 
      key: 'id_empresa', 
      label: 'Empresa',
      render: (item) => getEmpresaNombre(item.id_empresa)
    },
    { key: 'ubicacion', label: 'Ubicación' },
    { 
      key: 'activo', 
      label: 'Estado',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${item.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ];

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
            Gestiona los edificios del sistema
          </p>
        </div>
        {puedeCrear('edificios') && (
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
            Nuevo Edificio
          </button>
        )}
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClear={handleClearFilters}
        placeholder="Buscar por nombre, nombre corto o ubicación..."
        totalItems={edificios.length}
        filteredItems={filteredEdificios.length}
        isDark={isDark}
      />

      <DataTable
        columns={columns}
        data={filteredEdificios}
        loading={loading}
        onEdit={puedeEditar('edificios') ? handleEdit : null}
        onDelete={puedeEliminar('edificios') ? handleDelete : null}
        canEdit={puedeEditar('edificios')}
        canDelete={puedeEliminar('edificios')}
        emptyMessage="No hay edificios registrados"
        isDark={isDark}
      />

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
                {editingItem ? 'Editar Edificio' : 'Nuevo Edificio'}
              </h2>
              <button onClick={() => setShowModal(false)} className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Empresa *
                  </label>
                  <select
                    name="id_empresa"
                    value={formData.id_empresa}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="">Seleccionar empresa</option>
                    {empresas.map((emp) => (
                      <option key={emp.id_empresa || emp.id} value={emp.id_empresa || emp.id}>
                        {emp.nombre}
                      </option>
                    ))}
                  </select>
                  {empresas.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      No hay empresas registradas. Crea una en <a href="/empresas" className="text-primary-500 underline">Empresas</a>
                    </p>
                  )}
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
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
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
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Número de Pisos
                  </label>
                  <input
                    type="number"
                    name="numero_pisos"
                    value={formData.numero_pisos}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Latitud
                  </label>
                  <input
                    type="number"
                    name="latitud"
                    value={formData.latitud}
                    onChange={handleInputChange}
                    step="0.000001"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Longitud
                  </label>
                  <input
                    type="number"
                    name="longitud"
                    value={formData.longitud}
                    onChange={handleInputChange}
                    step="0.000001"
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
                  <label className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Activo</label>
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
    </div>
  );
};

export default Edificios;
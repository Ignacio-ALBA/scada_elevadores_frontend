// frontend/src/components/pages/Empresas/Empresas.jsx
import React, { useState, useEffect } from 'react';
import { empresaService } from '../../../services/empresaService';
import { usePermisos } from '../../../context/PermisoContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import SearchBar from '../../common/SearchBar';
import DataTable from '../../common/DataTable';

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  const { puedeCrear, puedeEditar, puedeEliminar, permisos } = usePermisos();
  const pageTitle = useNombreInterfaz('empresas');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  const [formData, setFormData] = useState({
    nombre: '',
    rfc: '',
    direccion: '',
    telefono: '',
    correo: '',
    activo: true,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [empresas, searchTerm]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const result = await empresaService.getAll({ activo: true });
      setEmpresas(result.data);
    } catch (error) {
      console.error('Error cargando empresas:', error);
      setMessage({ type: 'error', text: 'Error al cargar las empresas' });
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let result = empresas;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        item.nombre?.toLowerCase().includes(term) ||
        item.rfc?.toLowerCase().includes(term) ||
        item.correo?.toLowerCase().includes(term)
      );
    }
    setFilteredEmpresas(result);
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
      rfc: '',
      direccion: '',
      telefono: '',
      correo: '',
      activo: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre || '',
      rfc: item.rfc || '',
      direccion: item.direccion || '',
      telefono: item.telefono || '',
      correo: item.correo || '',
      activo: item.activo !== undefined ? item.activo : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar esta empresa?')) return;
    try {
      await empresaService.delete(id);
      setMessage({ type: 'success', text: 'Empresa desactivada correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al desactivar la empresa' });
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
    
    if (!formData.nombre || !formData.rfc) {
      setMessage({ type: 'error', text: 'Nombre y RFC son requeridos' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      if (editingItem) {
        await empresaService.update(editingItem.id_empresa || editingItem.id, formData);
        setMessage({ type: 'success', text: 'Empresa actualizada correctamente' });
      } else {
        await empresaService.create(formData);
        setMessage({ type: 'success', text: 'Empresa creada correctamente' });
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar la empresa';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'rfc', label: 'RFC' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
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

  return (
    <div>
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div>
          {/* ✅ Título configurable con color adaptado al tema */}
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          {/* ✅ Descripción con color adaptado al tema */}
          <p className={`${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>
            Gestiona las empresas del sistema
          </p>
        </div>
        {puedeCrear('empresas') && (
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
            Nueva Empresa
          </button>
        )}
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClear={handleClearFilters}
        placeholder="Buscar por nombre, RFC o correo..."
        totalItems={empresas.length}
        filteredItems={filteredEmpresas.length}
        isDark={isDark}
      />

      <DataTable
        columns={columns}
        data={filteredEmpresas}
        loading={loading}
        onEdit={puedeEditar('empresas') ? handleEdit : null}
        onDelete={puedeEliminar('empresas') ? handleDelete : null}
        canEdit={puedeEditar('empresas')}
        canDelete={puedeEliminar('empresas')}
        emptyMessage="No hay empresas registradas"
        isDark={isDark}
      />

      {/* Modal para crear/editar - CON ESTILOS DINÁMICOS */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
                {editingItem ? 'Editar Empresa' : 'Nueva Empresa'}
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
                    RFC *
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Correo
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
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
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className={`px-6 py-2 border rounded-lg transition-colors shadow-sm ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-md'
                  }`}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`px-6 py-2 rounded-lg transition-colors shadow-sm ${
                    isDark 
                      ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
                  }`}
                >
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

export default Empresas;
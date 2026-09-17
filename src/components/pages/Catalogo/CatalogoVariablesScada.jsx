// frontend/src/components/pages/Catalogo/CatalogoVariablesScada.jsx
import React, { useState, useEffect } from 'react';
import { variableScadaService } from '../../../services/variableScadaService';
import { emuladorService } from '../../../services/emuladorService';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import SearchBar from '../../common/SearchBar';
import DataTable from '../../common/DataTable';

const CatalogoVariablesScada = ({ canEdit }) => {
  const [variables, setVariables] = useState([]);
  const [plcs, setPlcs] = useState([]);
  const [registrosPlc, setRegistrosPlc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    titulo: '',
    descripcion: '',
    tipo_dato: 'entero',
    plc_origen: '',
    direccion_modbus: '',
    registro_nombre: '',
    unidad: '',
    factor_escala: 1.0,
    offset: 0.0,
    formato: '0.00',
    alarma_alto_alto: null,
    alarma_alto: null,
    alarma_bajo: null,
    alarma_bajo_bajo: null,
    activo: true,
  });
  const [message, setMessage] = useState(null);
  const [loadingPlc, setLoadingPlc] = useState(false);
  const [registrosDisponibles, setRegistrosDisponibles] = useState([]);
  const pageTitle = useNombreInterfaz('variables_scada');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  useEffect(() => {
    cargarDatos();
    cargarPLCs();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await variableScadaService.getAll({ activo: true });
      setVariables(data);
    } catch (error) {
      console.error('Error cargando variables:', error);
      setMessage({ type: 'error', text: 'Error al cargar las variables SCADA' });
    } finally {
      setLoading(false);
    }
  };

  const cargarPLCs = async () => {
    try {
      const data = await emuladorService.obtenerPLCs();
      setPlcs(data.plcs || []);
    } catch (error) {
      console.error('Error cargando PLCs:', error);
    }
  };

  const cargarRegistrosPlc = async (plc) => {
    if (!plc) return;
    setLoadingPlc(true);
    try {
      const data = await emuladorService.obtenerRegistros(plc);
      setRegistrosPlc(data.registros || []);
    } catch (error) {
      console.error('Error cargando registros:', error);
      setRegistrosPlc([]);
    } finally {
      setLoadingPlc(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let filtered = variables;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = variables.filter(item => 
        (item.nombre?.toLowerCase() || '').includes(term) ||
        (item.titulo?.toLowerCase() || '').includes(term) ||
        (item.plc_origen?.toLowerCase() || '').includes(term) ||
        (item.tipo_dato?.toLowerCase() || '').includes(term) ||
        (item.unidad?.toLowerCase() || '').includes(term) ||
        String(item.direccion_modbus || '').includes(term)
      );
    }
    
    if (!sortConfig.key) return filtered;
    
    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? '';
      const bVal = b[sortConfig.key] ?? '';
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortConfig.direction === 'asc' 
        ? aStr.localeCompare(bStr) 
        : bStr.localeCompare(aStr);
    });
  }, [variables, sortConfig, searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      nombre: '',
      titulo: '',
      descripcion: '',
      tipo_dato: 'entero',
      plc_origen: '',
      direccion_modbus: '',
      registro_nombre: '',
      unidad: '',
      factor_escala: 1.0,
      offset: 0.0,
      formato: '0.00',
      alarma_alto_alto: null,
      alarma_alto: null,
      alarma_bajo: null,
      alarma_bajo_bajo: null,
      activo: true,
    });
    setRegistrosPlc([]);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre || '',
      titulo: item.titulo || '',
      descripcion: item.descripcion || '',
      tipo_dato: item.tipo_dato || 'entero',
      plc_origen: item.plc_origen || '',
      direccion_modbus: item.direccion_modbus || '',
      registro_nombre: item.registro_nombre || '',
      unidad: item.unidad || '',
      factor_escala: item.factor_escala || 1.0,
      offset: item.offset || 0.0,
      formato: item.formato || '0.00',
      alarma_alto_alto: item.alarma_alto_alto || null,
      alarma_alto: item.alarma_alto || null,
      alarma_bajo: item.alarma_bajo || null,
      alarma_bajo_bajo: item.alarma_bajo_bajo || null,
      activo: item.activo !== undefined ? item.activo : true,
    });
    if (item.plc_origen) {
      cargarRegistrosPlc(item.plc_origen);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar esta variable?')) return;
    try {
      await variableScadaService.delete(id);
      setMessage({ type: 'success', text: 'Variable desactivada correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al desactivar la variable' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handlePlcChange = (e) => {
    const plc = e.target.value;
    setFormData({ ...formData, plc_origen: plc, direccion_modbus: '', registro_nombre: '' });
    cargarRegistrosPlc(plc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.titulo || !formData.plc_origen || !formData.direccion_modbus) {
      setMessage({ type: 'error', text: 'Nombre, título, PLC y dirección son requeridos' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        direccion_modbus: parseInt(formData.direccion_modbus),
      };
      
      if (editingItem) {
        await variableScadaService.update(editingItem.id_variable || editingItem.id, dataToSend);
        setMessage({ type: 'success', text: 'Variable actualizada correctamente' });
      } else {
        await variableScadaService.create(dataToSend);
        setMessage({ type: 'success', text: 'Variable creada correctamente' });
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar la variable';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'titulo', label: 'Título' },
    { key: 'plc_origen', label: 'PLC' },
    { key: 'direccion_modbus', label: 'Dirección' },
    { key: 'tipo_dato', label: 'Tipo' },
    { key: 'unidad', label: 'Unidad' },
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

  const tiposDato = [
    { value: 'entero', label: 'Entero' },
    { value: 'decimal', label: 'Decimal' },
    { value: 'cadena', label: 'Cadena' },
    { value: 'booleano', label: 'Booleano' },
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
          <p className={`${isDark ? 'text-gray-400' : 'text-text-secondary'} text-sm mt-1`}>
            Gestión de variables SCADA para monitoreo y control del sistema
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
            Nueva Variable
          </button>
        )}
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClear={handleClearSearch}
        placeholder="Buscar por nombre, título, PLC, dirección..."
        totalItems={variables.length}
        filteredItems={sortedData.length}
        isDark={isDark}
      />

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th 
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:${isDark ? 'text-cyan-400' : 'text-primary-500'} ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}
                  onClick={() => handleSort('nombre')}
                >
                  Nombre {sortConfig.key === 'nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:${isDark ? 'text-cyan-400' : 'text-primary-500'} ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}
                  onClick={() => handleSort('titulo')}
                >
                  Título {sortConfig.key === 'titulo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:${isDark ? 'text-cyan-400' : 'text-primary-500'} ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}
                  onClick={() => handleSort('plc_origen')}
                >
                  PLC {sortConfig.key === 'plc_origen' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:${isDark ? 'text-cyan-400' : 'text-primary-500'} ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}
                  onClick={() => handleSort('direccion_modbus')}
                >
                  Dirección {sortConfig.key === 'direccion_modbus' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:${isDark ? 'text-cyan-400' : 'text-primary-500'} ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}
                  onClick={() => handleSort('tipo_dato')}
                >
                  Tipo {sortConfig.key === 'tipo_dato' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:${isDark ? 'text-cyan-400' : 'text-primary-500'} ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}
                  onClick={() => handleSort('unidad')}
                >
                  Unidad {sortConfig.key === 'unidad' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Estado
                </th>
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
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                      Cargando variables...
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (canEdit ? 1 : 0)} className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    No hay variables SCADA configuradas
                  </td>
                </tr>
              ) : (
                sortedData.map((item) => (
                  <tr key={item.id_variable || item.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                      {item.nombre || '-'}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {item.titulo || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-cyan-900/50 text-cyan-300' : 'bg-blue-50 text-blue-700'}`}>
                        {item.plc_origen || '-'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                      {item.direccion_modbus || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {item.tipo_dato || '-'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                      {item.unidad || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.activo ? (isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800') : (isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')}`}>
                        {item.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-cyan-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`}
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id_variable || item.id)}
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}`}
                            title="Desactivar"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                            </svg>
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
        <div className={`px-4 py-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'} flex justify-between items-center`}>
          <span>
            Mostrando {sortedData.length} de {variables.length} variables
            {searchTerm && ` (filtrado por "${searchTerm}")`}
          </span>
          <span className={`${isDark ? 'text-gray-500' : 'text-text-muted'}`}>
            {canEdit && '💡 Haz clic en los encabezados para ordenar'}
          </span>
        </div>
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
                {editingItem ? 'Editar Variable SCADA' : 'Nueva Variable SCADA'}
              </h2>
              <button onClick={() => setShowModal(false)} className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Nombre * (identificador único)
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
                    placeholder="estado_sistema_plc1"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Título * (mostrado en interfaz)
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="Estado del Sistema"
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
                    placeholder="Descripción detallada de la variable..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Tipo de Dato *
                  </label>
                  <select
                    name="tipo_dato"
                    value={formData.tipo_dato}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    {tiposDato.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    PLC Origen *
                  </label>
                  <select
                    name="plc_origen"
                    value={formData.plc_origen}
                    onChange={handlePlcChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="">Seleccionar PLC</option>
                    {plcs.map((plc) => (
                      <option key={plc.nombre} value={plc.nombre}>
                        {plc.nombre} ({plc.edificio})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Dirección Modbus *
                  </label>
                  <select
                    name="direccion_modbus"
                    value={formData.direccion_modbus}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    disabled={!formData.plc_origen || loadingPlc}
                  >
                    <option value="">Seleccionar dirección</option>
                    {registrosPlc.map((reg) => (
                      <option key={reg.direccion_dec} value={reg.direccion_dec}>
                        {reg.direccion_dec} - {reg.nombre} (hex: {reg.direccion_hex})
                      </option>
                    ))}
                  </select>
                  {loadingPlc && <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Cargando registros...</span>}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Unidad
                  </label>
                  <input
                    type="text"
                    name="unidad"
                    value={formData.unidad}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="°C, %, m/s"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Formato
                  </label>
                  <input
                    type="text"
                    name="formato"
                    value={formData.formato}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="0.00, #,##0"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Factor de Escala
                  </label>
                  <input
                    type="number"
                    name="factor_escala"
                    value={formData.factor_escala}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Offset
                  </label>
                  <input
                    type="number"
                    name="offset"
                    value={formData.offset}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Alarmas</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Alarma Alto-Alto</label>
                      <input
                        type="number"
                        name="alarma_alto_alto"
                        value={formData.alarma_alto_alto || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Alarma Alto</label>
                      <input
                        type="number"
                        name="alarma_alto"
                        value={formData.alarma_alto || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Alarma Bajo</label>
                      <input
                        type="number"
                        name="alarma_bajo"
                        value={formData.alarma_bajo || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Alarma Bajo-Bajo</label>
                      <input
                        type="number"
                        name="alarma_bajo_bajo"
                        value={formData.alarma_bajo_bajo || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Activa</span>
                  </label>
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

export default CatalogoVariablesScada;
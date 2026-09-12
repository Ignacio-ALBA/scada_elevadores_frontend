// frontend/src/components/pages/Elevadores/Elevadores.jsx
import React, { useState, useEffect } from 'react';
import { elevadorService } from '../../../services/elevadorService';
import { edificioService } from '../../../services/edificioService';
import { usePermisos } from '../../../context/PermisoContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

// SVG Iconos inline
const IconPlus = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
  </svg>
);

const estadoOptions = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'operativo', label: 'Operativo' },
  { value: 'mantenimiento', label: 'En Mantenimiento' },
  { value: 'falla', label: 'Con Falla' },
  { value: 'desconectado', label: 'Desconectado' },
];

const tipoOptions = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'Hidráulico', label: 'Hidráulico' },
  { value: 'Eléctrico', label: 'Eléctrico' },
];

const statusClasses = {
  operativo: 'bg-green-100 text-green-800',
  mantenimiento: 'bg-orange-100 text-orange-800',
  falla: 'bg-red-100 text-red-800',
  desconectado: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  operativo: 'Operativo',
  mantenimiento: 'En Mantenimiento',
  falla: 'Con Falla',
  desconectado: 'Desconectado',
};

const Elevadores = () => {
  const [elevadores, setElevadores] = useState([]);
  const [filteredElevadores, setFilteredElevadores] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingElevador, setEditingElevador] = useState(null);
  const [message, setMessage] = useState(null);
  const { puedeCrear, puedeEditar, puedeEliminar } = usePermisos();
  const pageTitle = useNombreInterfaz('elevadores');

  const [filters, setFilters] = useState({
    search: '',
    edificio: 'todos',
    estado: 'todos',
    tipo: 'todos',
  });

  const [formData, setFormData] = useState({
    id_edificio: '',
    codigo: '',
    nombre: '',
    tipo: 'Eléctrico',
    capacidad_personas: 8,
    capacidad_kg: 630,
    velocidad_nominal: 1.0,
    estado_operativo: 'operativo',
    modelo: '',
    fabricante: '',
    piso_maximo: null,  
    piso_minimo: null, 
    anio_fabricacion: '',
    fecha_instalacion: '',
    ultimo_mantenimiento: '',
    proximo_mantenimiento: '',
    activo: true,
  });

  useEffect(() => {
    console.log('🚀 useEffect INICIAL - llamando cargarDatos()');
    cargarDatos();
  }, []);

  useEffect(() => {
    console.log('🔄 useEffect aplicarFiltros disparado - elevadores state:', elevadores);
    aplicarFiltros();
  }, [elevadores, filters]);

  const cargarDatos = async () => {
    console.log('📥 cargarDatos() iniciado');
    setLoading(true);
    try {
      console.log('🔄 Llamando elevadorService.getAll()...');
      const elevadoresData = await elevadorService.getAll({ activo: true });
      console.log('✅ elevadorService.getAll() completado:', elevadoresData);
      console.log('💾 Llamando setElevadores...');
      setElevadores(elevadoresData);
      console.log('✅ Elevadores guardados en state');
      
      // Intentar cargar edificios, pero no detener si falla
      try {
        console.log('🔄 Llamando edificioService.getAll()...');
        const edificiosData = await edificioService.getAll({ activo: true });
        console.log('✅ edificioService.getAll() completado:', edificiosData);
        console.log('💾 Llamando setEdificios...');
        setEdificios(edificiosData);
        console.log('✅ Edificios guardados en state');
      } catch (edificiosError) {
        console.warn('⚠️ No se pudieron cargar edificios (opcional), pero elevadores sí cargaron:', edificiosError.message);
        setEdificios([]); // Vacío pero no falla
      }
    } catch (error) {
      console.error('❌ ERROR en cargarDatos():', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error response:', error.response);
      setMessage({ type: 'error', text: 'Error al cargar los datos: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    console.log('🔍 aplicarFiltros() iniciado con:', { elevadores, filters });
    let result = elevadores;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(e => 
        e.codigo?.toLowerCase().includes(searchLower) ||
        e.nombre?.toLowerCase().includes(searchLower) ||
        e.modelo?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.edificio !== 'todos') {
      result = result.filter(e => e.id_edificio === parseInt(filters.edificio));
    }
    
    if (filters.estado !== 'todos') {
      result = result.filter(e => e.estado_operativo === filters.estado);
    }
    
    if (filters.tipo !== 'todos') {
      result = result.filter(e => e.tipo === filters.tipo);
    }
    
    console.log('✨ Resultado después de filtros:', result);
    setFilteredElevadores(result);
  };

  const handleAdd = () => {
    setEditingElevador(null);
    setFormData({
      id_edificio: '',
      codigo: '',
      nombre: '',
      tipo: 'Eléctrico',
      capacidad_personas: 8,
      capacidad_kg: 630,
      velocidad_nominal: 1.0,
      estado_operativo: 'operativo',
      modelo: '',
      fabricante: '',
      piso_maximo: null,  
      piso_minimo: null,  
      anio_fabricacion: '',
      fecha_instalacion: '',
      ultimo_mantenimiento: '',
      proximo_mantenimiento: '',
      activo: true,
    });
    setShowForm(true);
  };

  const handleEdit = (elevador) => {
    setEditingElevador(elevador);
    setFormData({
      id_edificio: elevador.id_edificio || '',
      codigo: elevador.codigo || '',
      nombre: elevador.nombre || '',
      tipo: elevador.tipo || 'Eléctrico',
      capacidad_personas: elevador.capacidad_personas || 8,
      capacidad_kg: elevador.capacidad_kg || 630,
      velocidad_nominal: elevador.velocidad_nominal || 1.0,
      estado_operativo: elevador.estado_operativo || 'operativo',
      modelo: elevador.modelo || '',
      fabricante: elevador.fabricante || '',
      piso_maximo: elevador.piso_maximo !== undefined ? elevador.piso_maximo : null,  
      piso_minimo: elevador.piso_minimo !== undefined ? elevador.piso_minimo : null,  
      anio_fabricacion: elevador.anio_fabricacion || '',
      fecha_instalacion: elevador.fecha_instalacion || '',
      ultimo_mantenimiento: elevador.ultimo_mantenimiento || '',
      proximo_mantenimiento: elevador.proximo_mantenimiento || '',
      activo: elevador.activo !== undefined ? elevador.activo : true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elevador?')) {
      return;
    }
    try {
      await elevadorService.delete(id);
      setMessage({ type: 'success', text: 'Elevador eliminado correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el elevador' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.id_edificio) {
      setMessage({ type: 'error', text: 'Debes seleccionar un edificio' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    if (!formData.codigo || !formData.nombre) {
      setMessage({ type: 'error', text: 'Código y nombre son requeridos' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    if (!formData.fabricante) {
      setMessage({ type: 'error', text: 'El fabricante es requerido' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    if (!formData.modelo) {
      setMessage({ type: 'error', text: 'El modelo es requerido' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    if (!formData.velocidad_nominal || formData.velocidad_nominal <= 0) {
      setMessage({ type: 'error', text: 'La velocidad nominal debe ser mayor a 0' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        capacidad_personas: parseInt(formData.capacidad_personas) || 0,
        capacidad_kg: parseFloat(formData.capacidad_kg) || 0,
        velocidad_nominal: parseFloat(formData.velocidad_nominal) || 1.0,
        id_edificio: parseInt(formData.id_edificio),
        piso_maximo: formData.piso_maximo !== null ? parseInt(formData.piso_maximo) : null,  
        piso_minimo: formData.piso_minimo !== null ? parseInt(formData.piso_minimo) : null,  
        anio_fabricacion: formData.anio_fabricacion || null,
        fecha_instalacion: formData.fecha_instalacion || null,
        ultimo_mantenimiento: formData.ultimo_mantenimiento || null,
        proximo_mantenimiento: formData.proximo_mantenimiento || null,
      };

      if (editingElevador) {
        await elevadorService.update(editingElevador.id || editingElevador.id_elevador, dataToSend);
        setMessage({ type: 'success', text: 'Elevador actualizado correctamente' });
      } else {
        await elevadorService.create(dataToSend);
        setMessage({ type: 'success', text: 'Elevador creado correctamente' });
      }
      setShowForm(false);
      setEditingElevador(null);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar el elevador';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar' });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingElevador(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      edificio: 'todos',
      estado: 'todos',
      tipo: 'todos',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // ✅ Para campos numéricos, convertir o usar null
    if (name === 'piso_maximo' || name === 'piso_minimo') {
      setFormData({
        ...formData,
        [name]: value === '' ? null : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const getEdificioNombre = (id) => {
    const edificio = edificios.find(e => (e.id_edificio || e.id) === id);
    return edificio ? edificio.nombre : '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
          <p className="text-text-secondary">
            Gestiona los elevadores del sistema
          </p>
        </div>
        {puedeCrear('elevadores') && (
          <button
            onClick={handleAdd}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
          >
            <IconPlus />
            Nuevo Elevador
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por código, nombre..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.edificio}
            onChange={(e) => handleFilterChange('edificio', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="todos">Todos los edificios</option>
            {edificios.map((ed) => (
              <option key={ed.id_edificio || ed.id} value={ed.id_edificio || ed.id}>
                {ed.nombre}
              </option>
            ))}
          </select>

          <select
            value={filters.estado}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {estadoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={filters.tipo}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {tipoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Edificio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Velocidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Piso Mín.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Piso Máx.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-text-muted">
                    Cargando elevadores...
                  </td>
                </tr>
              ) : filteredElevadores.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-text-muted">
                    No hay elevadores registrados
                  </td>
                </tr>
              ) : (
                filteredElevadores.map((elevador) => (
                  <tr key={elevador.id || elevador.id_elevador} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-primary-500">
                      {elevador.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {elevador.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEdificioNombre(elevador.id_edificio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {elevador.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {elevador.capacidad_personas} pers / {elevador.capacidad_kg} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {elevador.velocidad_nominal} m/s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {elevador.piso_minimo !== null ? elevador.piso_minimo : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {elevador.piso_maximo !== null ? elevador.piso_maximo : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[elevador.estado_operativo] || 'bg-gray-100'}`}>
                        {statusLabels[elevador.estado_operativo] || elevador.estado_operativo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        {puedeEditar('elevadores') && (
                          <button
                            onClick={() => handleEdit(elevador)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                          </button>
                        )}
                        {puedeEliminar('elevadores') && (
                          <button
                            onClick={() => handleDelete(elevador.id || elevador.id_elevador)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-text-muted">
          Mostrando {filteredElevadores.length} elevadores
        </div>
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-500">
                {editingElevador ? 'Editar Elevador' : 'Nuevo Elevador'}
              </h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Edificio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Edificio *</label>
                  <select
                    name="id_edificio"
                    value={formData.id_edificio}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Seleccionar edificio</option>
                    {edificios.map((ed) => (
                      <option key={ed.id_edificio || ed.id} value={ed.id_edificio || ed.id}>
                        {ed.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Código *</label>
                  <input type="text" name="codigo" value={formData.codigo} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ej: ELEV-001" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ej: Elevador Principal" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Tipo *</label>
                  <select name="tipo" value={formData.tipo} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="Hidráulico">Hidráulico</option>
                    <option value="Eléctrico">Eléctrico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Fabricante *</label>
                  <input type="text" name="fabricante" value={formData.fabricante} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ej: OTIS" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Modelo *</label>
                  <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ej: OTIS-2000" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Capacidad (personas) *</label>
                  <input type="number" name="capacidad_personas" value={formData.capacidad_personas} onChange={handleInputChange} required min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Capacidad (kg) *</label>
                  <input type="number" name="capacidad_kg" value={formData.capacidad_kg} onChange={handleInputChange} required min="100" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Velocidad Nominal (m/s) *</label>
                  <input type="number" name="velocidad_nominal" value={formData.velocidad_nominal} onChange={handleInputChange} required min="0.1" step="0.1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Piso Mínimo
                  </label>
                  <input
                    type="number"
                    name="piso_minimo"
                    value={formData.piso_minimo !== null ? formData.piso_minimo : ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: -1, 0, 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Piso Máximo
                  </label>
                  <input
                    type="number"
                    name="piso_maximo"
                    value={formData.piso_maximo !== null ? formData.piso_maximo : ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ej: 25, 30, 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Estado *</label>
                  <select name="estado_operativo" value={formData.estado_operativo} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="operativo">Operativo</option>
                    <option value="mantenimiento">En Mantenimiento</option>
                    <option value="falla">Con Falla</option>
                    <option value="desconectado">Desconectado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Año Fabricación</label>
                  <input type="date" name="anio_fabricacion" value={formData.anio_fabricacion} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Fecha Instalación</label>
                  <input type="date" name="fecha_instalacion" value={formData.fecha_instalacion} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Último Mantenimiento</label>
                  <input type="date" name="ultimo_mantenimiento" value={formData.ultimo_mantenimiento} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Próximo Mantenimiento</label>
                  <input type="date" name="proximo_mantenimiento" value={formData.proximo_mantenimiento} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleInputChange} className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
                  <label className="ml-2 text-sm text-text-secondary">Activo</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCancel} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Guardando...' : editingElevador ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Elevadores;
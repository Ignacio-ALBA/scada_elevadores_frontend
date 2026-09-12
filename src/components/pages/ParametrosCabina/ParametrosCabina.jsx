// frontend/src/components/pages/ParametrosCabina/ParametrosCabina.jsx
import React, { useState, useEffect } from 'react';
import { parametroCabinaService } from '../../../services/parametroCabinaService';
import { cabinaService } from '../../../services/cabinaService';
import { elevadorService } from '../../../services/elevadorService';
import { variableScadaService } from '../../../services/variableScadaService';
import { usePermisos } from '../../../context/PermisoContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const ParametrosCabina = () => {
  const [elevadores, setElevadores] = useState([]);
  const [cabinas, setCabinas] = useState([]);
  const [parametros, setParametros] = useState([]);
  const [variablesScada, setVariablesScada] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCabina, setSelectedCabina] = useState(null);
  const [selectedElevador, setSelectedElevador] = useState(null);
  const [selectedColor, setSelectedColor] = useState('bg-indigo-100');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const { puedeCrear, puedeEditar, puedeEliminar } = usePermisos();
  const pageTitle = useNombreInterfaz('parametros_cabina');

  const [formData, setFormData] = useState({
    id_cabina: '',
    nombre: '',
    nombre_corto: '',
    descripcion: '',
    variable_scada_id: '',
    unidad: '',
    factor_escala: 1.0,
    valor_offset: 0.0,
    formato: '0.00',
    alarma_alto_alto: '',
    alarma_alto: '',
    alarma_bajo: '',
    alarma_bajo_bajo: '',
    orden: 0,
    activo: true,
  });

  const COLOR_PALETTE = [
    'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-300', 'bg-indigo-400',
    'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700', 'bg-indigo-800'
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [elevadoresData, cabinasData, parametrosData, variablesData] = await Promise.all([
        elevadorService.getAll({ activo: true }),
        cabinaService.getAll({ activo: true }),
        parametroCabinaService.getAll({ activo: true }),
        variableScadaService.getAll({ activo: true })
      ]);
      setElevadores(elevadoresData);
      setCabinas(cabinasData);
      setParametros(parametrosData);
      setVariablesScada(variablesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos' });
    } finally {
      setLoading(false);
    }
  };

  const getColor = (index) => {
    return COLOR_PALETTE[index % COLOR_PALETTE.length];
  };

  const getCintilloColor = (bgColor) => {
    const colorMap = {
      'bg-indigo-100': 'bg-indigo-300',
      'bg-indigo-200': 'bg-indigo-400',
      'bg-indigo-300': 'bg-indigo-500',
      'bg-indigo-400': 'bg-indigo-600',
      'bg-indigo-500': 'bg-indigo-700',
      'bg-indigo-600': 'bg-indigo-800',
      'bg-indigo-700': 'bg-indigo-900',
      'bg-indigo-800': 'bg-indigo-950',
    };
    return colorMap[bgColor] || 'bg-indigo-500';
  };

  // Filtrar cabinas por elevador seleccionado
  const cabinasPorElevador = (elevadorId) => {
    return cabinas.filter(c => c.id_elevador === elevadorId || c.id_elevador === elevadorId);
  };

  const handleSelectCabina = (cabina, color) => {
    setSelectedCabina(cabina);
    setSelectedColor(color);
    setViewMode('tabs');
  };

  const handleSelectElevador = (elevador) => {
    setSelectedElevador(elevador);
    // Seleccionar la primera cabina de ese elevador automáticamente
    const cabinasDelElevador = cabinas.filter(c => c.id_elevador === elevador.id_elevador || c.id_elevador === elevador.id);
    if (cabinasDelElevador.length > 0) {
      const color = getColor(elevadores.findIndex(e => e.id_elevador === elevador.id_elevador || e.id === elevador.id));
      setSelectedCabina(cabinasDelElevador[0]);
      setSelectedColor(color);
      setViewMode('tabs');
    }
  };

  const handleCreate = () => {
    if (!selectedCabina) {
      setMessage({ type: 'error', text: 'Selecciona una cabina primero' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    setEditingItem(null);
    setFormData({
      id_cabina: selectedCabina.id_cabina || selectedCabina.id,
      nombre: '',
      nombre_corto: '',
      descripcion: '',
      variable_scada_id: '',
      unidad: '',
      factor_escala: 1.0,
      valor_offset: 0.0,
      formato: '0.00',
      alarma_alto_alto: '',
      alarma_alto: '',
      alarma_bajo: '',
      alarma_bajo_bajo: '',
      orden: 0,
      activo: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id_cabina: item.id_cabina || '',
      nombre: item.nombre || '',
      nombre_corto: item.nombre_corto || '',
      descripcion: item.descripcion || '',
      variable_scada_id: item.variable_scada_id || '',
      unidad: item.unidad || '',
      factor_escala: item.factor_escala || 1.0,
      valor_offset: item.valor_offset || 0.0,
      formato: item.formato || '0.00',
      alarma_alto_alto: item.alarma_alto_alto || '',
      alarma_alto: item.alarma_alto || '',
      alarma_bajo: item.alarma_bajo || '',
      alarma_bajo_bajo: item.alarma_bajo_bajo || '',
      orden: item.orden || 0,
      activo: item.activo !== undefined ? item.activo : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar este parámetro?')) return;
    try {
      await parametroCabinaService.delete(id);
      setMessage({ type: 'success', text: 'Parámetro desactivado correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al desactivar el parámetro' });
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
    
    if (!formData.id_cabina || !formData.nombre) {
      setMessage({ type: 'error', text: 'Cabina y nombre son requeridos' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        id_cabina: parseInt(formData.id_cabina),
        variable_scada_id: formData.variable_scada_id ? parseInt(formData.variable_scada_id) : null,
        factor_escala: parseFloat(formData.factor_escala) || 1.0,
        valor_offset: parseFloat(formData.valor_offset) || 0.0,
        orden: parseInt(formData.orden) || 0,
        alarma_alto_alto: formData.alarma_alto_alto ? parseFloat(formData.alarma_alto_alto) : null,
        alarma_alto: formData.alarma_alto ? parseFloat(formData.alarma_alto) : null,
        alarma_bajo: formData.alarma_bajo ? parseFloat(formData.alarma_bajo) : null,
        alarma_bajo_bajo: formData.alarma_bajo_bajo ? parseFloat(formData.alarma_bajo_bajo) : null,
      };

      if (editingItem) {
        await parametroCabinaService.update(editingItem.id_parametro || editingItem.id, dataToSend);
        setMessage({ type: 'success', text: 'Parámetro actualizado correctamente' });
      } else {
        await parametroCabinaService.create(dataToSend);
        setMessage({ type: 'success', text: 'Parámetro creado correctamente' });
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar el parámetro';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const getVariableNombre = (id) => {
    const variable = variablesScada.find(v => (v.id_variable || v.id) === id);
    return variable ? variable.nombre : '-';
  };

  const getCabinaNombre = (id) => {
    const cabina = cabinas.find(c => (c.id_cabina || c.id) === id);
    return cabina ? cabina.nombre : '-';
  };

  // Parámetros filtrados por cabina seleccionada
  const parametrosFiltrados = parametros.filter(
    p => p.id_cabina === selectedCabina?.id_cabina || p.id_cabina === selectedCabina?.id
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {elevadores.map((elevador, elevadorIndex) => {
        const cabinasDelElevador = cabinas.filter(
          c => c.id_elevador === elevador.id_elevador || c.id_elevador === elevador.id
        );
        const color = getColor(elevadorIndex);
        const isSelected = selectedElevador?.id_elevador === elevador.id_elevador || 
                          selectedElevador?.id === elevador.id;

        return (
          <div
            key={elevador.id_elevador || elevador.id}
            className={`${color} rounded-xl shadow-card overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg ${
              isSelected ? 'border-primary-500 ring-2 ring-primary-300' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => handleSelectElevador(elevador)}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-primary-500">{elevador.nombre || elevador.codigo}</h3>
                <span className="text-xs text-text-muted">{elevador.codigo}</span>
              </div>
              <span className="text-xs bg-white/50 px-2 py-1 rounded-full text-text-muted">
                {cabinasDelElevador.length} cabinas
              </span>
            </div>
            <div className="p-3 max-h-60 overflow-y-auto space-y-2">
              {cabinasDelElevador.length === 0 ? (
                <div className="text-sm text-text-muted text-center py-2">
                  Sin cabinas configuradas
                </div>
              ) : (
                cabinasDelElevador.map((cabina, cabinaIndex) => {
                  const paramsCount = parametros.filter(
                    p => p.id_cabina === cabina.id_cabina || p.id_cabina === cabina.id
                  ).length;
                  const isCabinaSelected = selectedCabina?.id_cabina === cabina.id_cabina || 
                                          selectedCabina?.id === cabina.id;
                  
                  return (
                    <div
                      key={cabina.id_cabina || cabina.id}
                      className={`bg-white/60 rounded-lg p-3 border-2 transition-all cursor-pointer ${
                        isCabinaSelected ? 'border-primary-500 bg-primary-50/80' : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCabina(cabina, color);
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-primary-500">{cabina.nombre}</div>
                          <div className="text-xs text-text-muted">{cabina.nombre_corto || 'Sin nombre corto'}</div>
                        </div>
                        <span className="text-xs bg-white/70 px-2 py-1 rounded-full text-text-muted">
                          {paramsCount} parámetros
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDetailView = () => {
    if (!selectedCabina) return null;
    const cintilloColor = getCintilloColor(selectedColor);

    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className={`h-2 w-full ${cintilloColor}`} />
        <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-primary-500">
              {selectedCabina.nombre}
            </h2>
            <span className="text-sm text-text-muted">
              {getCabinaNombre(selectedCabina.id_cabina || selectedCabina.id)} - {selectedCabina.nombre_corto || 'Sin nombre corto'}
            </span>
          </div>
          <button
            onClick={handleCreate}
            className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
            </svg>
            Agregar Parámetro
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Nombre Corto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Variable SCADA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Unidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Estado</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parametrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-text-muted">
                    No hay parámetros configurados para esta cabina
                  </td>
                </tr>
              ) : (
                parametrosFiltrados.map((item) => (
                  <tr key={item.id_parametro || item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{item.nombre}</td>
                    <td className="px-4 py-3 text-sm">{item.nombre_corto || '-'}</td>
                    <td className="px-4 py-3 text-sm">{getVariableNombre(item.variable_scada_id)}</td>
                    <td className="px-4 py-3 text-sm">{item.unidad || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {puedeEditar('parametros_cabina') && (
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}
                        {puedeEliminar('parametros_cabina') && (
                          <button
                            onClick={() => handleDelete(item.id_parametro || item.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded text-sm"
                            title="Desactivar"
                          >
                            🗑️
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
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-text-muted">
          Mostrando {parametrosFiltrados.length} parámetros
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-primary-500">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold text-primary-500">Parámetros de Cabina</h1> */}
          <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
          <p className="text-text-secondary">
            Gestiona los parámetros SCADA de cada cabina
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              viewMode === 'cards' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            📊 Tarjetas
          </button>
          <button
            onClick={() => setViewMode('tabs')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              viewMode === 'tabs' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            📋 Detalle
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? renderCardView() : renderDetailView()}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-500">
                {editingItem ? 'Editar Parámetro' : 'Nuevo Parámetro'}
              </h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cabina - Solo lectura */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Cabina *
                  </label>
                  <div className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-text-muted">
                    {getCabinaNombre(formData.id_cabina) || 'Selecciona una cabina'}
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    La cabina se asigna automáticamente desde la selección
                  </p>
                </div>

                {/* Nombre */}
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

                {/* Nombre Corto */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Nombre Corto
                  </label>
                  <input
                    type="text"
                    name="nombre_corto"
                    value={formData.nombre_corto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Variable SCADA */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Variable SCADA
                  </label>
                  <select
                    name="variable_scada_id"
                    value={formData.variable_scada_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Seleccionar variable</option>
                    {variablesScada.map((v) => (
                      <option key={v.id_variable || v.id} value={v.id_variable || v.id}>
                        {v.nombre} - {v.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unidad */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Unidad
                  </label>
                  <input
                    type="text"
                    name="unidad"
                    value={formData.unidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Factor de Escala */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Factor de Escala
                  </label>
                  <input
                    type="number"
                    name="factor_escala"
                    value={formData.factor_escala}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Offset */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Offset
                  </label>
                  <input
                    type="number"
                    name="valor_offset"
                    value={formData.valor_offset}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Formato */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Formato
                  </label>
                  <input
                    type="text"
                    name="formato"
                    value={formData.formato}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Orden */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    name="orden"
                    value={formData.orden}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Alarmas */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-text-secondary mb-3">Alarmas</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Alarma Alto-Alto</label>
                      <input type="number" name="alarma_alto_alto" value={formData.alarma_alto_alto || ''} onChange={handleInputChange} step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Alarma Alto</label>
                      <input type="number" name="alarma_alto" value={formData.alarma_alto || ''} onChange={handleInputChange} step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Alarma Bajo</label>
                      <input type="number" name="alarma_bajo" value={formData.alarma_bajo || ''} onChange={handleInputChange} step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">Alarma Bajo-Bajo</label>
                      <input type="number" name="alarma_bajo_bajo" value={formData.alarma_bajo_bajo || ''} onChange={handleInputChange} step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                </div>

                {/* Activo */}
                <div className="flex items-center">
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleInputChange} className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
                  <label className="ml-2 text-sm text-text-secondary">Activo</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCancel} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors">
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

export default ParametrosCabina;
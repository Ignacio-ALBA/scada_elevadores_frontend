// frontend/src/components/pages/ParametrosElevador/ParametrosElevador.jsx
import React, { useState, useEffect } from 'react';
import { parametroElevadorService } from '../../../services/parametroElevadorService';
import { elevadorService } from '../../../services/elevadorService';
import { variableScadaService } from '../../../services/variableScadaService';
import { usePermisos } from '../../../context/PermisoContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import { useSafeTheme } from '../../../hooks/useSafeTheme';
import { API_BASE_URL } from '../../../config';

const ParametrosElevador = () => {
  const [elevadores, setElevadores] = useState([]);
  const [parametros, setParametros] = useState([]);
  const [variablesScada, setVariablesScada] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElevador, setSelectedElevador] = useState(null);
  const [selectedColor, setSelectedColor] = useState('bg-gray-100');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const { puedeCrear, puedeEditar, puedeEliminar } = usePermisos();
  const pageTitle = useNombreInterfaz('parametros_elevador');

  const isEditing = editingItem !== null && editingItem !== undefined;

  //  Estado para configuración de colores
  const [colorConfig, setColorConfig] = useState({
    color_inferior: '#94a3b8',      // gray-400
    color_superior: '#475569',      // gray-600
    texto_inferior: '#1e293b',      // slate-800
    texto_superior: '#ffffff',      // white
  });

  //  Obtener el tema para estilos dinámicos
  const { temaActual } = useSafeTheme();
  const isDark = temaActual === 'oscuro';

  //  Cargar configuración de colores desde la base de datos
  useEffect(() => {
    cargarConfiguracionColores();
  }, []);

  const cargarConfiguracionColores = async () => {
    try {
      // const response = await fetch('http://localhost:8000/api/configuraciones/colores-parametros-elevador', {
      const response = await fetch(`${API_BASE_URL}/api/configuraciones/colores-parametros-elevador`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setColorConfig({
            color_inferior: data.color_inferior || '#94a3b8',
            color_superior: data.color_superior || '#475569',
            texto_inferior: data.texto_inferior || '#1e293b',
            texto_superior: data.texto_superior || '#ffffff',
          });
        }
      }
    } catch (error) {
      console.error('Error cargando configuración de colores:', error);
    }
  };

  //  Guardar configuración de colores
  const guardarConfiguracionColores = async () => {
    try {
      // const response = await fetch('http://localhost:8000/api/configuraciones/colores-parametros-elevador', {
      const response = await fetch(`${API_BASE_URL}/api/configuraciones/colores-parametros-elevador`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(colorConfig)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuración de colores guardada correctamente' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error guardando configuración de colores:', error);
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  //  Función para generar color de fondo interpolado
  const getCardColor = (index, total) => {
    const ratio = total > 1 ? index / (total - 1) : 0;
    const colorInferior = colorConfig.color_inferior;
    const colorSuperior = colorConfig.color_superior;
    
    const r1 = parseInt(colorInferior.slice(1,3), 16);
    const g1 = parseInt(colorInferior.slice(3,5), 16);
    const b1 = parseInt(colorInferior.slice(5,7), 16);
    const r2 = parseInt(colorSuperior.slice(1,3), 16);
    const g2 = parseInt(colorSuperior.slice(3,5), 16);
    const b2 = parseInt(colorSuperior.slice(5,7), 16);
    
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  //  Función para generar color de texto interpolado
  const getTextColor = (index, total) => {
    const ratio = total > 1 ? index / (total - 1) : 0;
    const colorInferior = colorConfig.texto_inferior;
    const colorSuperior = colorConfig.texto_superior;
    
    const r1 = parseInt(colorInferior.slice(1,3), 16);
    const g1 = parseInt(colorInferior.slice(3,5), 16);
    const b1 = parseInt(colorInferior.slice(5,7), 16);
    const r2 = parseInt(colorSuperior.slice(1,3), 16);
    const g2 = parseInt(colorSuperior.slice(3,5), 16);
    const b2 = parseInt(colorSuperior.slice(5,7), 16);
    
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const [formData, setFormData] = useState({
    id_elevador: '',
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

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (elevadores.length > 0 && !selectedElevador) {
      setSelectedElevador(elevadores[0]);
      setSelectedColor(getCardColor(0, elevadores.length));
    }
  }, [elevadores]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [elevadoresData, parametrosData, variablesData] = await Promise.all([
        elevadorService.getAll({ activo: true }),
        parametroElevadorService.getAll({ activo: true }),
        variableScadaService.getAll({ activo: true })
      ]);
      setElevadores(elevadoresData);
      setParametros(parametrosData);
      setVariablesScada(variablesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos' });
    } finally {
      setLoading(false);
    }
  };

  const parametrosFiltrados = parametros.filter(
    p => p.id_elevador === selectedElevador?.id_elevador || p.id_elevador === selectedElevador?.id
  );

  const handleSelectElevador = (elevador, color) => {
    setSelectedElevador(elevador);
    setSelectedColor(color);
    setViewMode('tabs');
  };

  const handleCreate = () => {
    if (!selectedElevador) {
      setMessage({ type: 'error', text: 'Selecciona un elevador primero' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    setEditingItem(null);
    setFormData({
      id_elevador: selectedElevador.id_elevador || selectedElevador.id,
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
      id_elevador: item.id_elevador || '',
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
      await parametroElevadorService.delete(id);
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
    
    if (!formData.id_elevador || !formData.nombre) {
      setMessage({ type: 'error', text: 'Elevador y nombre son requeridos' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        id_elevador: parseInt(formData.id_elevador),
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
        await parametroElevadorService.update(editingItem.id_parametro || editingItem.id, dataToSend);
        setMessage({ type: 'success', text: 'Parámetro actualizado correctamente' });
      } else {
        await parametroElevadorService.create(dataToSend);
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

  //  Renderizar tarjetas con colores dinámicos
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {elevadores.map((elevador, index) => {
        const params = parametros.filter(
          p => p.id_elevador === elevador.id_elevador || p.id_elevador === elevador.id
        );
        const isSelected = selectedElevador?.id_elevador === elevador.id_elevador || 
                          selectedElevador?.id === elevador.id;
        const cardBg = getCardColor(index, elevadores.length);
        const textColor = getTextColor(index, elevadores.length);
        
        return (
          <div
            key={elevador.id_elevador || elevador.id}
            className="rounded-xl shadow-card overflow-hidden border-2 transition-all cursor-pointer hover:shadow-lg"
            style={{ backgroundColor: cardBg }}
            onClick={() => handleSelectElevador(elevador, cardBg)}
          >
            <div className={`p-4 border-b ${isDark ? 'border-gray-700/30' : 'border-gray-100'} flex justify-between items-center`}>
              <div>
                <h3 className="font-semibold" style={{ color: textColor }}>{elevador.nombre || elevador.codigo}</h3>
                <span className="text-xs opacity-70" style={{ color: textColor }}>{elevador.codigo}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: textColor + '30', color: textColor }}>
                {params.length} parámetros
              </span>
            </div>
            <div className="p-3 max-h-48 overflow-y-auto">
              {params.length === 0 ? (
                <div className="text-sm text-center py-2" style={{ color: textColor, opacity: 0.6 }}>
                  Sin parámetros configurados
                </div>
              ) : (
                params.slice(0, 5).map((p) => (
                  <div key={p.id_parametro || p.id} className="text-sm py-1 border-b" style={{ borderColor: textColor + '20', color: textColor }}>
                    <span className="truncate">{p.nombre}</span>
                    <span className="text-xs float-right opacity-60">{getVariableNombre(p.variable_scada_id)}</span>
                  </div>
                ))
              )}
              {params.length > 5 && (
                <div className="text-xs text-center mt-1" style={{ color: textColor, opacity: 0.5 }}>
                  +{params.length - 5} más
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDetailView = () => {
    if (!selectedElevador) return null;
    const textColor = getTextColor(0, 1);

    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
        <div className="h-2 w-full" style={{ backgroundColor: selectedColor }} />
        
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center flex-wrap gap-2`}>
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
              {selectedElevador.nombre || selectedElevador.codigo}
            </h2>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>{selectedElevador.codigo}</span>
          </div>
          <button
            onClick={handleCreate}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-1 ${
              isDark 
                ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
            </svg>
            Agregar Parámetro
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Nombre</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Nombre Corto</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Variable SCADA</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Unidad</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Estado</th>
                <th className={`px-4 py-3 text-center text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {parametrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    No hay parámetros configurados para este elevador
                  </td>
                </tr>
              ) : (
                parametrosFiltrados.map((item) => (
                  <tr key={item.id_parametro || item.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{item.nombre}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{item.nombre_corto || '-'}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{getVariableNombre(item.variable_scada_id)}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.unidad || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.activo ? (isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800') : (isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')}`}>
                        {item.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {puedeEditar('parametros_elevador') && (
                          <button
                            onClick={() => handleEdit(item)}
                            className={`p-1 rounded-lg transition-colors ${isDark ? 'text-cyan-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`}
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}
                        {puedeEliminar('parametros_elevador') && (
                          <button
                            onClick={() => handleDelete(item.id_parametro || item.id)}
                            className={`p-1 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}`}
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
        <div className={`px-4 py-2 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
          Mostrando {parametrosFiltrados.length} parámetros
        </div>
      </div>
    );
  };

  //  Renderizar controles de configuración de colores
  const renderColorConfig = () => (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} mb-6`}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Color inferior:
          </label>
          <input
            type="color"
            value={colorConfig.color_inferior}
            onChange={(e) => setColorConfig({ ...colorConfig, color_inferior: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Color superior:
          </label>
          <input
            type="color"
            value={colorConfig.color_superior}
            onChange={(e) => setColorConfig({ ...colorConfig, color_superior: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Texto inferior:
          </label>
          <input
            type="color"
            value={colorConfig.texto_inferior}
            onChange={(e) => setColorConfig({ ...colorConfig, texto_inferior: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Texto superior:
          </label>
          <input
            type="color"
            value={colorConfig.texto_superior}
            onChange={(e) => setColorConfig({ ...colorConfig, texto_superior: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer border border-gray-300"
          />
        </div>
        <button
          onClick={guardarConfiguracionColores}
          className={`px-4 py-2 rounded-lg transition-colors shadow-sm ${
            isDark 
              ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
          }`}
        >
          Guardar Colores
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Vista previa:</span>
          <div 
            className="w-12 h-8 rounded border border-gray-300"
            style={{ 
              background: `linear-gradient(to right, ${colorConfig.color_inferior}, ${colorConfig.color_superior})` 
            }}
          />
          <span 
            className="text-sm font-medium"
            style={{ color: colorConfig.texto_inferior }}
          >
            Aa
          </span>
          <span 
            className="text-sm font-medium"
            style={{ color: colorConfig.texto_superior }}
          >
            Aa
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? (isDark ? 'bg-green-900/30 text-green-300 border border-green-800' : 'bg-green-50 text-green-800 border border-green-200') : (isDark ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-red-50 text-red-800 border border-red-200')}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Gestiona los parámetros SCADA de cada elevador
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors shadow-sm ${
              viewMode === 'cards' 
                ? isDark ? 'bg-cyan-600 text-white' : 'bg-white text-gray-700 border border-gray-300 shadow-md'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📊 Tarjetas
          </button>
          <button
            onClick={() => setViewMode('tabs')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors shadow-sm ${
              viewMode === 'tabs' 
                ? isDark ? 'bg-cyan-600 text-white' : 'bg-white text-gray-700 border border-gray-300 shadow-md'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📋 Detalle
          </button>
        </div>
      </div>

      {renderColorConfig()}

      {viewMode === 'cards' ? renderCardView() : renderDetailView()}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                {editingItem ? 'Editar Parámetro' : 'Nuevo Parámetro'}
              </h2>
              <button onClick={handleCancel} className={isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Elevador *
                  </label>
                  <div 
                    className={`w-full px-4 py-2 rounded-lg border-2 font-medium ${isDark ? 'border-gray-600 bg-gray-700 text-cyan-400' : 'border-gray-300 bg-gray-100 text-primary-500'}`}
                  >
                    {elevadores.find(e => (e.id_elevador || e.id) === formData.id_elevador)?.nombre || 
                    elevadores.find(e => (e.id_elevador || e.id) === formData.id_elevador)?.codigo || 
                    'Selecciona un elevador'}
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>
                    El elevador se asigna automáticamente desde la selección
                  </p>
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
                      isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
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
                      isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
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
                      isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Variable SCADA
                  </label>
                  <select
                    name="variable_scada_id"
                    value={formData.variable_scada_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                    }`}
                  >
                    <option value="">Seleccionar variable</option>
                    {variablesScada.map((v) => (
                      <option key={v.id_variable || v.id} value={v.id_variable || v.id}>
                        {v.nombre} - {v.titulo}
                      </option>
                    ))}
                  </select>
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
                      isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                    }`}
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
                      isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Offset
                  </label>
                  <input
                    type="number"
                    name="valor_offset"
                    value={formData.valor_offset}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                    }`}
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
                      isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                    }`}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Orden
                  </label>
                  <input
                    type="number"
                    name="orden"
                    value={formData.orden}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Alarmas</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Alarma Alto-Alto</label>
                      <input type="number" name="alarma_alto_alto" value={formData.alarma_alto_alto || ''} onChange={handleInputChange} step="0.01" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                      }`} />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Alarma Alto</label>
                      <input type="number" name="alarma_alto" value={formData.alarma_alto || ''} onChange={handleInputChange} step="0.01" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                      }`} />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Alarma Bajo</label>
                      <input type="number" name="alarma_bajo" value={formData.alarma_bajo || ''} onChange={handleInputChange} step="0.01" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                      }`} />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Alarma Bajo-Bajo</label>
                      <input type="number" name="alarma_bajo_bajo" value={formData.alarma_bajo_bajo || ''} onChange={handleInputChange} step="0.01" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                      }`} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleInputChange} className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
                  <label className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Activo</label>
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
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
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

export default ParametrosElevador;
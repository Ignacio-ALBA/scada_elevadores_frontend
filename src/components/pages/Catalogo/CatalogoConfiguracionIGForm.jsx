// frontend/src/components/pages/Catalogo/CatalogoConfiguracionIGForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { configuracionIGService } from '../../../services/configuracionIGService';

const IconPlus = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/>
  </svg>
);

const IconChevronUp = () => (
  <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
    <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/>
  </svg>
);

const IconChevronDown = () => (
  <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
  </svg>
);

const CatalogoConfiguracionIGForm = ({ 
  config, 
  onSave, 
  onCancel, 
  loading, 
  elevadoresDisponibles = [],
  isDark = false 
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    nombre_corto: '',
    descripcion: '',
    zona: '',
    elevadores: [],
    cabinas: {},
    orden: 0,
    activo: true,
  });
  const [loadingElevadores, setLoadingElevadores] = useState(false);
  const [selectedElevadorId, setSelectedElevadorId] = useState('');
  const [expandedElevadores, setExpandedElevadores] = useState({});
  const [errors, setErrors] = useState({});
  const [cabinasCache, setCabinasCache] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const datosCargadosRef = useRef(false);

  useEffect(() => {
    if (!config || datosCargadosRef.current) {
      return;
    }

    console.log('🔍 Cargando datos de configuración para edición...');
    setLoadingData(true);
    
    try {
      let elevadoresProcesados = [];
      let cabinasProcesadas = {};
      
      if (config.elevadores && Array.isArray(config.elevadores)) {
        if (elevadoresDisponibles.length > 0) {
          elevadoresProcesados = config.elevadores.map((id, index) => {
            const elevador = elevadoresDisponibles.find(e => e.id === id);
            return {
              id: id,
              nombre: elevador ? `${elevador.codigo} - ${elevador.nombre}` : `Elevador ${id}`,
              codigo: elevador ? elevador.codigo : '',
              orden: config.elevadores_orden?.[id] || index
            };
          });
        } else {
          elevadoresProcesados = config.elevadores.map((id, index) => ({
            id: id,
            nombre: `Elevador ${id}`,
            codigo: '',
            orden: config.elevadores_orden?.[id] || index
          }));
        }
      }
      
      if (config.cabinas && Array.isArray(config.cabinas)) {
        config.cabinas.forEach((cabina) => {
          const elevadorId = cabina.id_elevador || cabina.elevador_id || cabina.elevadorId;
          if (elevadorId) {
            if (!cabinasProcesadas[elevadorId]) {
              cabinasProcesadas[elevadorId] = [];
            }
            cabinasProcesadas[elevadorId].push({
              id: cabina.id || cabina.id_cabina,
              nombre: cabina.nombre || `Cabina ${cabina.id || cabina.id_cabina}`,
              orden: cabina.orden || 0
            });
          }
        });
      }
      
      Object.keys(cabinasProcesadas).forEach(key => {
        cabinasProcesadas[key].sort((a, b) => (a.orden || 0) - (b.orden || 0));
      });
      
      elevadoresProcesados.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      
      setFormData({
        nombre: config.nombre || '',
        nombre_corto: config.nombre_corto || '',
        descripcion: config.descripcion || '',
        zona: config.zona || '',
        elevadores: elevadoresProcesados,
        cabinas: cabinasProcesadas,
        orden: config.orden || 0,
        activo: config.activo !== undefined ? config.activo : true,
      });
      
      const expandidos = {};
      Object.keys(cabinasProcesadas).forEach(key => {
        if (cabinasProcesadas[key].length > 0) {
          expandidos[parseInt(key)] = true;
        }
      });
      setExpandedElevadores(expandidos);
      
      datosCargadosRef.current = true;
      setLoadingData(false);
      
      console.log('✅ Datos de configuración cargados correctamente');
    } catch (error) {
      console.error('❌ Error procesando datos de configuración:', error);
      setLoadingData(false);
    }
  }, [config, elevadoresDisponibles]);

  useEffect(() => {
    if (!config) {
      datosCargadosRef.current = false;
      setFormData({
        nombre: '',
        nombre_corto: '',
        descripcion: '',
        zona: '',
        elevadores: [],
        cabinas: {},
        orden: 0,
        activo: true,
      });
      setExpandedElevadores({});
      setSelectedElevadorId('');
      setCabinasCache({});
    }
  }, [config]);

  const cargarCabinasPorElevador = async (elevadorId) => {
    if (!elevadorId) return;
    if (cabinasCache[elevadorId]) return;

    try {
      const data = await configuracionIGService.getCabinasPorElevador(elevadorId);
      setCabinasCache(prev => ({
        ...prev,
        [elevadorId]: data
      }));
    } catch (error) {
      console.error('Error cargando cabinas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleAgregarElevador = () => {
    if (!selectedElevadorId) {
      setErrors({ ...errors, elevador: 'Selecciona un elevador' });
      return;
    }

    if (formData.elevadores.some(e => e.id === selectedElevadorId)) {
      setErrors({ ...errors, elevador: 'Este elevador ya está agregado' });
      return;
    }

    const elevador = elevadoresDisponibles.find(e => e.id === selectedElevadorId);
    if (!elevador) return;

    cargarCabinasPorElevador(selectedElevadorId);

    setFormData({
      ...formData,
      elevadores: [
        ...formData.elevadores,
        { id: selectedElevadorId, nombre: elevador.nombre, codigo: elevador.codigo, orden: formData.elevadores.length }
      ],
      cabinas: {
        ...formData.cabinas,
        [selectedElevadorId]: []
      }
    });
    setErrors({ ...errors, elevador: null });
    setSelectedElevadorId('');
  };

  const handleQuitarElevador = (elevadorId) => {
    const nuevasCabinas = { ...formData.cabinas };
    delete nuevasCabinas[elevadorId];
    
    setFormData({
      ...formData,
      elevadores: formData.elevadores.filter(e => e.id !== elevadorId),
      cabinas: nuevasCabinas
    });
  };

  const handleMoverElevador = (index, direccion) => {
    const nuevosElevadores = [...formData.elevadores];
    const nuevoIndex = direccion === 'up' ? index - 1 : index + 1;
    
    if (nuevoIndex < 0 || nuevoIndex >= nuevosElevadores.length) return;
    
    const temp = nuevosElevadores[index];
    nuevosElevadores[index] = nuevosElevadores[nuevoIndex];
    nuevosElevadores[nuevoIndex] = temp;
    
    nuevosElevadores.forEach((e, i) => e.orden = i);
    
    setFormData({
      ...formData,
      elevadores: nuevosElevadores,
    });
  };

  const handleAgregarCabina = (elevadorId, cabinaId) => {
    const cabina = cabinasCache[elevadorId]?.find(c => c.id === cabinaId);
    if (!cabina) return;

    const cabinasActuales = formData.cabinas[elevadorId] || [];
    if (cabinasActuales.some(c => c.id === cabinaId)) {
      setErrors({ ...errors, cabina: 'Esta cabina ya está agregada' });
      return;
    }

    setFormData({
      ...formData,
      cabinas: {
        ...formData.cabinas,
        [elevadorId]: [
          ...cabinasActuales,
          { id: cabinaId, nombre: cabina.nombre, orden: cabinasActuales.length }
        ]
      }
    });
    setErrors({ ...errors, cabina: null });
  };

  const handleQuitarCabina = (elevadorId, cabinaId) => {
    const cabinasActuales = formData.cabinas[elevadorId] || [];
    const nuevasCabinas = cabinasActuales.filter(c => c.id !== cabinaId);
    nuevasCabinas.forEach((c, i) => c.orden = i);
    
    setFormData({
      ...formData,
      cabinas: {
        ...formData.cabinas,
        [elevadorId]: nuevasCabinas
      }
    });
  };

  const handleMoverCabina = (elevadorId, index, direccion) => {
    const cabinasActuales = [...(formData.cabinas[elevadorId] || [])];
    const nuevoIndex = direccion === 'up' ? index - 1 : index + 1;
    
    if (nuevoIndex < 0 || nuevoIndex >= cabinasActuales.length) return;
    
    const temp = cabinasActuales[index];
    cabinasActuales[index] = cabinasActuales[nuevoIndex];
    cabinasActuales[nuevoIndex] = temp;
    
    cabinasActuales.forEach((c, i) => c.orden = i);
    
    setFormData({
      ...formData,
      cabinas: {
        ...formData.cabinas,
        [elevadorId]: cabinasActuales
      }
    });
  };

  const toggleExpandElevador = (elevadorId) => {
    setExpandedElevadores(prev => ({
      ...prev,
      [elevadorId]: !prev[elevadorId]
    }));
    if (!cabinasCache[elevadorId]) {
      cargarCabinasPorElevador(elevadorId);
    }
  };

  const getElevadorNombre = (id) => {
    const elevador = elevadoresDisponibles.find(e => e.id === id);
    return elevador ? `${elevador.codigo} - ${elevador.nombre}` : id;
  };

  const getCabinasDisponibles = (elevadorId) => {
    const cabinas = cabinasCache[elevadorId] || [];
    const cabinasSeleccionadas = formData.cabinas[elevadorId] || [];
    return cabinas.filter(c => !cabinasSeleccionadas.some(sc => sc.id === c.id));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (formData.elevadores.length === 0) newErrors.elevadores = 'Debes seleccionar al menos un elevador';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    datosCargadosRef.current = false;

    const dataToSend = {
      nombre: formData.nombre.trim(),
      nombre_corto: formData.nombre_corto?.trim() || null,
      descripcion: formData.descripcion?.trim() || null,
      zona: formData.zona?.trim() || null,
      elevadores: formData.elevadores.map(e => e.id),
      elevadores_orden: formData.elevadores.reduce((acc, e) => {
        acc[e.id] = e.orden || 0;
        return acc;
      }, {}),
      cabinas: Object.entries(formData.cabinas).flatMap(([elevadorId, cabinas]) =>
        cabinas.map(c => ({
          id: c.id,
          elevador_id: parseInt(elevadorId),
          orden: c.orden || 0
        }))
      ),
      orden: parseInt(formData.orden) || 0,
      activo: formData.activo,
    };

    onSave(dataToSend);
  };

  if (loadingData) {
    return (
      <div className={`p-6 flex justify-center items-center h-64 ${isDark ? 'text-gray-400' : ''}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>Cargando datos de configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Nombre de la Interfaz *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.nombre ? 'border-red-500' : isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
            }`}
            placeholder="Ej: Torre A - Elevadores Principales"
          />
          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Nombre Corto
          </label>
          <input
            type="text"
            name="nombre_corto"
            value={formData.nombre_corto || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
            }`}
            placeholder="Ej: Torre A"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Zona
          </label>
          <input
            type="text"
            name="zona"
            value={formData.zona || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
            }`}
            placeholder="Ej: Zona Norte, Planta Baja"
          />
        </div>

        <div className="md:col-span-2">
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleInputChange}
            rows="2"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
              isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
            }`}
            placeholder="Descripción de la interfaz gráfica"
          />
        </div>

        <div className="flex items-center pt-6">
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

      <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-md font-semibold mb-3 ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
          Elevadores *
        </h3>
        <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
          Agrega elevadores y ordénalos. Cada elevador puede expandirse para gestionar sus cabinas.
        </p>

        {errors.elevadores && (
          <p className="text-red-500 text-sm mb-2">{errors.elevadores}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={selectedElevadorId}
            onChange={(e) => {
              const id = parseInt(e.target.value);
              setSelectedElevadorId(id);
              if (id) cargarCabinasPorElevador(id);
            }}
            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
            }`}
          >
            <option value="">Seleccionar elevador...</option>
            {elevadoresDisponibles
              .filter(e => !formData.elevadores.some(se => se.id === e.id))
              .map(e => (
                <option key={e.id} value={e.id}>
                  {e.codigo} - {e.nombre} {e.edificio ? `(${e.edificio})` : ''}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={handleAgregarElevador}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm ${
              isDark 
                ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                : 'bg-primary-500 text-white hover:bg-primary-700'
            }`}
          >
            <IconPlus />
            Agregar
          </button>
        </div>
        {errors.elevador && (
          <p className="text-red-500 text-sm mt-1">{errors.elevador}</p>
        )}

        {formData.elevadores.length > 0 && (
          <div className="space-y-2">
            {formData.elevadores.map((elevador, index) => (
              <div key={`elevador-${elevador.id}-${index}`} className={`border rounded-lg overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`flex items-center justify-between px-3 py-2 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'} w-6`}>{index + 1}</span>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {getElevadorNombre(elevador.id)}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                      ({formData.cabinas[elevador.id]?.length || 0} cabinas)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoverElevador(index, 'up')}
                      disabled={index === 0}
                      className="p-1 disabled:opacity-30"
                    >
                      <IconChevronUp />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoverElevador(index, 'down')}
                      disabled={index === formData.elevadores.length - 1}
                      className="p-1 disabled:opacity-30"
                    >
                      <IconChevronDown />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpandElevador(elevador.id)}
                      className="p-1 ml-1"
                    >
                      {expandedElevadores[elevador.id] ? (
                        <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"/>
                        </svg>
                      ) : (
                        <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuitarElevador(elevador.id)}
                      className="p-1 ml-1 text-red-500 hover:text-red-700"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>

                {expandedElevadores[elevador.id] && (
                  <div key={`cabinas-${elevador.id}`} className={`px-3 py-3 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                      Cabinas de {getElevadorNombre(elevador.id)}
                    </p>

                    <div className="flex gap-2 mb-3">
                      <select
                        onChange={(e) => {
                          const cabinaId = parseInt(e.target.value);
                          if (cabinaId) handleAgregarCabina(elevador.id, cabinaId);
                          e.target.value = '';
                        }}
                        className={`flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'
                        }`}
                      >
                        <option value="">Agregar cabina...</option>
                        {getCabinasDisponibles(elevador.id).map(c => (
                          <option key={`cabina-opt-${c.id}`} value={c.id}>
                            {c.nombre} {c.nombre_corto ? `(${c.nombre_corto})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(formData.cabinas[elevador.id] || []).length > 0 ? (
                      <div className="space-y-1">
                        {formData.cabinas[elevador.id].map((cabina, cabinaIndex) => (
                          <div key={`cabina-${elevador.id}-${cabina.id}-${cabinaIndex}`} className={`flex items-center justify-between border rounded-lg px-3 py-1.5 ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'} w-6`}>{cabinaIndex + 1}</span>
                              <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{cabina.nombre}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoverCabina(elevador.id, cabinaIndex, 'up')}
                                disabled={cabinaIndex === 0}
                                className="p-1 disabled:opacity-30"
                              >
                                <IconChevronUp />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoverCabina(elevador.id, cabinaIndex, 'down')}
                                disabled={cabinaIndex === (formData.cabinas[elevador.id] || []).length - 1}
                                className="p-1 disabled:opacity-30"
                              >
                                <IconChevronDown />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuitarCabina(elevador.id, cabina.id)}
                                className="p-1 ml-1 text-red-500 hover:text-red-700"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p key={`no-cabinas-${elevador.id}`} className={`text-sm text-center py-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                        No hay cabinas agregadas para este elevador
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          type="button"
          onClick={() => {
            datosCargadosRef.current = false;
            onCancel();
          }}
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
          disabled={loading}
          className={`px-6 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 ${
            isDark 
              ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
              : 'bg-primary-500 text-white hover:bg-primary-700'
          }`}
        >
          {loading ? 'Guardando...' : config ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default CatalogoConfiguracionIGForm;
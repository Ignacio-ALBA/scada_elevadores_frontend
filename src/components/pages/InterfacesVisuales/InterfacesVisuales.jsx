// frontend/src/components/pages/InterfacesVisuales/InterfacesVisuales.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { interfaceVisualService } from '../../../services/interfaceVisualService';
import { variableScadaService } from '../../../services/variableScadaService';
import { emuladorService } from '../../../services/emuladorService';
import { usePermisos } from '../../../context/PermisoContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import { API_BASE_URL } from '../../../config';

// ============================================
// COMPONENTE DraggableCard
// ============================================
const DraggableCard = ({ 
  card, 
  index, 
  onRemove, 
  onUpdate, 
  onCardMove
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    const rect = cardRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const canvasRect = document.getElementById('canvas-area')?.getBoundingClientRect();
    if (canvasRect) {
      const x = e.clientX - canvasRect.left - offset.x;
      const y = e.clientY - canvasRect.top - offset.y;
      if (onCardMove) {
        onCardMove(index, { x, y });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, index, offset]);

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      className="card absolute cursor-move bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 group"
      style={{
        left: card.x || 20,
        top: card.y || 20,
        minWidth: '140px',
        maxWidth: '220px',
        padding: '12px 16px',
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-wider">
          {card.sku || 'SKU'}
        </div>
        <button
          onClick={() => onRemove(index)}
          className="text-gray-500 hover:text-red-400 transition-colors text-xs"
        >
          ✕
        </button>
      </div>

      {/* Valor principal */}
      <div className="text-2xl font-bold text-white font-mono tracking-tight">
        {card.valor !== undefined ? card.valor : '0'}
      </div>

      {/* Nombre */}
      <div className="text-xs text-gray-300 mt-1 truncate font-medium">
        {card.nombre || 'Card'}
      </div>

      {/* Variable SCADA vinculada */}
      {card.variable_scada_id && (
        <div className="text-[10px] text-cyan-400/70 truncate font-mono mt-1">
          🔗 {card.variable_scada_nombre || 'Vinculado'}
        </div>
      )}

      {/* Detalles expandibles al hover */}
      <div className="mt-2 pt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {card.descripcion && (
          <div className="text-[10px] text-gray-400 truncate">{card.descripcion}</div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <button
            className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded hover:bg-cyan-500/30 transition-colors"
            onClick={(e) => { e.stopPropagation(); onUpdate(index); }}
          >
            ⚙️ Vincular variable
          </button>
        </div>
      </div>

      {/* Indicador de arrastre */}
      <div className="absolute bottom-1 right-2 text-[8px] text-gray-600 group-hover:text-gray-400 transition-colors">
        ⋮⋮
      </div>

      {/* Badge de variable vinculada */}
      {card.variable_scada_id && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
      )}
    </div>
  );
};

// ============================================
// COMPONENTE CanvasDropZone
// ============================================
const CanvasDropZone = ({ children, dimensions, onFileDrop }) => {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: onFileDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: true,
  });

  const handleCanvasClick = (e) => {
    if (e.target.closest('.card') || e.target.closest('button')) {
      return;
    }
    open();
  };

  return (
    <div
      id="canvas-area"
      className="relative border-2 border-dashed rounded-xl transition-all duration-300 overflow-hidden"
      style={{
        width: dimensions.x_final || 800,
        height: dimensions.y_final || 600,
        backgroundColor: '#0a0e1a',
        minHeight: '400px',
      }}
      {...getRootProps()}
      onClick={handleCanvasClick}
    >
      <input {...getInputProps()} />
      
      {dimensions.imagen_fondo && (
        <div 
          className="canvas-background absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${dimensions.imagen_fondo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: isDragActive ? 0.5 : 1,
            transition: 'opacity 0.3s',
          }}
        />
      )}
      
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {isDragActive && (
        <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center rounded-xl z-10">
          <div className="text-white text-lg font-medium">Suelta la imagen aquí</div>
        </div>
      )}

      <div className="relative w-full h-full z-20">
        {children}
      </div>

      {!dimensions.imagen_fondo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-sm">Arrastra una imagen o haz clic en el área vacía para subir fondo</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL InterfacesVisuales
// ============================================
const InterfacesVisuales = () => {
  // Estados
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [message, setMessage] = useState(null);
  const { puedeCrear, puedeEditar, puedeEliminar } = usePermisos();
  const [uploading, setUploading] = useState(false);
  const [variablesScada, setVariablesScada] = useState([]);
  const pageTitle = useNombreInterfaz('interfaces_visuales');

  const [formData, setFormData] = useState({
    nombre: '',
    titulo: '',
    subtitulo: '',
    descripcion: '',
    tipo: 'personalizado',
    plc_origen: 'PLC-TorreA-01',
    imagen_fondo: '',
    x_inicial: 0,
    y_inicial: 0,
    x_final: 800,
    y_final: 600,
    cards: [],
    orden: 0,
    activo: true,
  });

  const tiposDisponibles = [
    { value: 'elevador', label: 'Elevador' },
    { value: 'mapa', label: 'Mapa' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'personalizado', label: 'Personalizado' },
  ];

  // En el componente InterfacesVisuales, agregar estado para PLCs
  const [plcs, setPlcs] = useState([]);

  // Cargar PLCs desde el emulador
  const cargarPLCs = async () => {
    try {
      const data = await emuladorService.obtenerPLCs();
      setPlcs(data.plcs || []);
    } catch (error) {
      console.error('Error cargando PLCs:', error);
      // Fallback: PLCs por defecto
      setPlcs([
        { nombre: 'PLC-TorreA-01' },
        { nombre: 'PLC-TorreA-02' },
        { nombre: 'PLC-TorreB-01' },
      ]);
    }
  };

  // Llamar en useEffect
  useEffect(() => {
    cargarDatos();
    cargarVariablesScada();
    cargarPLCs(); // <--- NUEVO
  }, []);

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await interfaceVisualService.getAll({ activo: true });
      setInterfaces(data);
    } catch (error) {
      console.error('Error cargando interfaces:', error);
      setMessage({ type: 'error', text: 'Error al cargar las interfaces' });
    } finally {
      setLoading(false);
    }
  };

  const cargarVariablesScada = async () => {
    try {
      const result = await variableScadaService.getAll({ activo: true });
      setVariablesScada(result.data);
    } catch (error) {
      console.error('Error cargando variables SCADA:', error);
    }
  };

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    cargarDatos();
    cargarVariablesScada();
  }, []);

  // ============================================
  // FUNCIONES DEL CRUD
  // ============================================
  const handleCardMove = (index, position) => {
    setFormData(prev => {
      const newCards = [...prev.cards];
      newCards[index] = {
        ...newCards[index],
        x: Math.max(0, Math.round(position.x)),
        y: Math.max(0, Math.round(position.y)),
      };
      return { ...prev, cards: newCards };
    });
  };

  const handleFileDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setUploading(true);
    
    try {
      const formDataFile = new FormData();
      formDataFile.append('file', file);
      
      // const response = await fetch('http://localhost:8000/api/interfaces-visuales/upload-imagen', {
      const response = await fetch(`${API_BASE_URL}/api/interfaces-visuales/upload-imagen`, {
        method: 'POST',
        body: formDataFile,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      if (response.ok) {
        // setFormData(prev => ({
        //   ...prev,
        //   imagen_fondo: `http://localhost:8000${data.url}`,
        // }));
        setFormData(prev => ({
          ...prev,
          imagen_fondo: `${API_BASE_URL}${data.url}`,
        }));
        setMessage({ type: 'success', text: 'Imagen subida correctamente' });
      } else {
        setMessage({ type: 'error', text: data.detail || 'Error al subir imagen' });
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      setMessage({ type: 'error', text: 'Error al subir imagen' });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      nombre: '',
      titulo: '',
      subtitulo: '',
      descripcion: '',
      tipo: 'personalizado',
      imagen_fondo: '',
      x_inicial: 0,
      y_inicial: 0,
      x_final: 800,
      y_final: 600,
      cards: [],
      orden: 0,
      activo: true,
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre || '',
      titulo: item.titulo || '',
      subtitulo: item.subtitulo || '',
      descripcion: item.descripcion || '',
      tipo: item.tipo || 'personalizado',
      imagen_fondo: item.imagen_fondo || '',
      x_inicial: item.x_inicial || 0,
      y_inicial: item.y_inicial || 0,
      x_final: item.x_final || 800,
      y_final: item.y_final || 600,
      cards: item.cards || [],
      orden: item.orden || 0,
      activo: item.activo !== undefined ? item.activo : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar esta interfaz?')) return;
    try {
      await interfaceVisualService.delete(id);
      setMessage({ type: 'success', text: 'Interfaz desactivada correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al desactivar la interfaz' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handlePreview = (item) => {
    setPreviewItem(item);
    setShowPreview(true);
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
    
    if (!formData.nombre || !formData.titulo || !formData.tipo) {
      setMessage({ type: 'error', text: 'Nombre, título y tipo son requeridos' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      if (editingItem) {
        await interfaceVisualService.update(editingItem.id_interface || editingItem.id, formData);
        setMessage({ type: 'success', text: 'Interfaz actualizada correctamente' });
      } else {
        await interfaceVisualService.create(formData);
        setMessage({ type: 'success', text: 'Interfaz creada correctamente' });
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar la interfaz';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const addCard = () => {
    const newCard = {
      id: Date.now(),
      sku: `CARD-${String(formData.cards.length + 1).padStart(3, '0')}`,
      nombre: 'Nueva Card',
      descripcion: '',
      x: 20 + (formData.cards.length % 5) * 30,
      y: 20 + Math.floor(formData.cards.length / 5) * 40,
      variable_scada_id: null,
      variable_scada_nombre: '',
      ancho: 140,
      alto: 80,
    };
    setFormData({
      ...formData,
      cards: [...formData.cards, newCard],
    });
  };

  const removeCard = (index) => {
    const newCards = formData.cards.filter((_, i) => i !== index);
    setFormData({ ...formData, cards: newCards });
  };

  const updateCard = (index) => {
    const card = formData.cards[index];
    
    const variableOptions = variablesScada
      .filter(v => v.activo !== false)
      .map(v => `${v.id_variable || v.id} - ${v.nombre || v.titulo}`)
      .join('\n');
    
    const variableId = prompt(
      `Ingresa el ID de la variable SCADA a vincular (deja vacío para desvincular):\n\nVariables disponibles:\n${variableOptions}`,
      card.variable_scada_id || ''
    );
    
    if (variableId === null) return;
    
    if (variableId === '') {
      const newCards = [...formData.cards];
      newCards[index] = {
        ...newCards[index],
        variable_scada_id: null,
        variable_scada_nombre: '',
      };
      setFormData({ ...formData, cards: newCards });
      return;
    }
    
    const variable = variablesScada.find(v => 
      (v.id_variable || v.id) === parseInt(variableId)
    );
    
    if (variable) {
      const newCards = [...formData.cards];
      newCards[index] = {
        ...newCards[index],
        variable_scada_id: variable.id_variable || variable.id,
        variable_scada_nombre: variable.nombre || variable.titulo || '',
      };
      setFormData({ ...formData, cards: newCards });
      alert(`✅ Card vinculada a variable: ${variable.nombre}`);
    } else {
      alert('❌ Variable SCADA no encontrada');
    }
  };

  // ============================================
  // RENDER PREVIEW
  // ============================================
  const renderPreview = () => {
    if (!previewItem) return null;
    
    return (
      <div 
        className="relative rounded-xl overflow-hidden shadow-2xl"
        style={{
          width: previewItem.x_final || 800,
          height: previewItem.y_final || 600,
          backgroundImage: previewItem.imagen_fondo ? `url(${previewItem.imagen_fondo})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0a0e1a',
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {(previewItem.cards || []).map((card, index) => (
          <div
            key={index}
            className="absolute bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 group"
            style={{
              left: card.x || 20 + index * 30,
              top: card.y || 20 + index * 20,
              minWidth: '140px',
              maxWidth: '220px',
              padding: '12px 16px',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-xl pointer-events-none" />
            <div className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-wider mb-1">
              {card.sku || 'SKU'}
            </div>
            <div className="text-2xl font-bold text-white font-mono tracking-tight">
              {card.valor !== undefined ? card.valor : '0'}
            </div>
            <div className="text-xs text-gray-300 mt-1 truncate font-medium">
              {card.nombre || 'Card'}
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {card.descripcion && (
                <div className="text-[10px] text-gray-400 truncate">{card.descripcion}</div>
              )}
              {card.variable_scada_id && (
                <div className="text-[10px] text-cyan-400/70 truncate font-mono">
                  🔗 {card.variable_scada_nombre || 'Vinculado'}
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-cyan-500/20">
          <div className="text-sm font-medium">{previewItem.titulo}</div>
          {previewItem.subtitulo && (
            <div className="text-xs text-gray-400">{previewItem.subtitulo}</div>
          )}
        </div>
      </div>
    );
  };

  // ============================================
  // COLUMNAS DE LA TABLA
  // ============================================
  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'titulo', label: 'Título' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'cards', label: 'Cards', render: (item) => item.cards?.length || 0 },
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

  // ============================================
  // RENDER PRINCIPAL
  // ============================================
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
            <span className="text-sm text-text-muted">Total: {interfaces.length} interfaces</span>
            {puedeCrear('interfaces_visuales') && (
              <button
                onClick={handleCreate}
                className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                </svg>
                Nueva Interfaz
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
                <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-text-muted">
                    Cargando...
                  </td>
                </tr>
              ) : interfaces.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-text-muted">
                    No hay interfaces visuales configuradas
                  </td>
                </tr>
              ) : (
                interfaces.map((item) => (
                  <tr key={item.id_interface || item.id} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-sm">
                        {col.render ? col.render(item) : item[col.key] || '-'}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handlePreview(item)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded text-sm"
                          title="Vista previa"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => window.open(`/interfaces/${item.id_interface || item.id}`, '_blank')}
                          className="p-1 text-cyan-600 hover:bg-cyan-50 rounded text-sm"
                          title="Ver en tiempo real"
                        >
                          📊
                        </button>
                        {puedeEditar('interfaces_visuales') && (
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}
                        {puedeEliminar('interfaces_visuales') && (
                          <button
                            onClick={() => handleDelete(item.id_interface || item.id)}
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
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-500">
                {editingItem ? 'Editar Interfaz Visual' : 'Nueva Interfaz Visual'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Nombre * (identificador único)
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="mi_interfaz_principal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Título * (mostrado en interfaz)
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Mi Interfaz Principal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    name="subtitulo"
                    value={formData.subtitulo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {tiposDisponibles.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
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
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    PLC Origen *
                  </label>
                  <select
                    name="plc_origen"
                    value={formData.plc_origen || 'PLC-TorreA-01'}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {plcs.length === 0 ? (
                      <option value="PLC-TorreA-01">PLC-TorreA-01</option>
                    ) : (
                      plcs.map((plc) => (
                        <option key={plc.nombre} value={plc.nombre}>
                          {plc.nombre}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Imagen de Fondo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="imagen_fondo"
                        value={formData.imagen_fondo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="URL de la imagen o sube una"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('file-upload').click()}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                      disabled={uploading}
                    >
                      {uploading ? 'Subiendo...' : '📁 Subir Imagen'}
                    </button>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleFileDrop(e.target.files);
                        }
                      }}
                    />
                  </div>
                  {formData.imagen_fondo && (
                    <div className="mt-2">
                      <img src={formData.imagen_fondo} alt="Fondo" className="h-20 rounded-lg object-cover" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-text-secondary mb-3">
                    Diseño del Canvas - Arrastra las cards para posicionarlas
                  </h4>
                  <CanvasDropZone
                    onFileDrop={handleFileDrop}
                    dimensions={formData}
                  >
                    {formData.cards.map((card, index) => (
                      <DraggableCard
                        key={card.id}
                        card={card}
                        index={index}
                        onRemove={removeCard}
                        onUpdate={() => updateCard(index)}
                        onCardMove={handleCardMove}
                      />
                    ))}
                  </CanvasDropZone>
                  <button
                    type="button"
                    onClick={addCard}
                    className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
                  >
                    + Agregar Card
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vista Previa */}
      {showPreview && previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-primary-500">
                Vista Previa: {previewItem.titulo}
              </h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-4 flex justify-center">
              {renderPreview()}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterfacesVisuales;
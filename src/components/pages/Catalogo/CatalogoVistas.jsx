// frontend/src/components/pages/Catalogo/CatalogoVistas.jsx
import { vistasConfiguracionService } from '../../../services/vistasConfiguracionService';
import { usePermisos } from '../../../context/PermisoContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import { useSafeTheme } from '../../../hooks/useSafeTheme';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const CatalogoVistas = () => {
  const [vistas, setVistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  const { puedeCrear, puedeEditar, puedeEliminar } = usePermisos();
  const pageTitle = useNombreInterfaz('vistas');
  const { temaActual } = useSafeTheme();
  const isDark = temaActual === 'oscuro';
  // Agregar estados para preview de imágenes
  const [previewElevador, setPreviewElevador] = useState(null);
  const [previewCabina, setPreviewCabina] = useState(null);
  const [uploadingElevador, setUploadingElevador] = useState(false);
  const [uploadingCabina, setUploadingCabina] = useState(false);
  const fileInputElevadorRef = useRef(null);
  const fileInputCabinaRef = useRef(null);

  const [formData, setFormData] = useState({
    nombre: '',
    nombre_select: '',
    descripcion: '',
    piso_minimo: 0,
    piso_maximo: 20,
    tamano_icono: 32,
    icono_elevador: '🏢',
    icono_cabina: '🚪',
    color_normal: '#22c55e',
    color_mantenimiento: '#eab308',
    color_falla: '#ef4444',
    color_sismo: '#f97316',
    color_subiendo: '#22d3ee',
    color_bajando: '#f97316',
    color_piso_objetivo: '#8b5cf6',
    color_cabina_cerrada: '#22d3ee',
    color_cabina_abierta: '#4ade80',
    color_cabina_mantenimiento: '#eab308',
    color_cabina_mitad: '#f472b6',
    activo: true,
    orden: 0,

    grosor_riel: 4,
    radio_riel: 8,
    espaciado_riel: 6,
    mostrar_etiquetas: true,
    tamano_icono_carrusel: 64,
    tamano_icono_cabina: 40,
    color_llamada_piso: '#a855f7',
    rectangulo_opacidad: 15,
    rectangulo_borde_tipo: 'solid',
    rectangulo_borde_grosor: 2,
    rectangulo_borde_radio: 8,
  });

  useEffect(() => {
    cargarVistas();
  }, []);

    // Subir imagen para icono de elevador
    const handleUploadElevador = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Solo se permiten imágenes' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'La imagen no debe superar los 2MB' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        setUploadingElevador(true);
        try {
            const response = await vistasConfiguracionService.uploadIcono(file);
            setFormData(prev => ({ ...prev, icono_elevador: response.url }));
            setPreviewElevador(response.url);
            setMessage({ type: 'success', text: 'Imagen subida correctamente' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            setMessage({ type: 'error', text: 'Error al subir la imagen' });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setUploadingElevador(false);
            event.target.value = '';
        }
    };

    // Subir imagen para icono de cabina
    const handleUploadCabina = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Solo se permiten imágenes' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'La imagen no debe superar los 2MB' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        setUploadingCabina(true);
        try {
            const response = await vistasConfiguracionService.uploadIcono(file);
            setFormData(prev => ({ ...prev, icono_cabina: response.url }));
            setPreviewCabina(response.url);
            setMessage({ type: 'success', text: 'Imagen subida correctamente' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            setMessage({ type: 'error', text: 'Error al subir la imagen' });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setUploadingCabina(false);
            event.target.value = '';
        }
    };

    // Resetear a emoji por defecto
    const resetIconoElevador = () => {
        setFormData(prev => ({ ...prev, icono_elevador: '🏢' }));
        setPreviewElevador(null);
    };

    const resetIconoCabina = () => {
        setFormData(prev => ({ ...prev, icono_cabina: '🚪' }));
        setPreviewCabina(null);
    };

  const cargarVistas = async () => {
    setLoading(true);
    try {
      const data = await vistasConfiguracionService.getAll();
      setVistas(data);
    } catch (error) {
      console.error('Error cargando vistas:', error);
      setMessage({ type: 'error', text: 'Error al cargar las vistas' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      nombre: '',
      nombre_select: '',
      descripcion: '',
      piso_minimo: 0,
      piso_maximo: 20,
      tamano_icono: 32,
      icono_elevador: '🏢',
      icono_cabina: '🚪',
      color_normal: '#22c55e',
      color_mantenimiento: '#eab308',
      color_falla: '#ef4444',
      color_sismo: '#f97316',
      color_subiendo: '#22d3ee',
      color_bajando: '#f97316',
      color_piso_objetivo: '#8b5cf6',
      color_cabina_cerrada: '#22d3ee',
      color_cabina_abierta: '#4ade80',
      color_cabina_mantenimiento: '#eab308',
      color_cabina_mitad: '#f472b6',
      activo: true,
      orden: 0,

      grosor_riel: 4,
      radio_riel: 8,
      espaciado_riel: 6,
      mostrar_etiquetas: true,
      tamano_icono_carrusel: 64,
      tamano_icono_cabina: 40,
      color_llamada_piso: '#a855f7',
      rectangulo_opacidad: 15,
      rectangulo_borde_tipo: 'solid',
      rectangulo_borde_grosor: 2,
      rectangulo_borde_radio: 8,
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre || '',
      nombre_select: item.nombre_select || '',
      descripcion: item.descripcion || '',
      piso_minimo: item.piso_minimo || 0,
      piso_maximo: item.piso_maximo || 20,
      tamano_icono: item.tamano_icono || 32,
      icono_elevador: item.icono_elevador || '🏢',
      icono_cabina: item.icono_cabina || '🚪',
      color_normal: item.color_normal || '#22c55e',
      color_mantenimiento: item.color_mantenimiento || '#eab308',
      color_falla: item.color_falla || '#ef4444',
      color_sismo: item.color_sismo || '#f97316',
      color_subiendo: item.color_subiendo || '#22d3ee',
      color_bajando: item.color_bajando || '#f97316',
      color_piso_objetivo: item.color_piso_objetivo || '#8b5cf6',
      color_cabina_cerrada: item.color_cabina_cerrada || '#22d3ee',
      color_cabina_abierta: item.color_cabina_abierta || '#4ade80',
      color_cabina_mantenimiento: item.color_cabina_mantenimiento || '#eab308',
      color_cabina_mitad: item.color_cabina_mitad || '#f472b6',
      activo: item.activo !== undefined ? item.activo : true,
      orden: item.orden || 0,

      grosor_riel: item.grosor_riel ?? 4,
      radio_riel: item.radio_riel ?? 8,
      espaciado_riel: item.espaciado_riel ?? 6,
      mostrar_etiquetas: item.mostrar_etiquetas !== undefined ? item.mostrar_etiquetas : true,
      tamano_icono_carrusel: item.tamano_icono_carrusel ?? 64,
      tamano_icono_cabina: item.tamano_icono_cabina ?? 40,
      color_llamada_piso: item.color_llamada_piso || '#a855f7',
      rectangulo_opacidad: item.rectangulo_opacidad ?? 15,
      rectangulo_borde_tipo: item.rectangulo_borde_tipo || 'solid',
      rectangulo_borde_grosor: item.rectangulo_borde_grosor ?? 2,
      rectangulo_borde_radio: item.rectangulo_borde_radio ?? 8,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar esta vista?')) return;
    try {
      await vistasConfiguracionService.delete(id);
      setMessage({ type: 'success', text: 'Vista desactivada correctamente' });
      cargarVistas();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al desactivar la vista' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await vistasConfiguracionService.update(editingItem.id_vista, formData);
        setMessage({ type: 'success', text: 'Vista actualizada correctamente' });
      } else {
        await vistasConfiguracionService.create(formData);
        setMessage({ type: 'success', text: 'Vista creada correctamente' });
      }
      setShowModal(false);
      setPreviewElevador(null);   
      setPreviewCabina(null);
      cargarVistas();
    } catch (error) {
      console.error('Error guardando:', error);
      setMessage({ type: 'error', text: 'Error al guardar la vista' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleColorChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (editingItem) {
        // Cargar previews si son imágenes
        if (editingItem.icono_elevador?.startsWith('/uploads/') || editingItem.icono_elevador?.startsWith('http')) {
            setPreviewElevador(editingItem.icono_elevador);
        }
        if (editingItem.icono_cabina?.startsWith('/uploads/') || editingItem.icono_cabina?.startsWith('http')) {
            setPreviewCabina(editingItem.icono_cabina);
        }
    }
  }, [editingItem]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Configuración de vistas de interfaz gráfica
          </p>
        </div>
        {puedeCrear('vistas') && (
          <button
            onClick={handleCreate}
            className={`px-4 py-2 rounded-lg transition-colors text-white ${isDark ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-primary-500 hover:bg-primary-700'}`}
          >
            + Nueva Vista
          </button>
        )}
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? (isDark ? 'bg-green-900/30 text-green-300 border border-green-800' : 'bg-green-50 text-green-800 border border-green-200') : (isDark ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-red-50 text-red-800 border border-red-200')}`}>
          {message.text}
        </div>
      )}

      {/* Tabla */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-card overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Nombre</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Select</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Pisos</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Iconos</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Estado</th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {vistas.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    No hay vistas configuradas
                  </td>
                </tr>
              ) : (
                vistas.map((vista) => (
                  <tr key={vista.id_vista} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{vista.nombre}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{vista.nombre_select}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{vista.piso_minimo} → {vista.piso_maximo}</td>
                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {vista.icono_elevador} / {vista.icono_cabina}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${vista.activo ? (isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800') : (isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')}`}>
                        {vista.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {puedeEditar('vistas') && (
                          <button
                            onClick={() => handleEdit(vista)}
                            className={`p-1 rounded-lg transition-colors ${isDark ? 'text-cyan-400 hover:bg-gray-600' : 'text-blue-600 hover:bg-blue-50'}`}
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}
                        {puedeEliminar('vistas') && (
                          <button
                            onClick={() => handleDelete(vista.id_vista)}
                            className={`p-1 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-red-50'}`}
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
          Mostrando {vistas.length} vistas
        </div>
      </div>

      {/* Modal de creación/edición */}
      {showModal && ReactDOM.createPortal(
      <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                if (window.confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
                    setShowModal(false);
                    setPreviewElevador(null);   
                    setPreviewCabina(null);     
                }
                }
            }}
      >
            <div 
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE/Edge */
            }}
            onClick={(e) => e.stopPropagation()}
            >
            {/*  Ocultar scrollbar en Chrome/Safari */}
            <style>{`
                .modal-scroll::-webkit-scrollbar {
                display: none;
                }
            `}</style>
            {/* Header */}
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center sticky top-0 ${isDark ? 'bg-gray-800' : 'bg-white'} z-10 rounded-t-2xl`}>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                {editingItem ? 'Editar Vista' : 'Nueva Vista'}
                </h2>
                <button 
                    onClick={() => {
                        if (window.confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
                        setShowModal(false);
                        setPreviewElevador(null);   
                        setPreviewCabina(null);     
                        }
                    }} 
                    className={isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
                    >
                    ✕
                </button>
            </div>

            {/* Cuerpo del modal */}
            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Datos básicos */}
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Nombre *</label>
                    <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Nombre en Select *</label>
                    <input
                    type="text"
                    name="nombre_select"
                    value={formData.nombre_select}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Descripción</label>
                    <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="2"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                    />
                </div>

                {/* Pisos */}
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Piso Mínimo</label>
                    <input
                    type="number"
                    name="piso_minimo"
                    value={formData.piso_minimo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Piso Máximo</label>
                    <input
                    type="number"
                    name="piso_maximo"
                    value={formData.piso_maximo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                    />
                </div>

                {/* Iconos */}
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Tamaño de Icono</label>
                    <input
                    type="number"
                    name="tamano_icono"
                    value={formData.tamano_icono}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                        Icono Elevador
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            name="icono_elevador"
                            value={formData.icono_elevador}
                            onChange={handleInputChange}
                            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                            placeholder="Emoji o URL de imagen"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputElevadorRef.current?.click()}
                            disabled={uploadingElevador}
                            className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-primary-500 hover:bg-primary-700'} text-white transition-colors disabled:opacity-50`}
                        >
                            {uploadingElevador ? '⏳' : '📷'}
                        </button>
                        <button
                            type="button"
                            onClick={resetIconoElevador}
                            className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                            title="Restaurar emoji por defecto"
                        >
                            🔄
                        </button>
                        <input
                            type="file"
                            ref={fileInputElevadorRef}
                            onChange={handleUploadElevador}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    {previewElevador && (
                        <div className="mt-2 flex items-center gap-2">
                            <img src={previewElevador} alt="Preview elevador" className="w-8 h-8 object-contain border rounded" />
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                                Imagen cargada
                            </span>
                        </div>
                    )}
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                        Icono Cabina
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            name="icono_cabina"
                            value={formData.icono_cabina}
                            onChange={handleInputChange}
                            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                            placeholder="Emoji o URL de imagen"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputCabinaRef.current?.click()}
                            disabled={uploadingCabina}
                            className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-primary-500 hover:bg-primary-700'} text-white transition-colors disabled:opacity-50`}
                        >
                            {uploadingCabina ? '⏳' : '📷'}
                        </button>
                        <button
                            type="button"
                            onClick={resetIconoCabina}
                            className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                            title="Restaurar emoji por defecto"
                        >
                            🔄
                        </button>
                        <input
                            type="file"
                            ref={fileInputCabinaRef}
                            onChange={handleUploadCabina}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    {previewCabina && (
                        <div className="mt-2 flex items-center gap-2">
                            <img src={previewCabina} alt="Preview cabina" className="w-8 h-8 object-contain border rounded" />
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                                Imagen cargada
                            </span>
                        </div>
                    )}
                </div>

                {/*  SECCIÓN: CONFIGURACIÓN DE VISTA MEJORADA */}
                <div className="md:col-span-2">
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-cyan-400' : 'text-primary-500'} flex items-center gap-2`}>
                    ⭐ Configuración Vista Mejorada
                  </h3>
                  
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-200'} space-y-4`}>
                    
                    {/* Sub-sección: Rieles */}
                    <div>
                      <h4 className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>🛤️ Rieles</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Grosor (px)</label>
                          <input
                            type="number"
                            name="grosor_riel"
                            value={formData.grosor_riel}
                            onChange={handleInputChange}
                            min="1"
                            max="20"
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Radio (px)</label>
                          <input
                            type="number"
                            name="radio_riel"
                            value={formData.radio_riel}
                            onChange={handleInputChange}
                            min="0"
                            max="30"
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Espaciado (px)</label>
                          <input
                            type="number"
                            name="espaciado_riel"
                            value={formData.espaciado_riel}
                            onChange={handleInputChange}
                            min="0"
                            max="30"
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sub-sección: Iconos del Carrusel y Cabinas */}
                    <div>
                      <h4 className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>🎨 Tamaños de Iconos</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Icono Carrusel (px)</label>
                          <input
                            type="number"
                            name="tamano_icono_carrusel"
                            value={formData.tamano_icono_carrusel}
                            onChange={handleInputChange}
                            min="20"
                            max="200"
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Icono Cabina Matriz (px)</label>
                          <input
                            type="number"
                            name="tamano_icono_cabina"
                            value={formData.tamano_icono_cabina}
                            onChange={handleInputChange}
                            min="20"
                            max="200"
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sub-sección: Etiquetas y Llamada */}
                    <div>
                      <h4 className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>🏷️ Etiquetas y Llamada</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="mostrar_etiquetas"
                            checked={formData.mostrar_etiquetas}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <label className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Mostrar etiquetas superiores</label>
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Color Llamada a Piso</label>
                          <input
                            type="color"
                            name="color_llamada_piso"
                            value={formData.color_llamada_piso}
                            onChange={(e) => handleColorChange('color_llamada_piso', e.target.value)}
                            className="w-full h-10 rounded cursor-pointer border border-gray-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sub-sección: Rectángulo del Elevador */}
                    <div>
                      <h4 className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>📦 Rectángulo del Elevador</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Opacidad Fondo (%)</label>
                          <input
                            type="number"
                            name="rectangulo_opacidad"
                            value={formData.rectangulo_opacidad}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Tipo Borde</label>
                          <select
                            name="rectangulo_borde_tipo"
                            value={formData.rectangulo_borde_tipo}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                          >
                            <option value="solid">Continuo (solid)</option>
                            <option value="dashed">Punteado (dashed)</option>
                            <option value="dotted">Puntos (dotted)</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Grosor Borde (px)</label>
                          <input
                            type="number"
                            name="rectangulo_borde_grosor"
                            value={formData.rectangulo_borde_grosor}
                            onChange={handleInputChange}
                            min="1"
                            max="10"
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Radio Esquinas (px)</label>
                          <input
                            type="number"
                            name="rectangulo_borde_radio"
                            value={formData.rectangulo_borde_radio}
                            onChange={handleInputChange}
                            min="0"
                            max="30"
                            className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Colores - Estados */}
                <div className="md:col-span-2">
                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Colores por Estado</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Normal</label>
                        <input
                        type="color"
                        value={formData.color_normal}
                        onChange={(e) => handleColorChange('color_normal', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Mantenimiento</label>
                        <input
                        type="color"
                        value={formData.color_mantenimiento}
                        onChange={(e) => handleColorChange('color_mantenimiento', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Falla</label>
                        <input
                        type="color"
                        value={formData.color_falla}
                        onChange={(e) => handleColorChange('color_falla', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Sismo</label>
                        <input
                        type="color"
                        value={formData.color_sismo}
                        onChange={(e) => handleColorChange('color_sismo', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    </div>
                </div>

                {/* Colores - Direcciones */}
                <div className="md:col-span-2">
                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Colores de Dirección</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Subiendo</label>
                        <input
                        type="color"
                        value={formData.color_subiendo}
                        onChange={(e) => handleColorChange('color_subiendo', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Bajando</label>
                        <input
                        type="color"
                        value={formData.color_bajando}
                        onChange={(e) => handleColorChange('color_bajando', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Piso Objetivo</label>
                        <input
                        type="color"
                        value={formData.color_piso_objetivo}
                        onChange={(e) => handleColorChange('color_piso_objetivo', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    </div>
                </div>

                {/* Colores - Cabinas */}
                <div className="md:col-span-2">
                    <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Colores de Cabinas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Cerrada</label>
                        <input
                        type="color"
                        value={formData.color_cabina_cerrada}
                        onChange={(e) => handleColorChange('color_cabina_cerrada', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Abierta</label>
                        <input
                        type="color"
                        value={formData.color_cabina_abierta}
                        onChange={(e) => handleColorChange('color_cabina_abierta', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Mantenimiento</label>
                        <input
                        type="color"
                        value={formData.color_cabina_mantenimiento}
                        onChange={(e) => handleColorChange('color_cabina_mantenimiento', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Mitad</label>
                        <input
                        type="color"
                        value={formData.color_cabina_mitad}
                        onChange={(e) => handleColorChange('color_cabina_mitad', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer border border-gray-300"
                        />
                    </div>
                    </div>
                </div>

                {/* Estado */}
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
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Orden</label>
                    <input
                    type="number"
                    name="orden"
                    value={formData.orden}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-800'}`}
                    />
                </div>
                </div>

                <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                    type="button"
                    onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
                        setShowModal(false);
                        setPreviewElevador(null); 
                        setPreviewCabina(null);
                    }
                    }}
                    className={`px-6 py-2 border rounded-lg transition-colors ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className={`px-6 py-2 rounded-lg transition-colors text-white ${isDark ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-primary-500 hover:bg-primary-700'}`}
                >
                    {editingItem ? 'Actualizar' : 'Crear'}
                </button>
                </div>
            </form>
            </div>
        </div>,
        document.body
        )}
    </div>
  );
};

export default CatalogoVistas;
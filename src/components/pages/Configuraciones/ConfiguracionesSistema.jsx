// frontend/src/components/pages/Configuraciones/ConfiguracionesSistema.jsx
import React, { useState, useEffect } from 'react';
import { configuracionService } from '../../../services/configuracionService';

const ConfiguracionesSistema = () => {
  // Inicializar TODOS los campos con strings vacíos (NO undefined)
  const [formData, setFormData] = useState({
    // Sistema
    nombre_sistema: '',
    nombre_corto_sistema: '',
    nombre_pestana: '',
    logotipo_principal: '',
    logotipo_sidebar: '',
    logotipo_secundario: '',
    logotipo_pestana: '',
    icono_sistema: '',
    version_sistema: '',
    fecha_version: '',
    tiempo_inactividad: '',
    imagen_fondo_login: '',
    
    // TODOS los nombres de interfaz
    nombre_interfaz_dashboard: '',
    nombre_interfaz_monitor: '',
    nombre_interfaz_interfaces_visuales: '',
    nombre_interfaz_visualizacion: '',
    nombre_interfaz_elevadores: '',
    nombre_interfaz_alarmas: '',
    nombre_interfaz_eventos: '',
    nombre_interfaz_mantenimiento: '',
    nombre_interfaz_reportes: '',
    nombre_interfaz_usuarios: '',
    nombre_interfaz_privilegios: '',
    nombre_interfaz_configuraciones: '',
    nombre_interfaz_integraciones: '',
    nombre_interfaz_catalogo: '',
    nombre_interfaz_catalogo_alba: '',
    nombre_interfaz_catalogos: '',
    nombre_interfaz_empresas: '',
    nombre_interfaz_edificios: '',
    nombre_interfaz_cabinas: '',
    nombre_interfaz_controladores: '',
    nombre_interfaz_parametros_elevador: '',
    nombre_interfaz_parametros_cabina: '',
    nombre_interfaz_catalogo_elevadores: '',
    nombre_interfaz_catalogo_controladores: '',
    nombre_interfaz_catalogo_variables_scada: '',
    nombre_interfaz_catalogo_usuarios: '',
    nombre_interfaz_catalogo_roles: '',
    nombre_interfaz_catalogo_permisos: '',
    nombre_interfaz_interfaces_graficas: '',
    nombre_interfaz_elevadores_graficos: '',
    nombre_interfaz_cabinas_graficos: '',
    nombre_interfaz_variables_scada: '',
    nombre_interfaz_configuracion_ig: '',
    nombre_interfaz_vinculacion_parametros: '',
    nombre_interfaz_ms_parametros: '',
    nombre_interfaz_roles: '',
    nombre_interfaz_permisos: '',
    
    nombre_interfaz_reportes_grupo: '',
    nombre_interfaz_reportes_alarmas: '',
    nombre_interfaz_reportes_eventos: '',
    nombre_interfaz_reportes_mantenimiento: '',
    nombre_interfaz_reportes_generales: '',
    nombre_interfaz_reportes_log: '',
    nombre_interfaz_cabinas_catalogo: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    setLoading(true);
    try {
      const data = await configuracionService.getSistema();
      // console.log('🔍 TODOS los datos recibidos de getSistema():', data);
      // console.log('🔍 Keys del objeto data:', Object.keys(data));

      setFormData(prev => ({
        ...prev,
        // Sistema
        nombre_sistema: data.nombre_sistema || '',
        nombre_corto_sistema: data.nombre_corto_sistema || '',
        nombre_pestana: data.nombre_pestana || '',
        logotipo_principal: data.logotipo_principal || '',
        logotipo_sidebar: data.logotipo_sidebar || '',
        logotipo_secundario: data.logotipo_secundario || '',
        logotipo_pestana: data.logotipo_pestana || '',
        icono_sistema: data.icono_sistema || '',
        version_sistema: data.version_sistema || '',
        fecha_version: data.fecha_version || '',
        tiempo_inactividad: data.tiempo_inactividad || '30',
        imagen_fondo_login: data.imagen_fondo_login || '',
        
        // TODOS los nombres de interfaz (con sus valores por defecto)
        nombre_interfaz_dashboard: data.nombre_interfaz_dashboard || 'Dashboard',
        nombre_interfaz_monitor: data.nombre_interfaz_monitor || 'Monitor SCADA',
        nombre_interfaz_interfaces_visuales: data.nombre_interfaz_interfaces_visuales || 'Interfaces Visuales',
        nombre_interfaz_visualizacion: data.nombre_interfaz_visualizacion || 'Visualización',
        nombre_interfaz_elevadores: data.nombre_interfaz_elevadores || 'Elevadores',
        nombre_interfaz_alarmas: data.nombre_interfaz_alarmas || 'Alarmas',
        nombre_interfaz_eventos: data.nombre_interfaz_eventos || 'Eventos',
        nombre_interfaz_mantenimiento: data.nombre_interfaz_mantenimiento || 'Mantenimiento',
        nombre_interfaz_reportes: data.nombre_interfaz_reportes || 'Reportes',
        nombre_interfaz_usuarios: data.nombre_interfaz_usuarios || 'Usuarios',
        nombre_interfaz_privilegios: data.nombre_interfaz_privilegios || 'Privilegios',
        nombre_interfaz_configuraciones: data.nombre_interfaz_configuraciones || 'Configuraciones',
        nombre_interfaz_integraciones: data.nombre_interfaz_integraciones || 'Integraciones',
        nombre_interfaz_catalogo: data.nombre_interfaz_catalogo || 'Catálogo',
        nombre_interfaz_catalogo_alba: data.nombre_interfaz_catalogo_alba || 'Catálogo ALBA',
        nombre_interfaz_catalogos: data.nombre_interfaz_catalogos || 'Catálogos',
        nombre_interfaz_empresas: data.nombre_interfaz_empresas || 'Empresas',
        nombre_interfaz_edificios: data.nombre_interfaz_edificios || 'Edificios',
        nombre_interfaz_cabinas: data.nombre_interfaz_cabinas || 'Cabinas',
        nombre_interfaz_controladores: data.nombre_interfaz_controladores || 'Controladores',
        nombre_interfaz_parametros_elevador: data.nombre_interfaz_parametros_elevador || 'Parámetros IG Elevador',
        nombre_interfaz_parametros_cabina: data.nombre_interfaz_parametros_cabina || 'Parámetros IG Cabina',
        nombre_interfaz_catalogo_elevadores: data.nombre_interfaz_catalogo_elevadores || 'Elevadores',
        nombre_interfaz_catalogo_controladores: data.nombre_interfaz_catalogo_controladores || 'Controladores',
        nombre_interfaz_catalogo_variables_scada: data.nombre_interfaz_catalogo_variables_scada || 'Variables SCADA',
        nombre_interfaz_catalogo_usuarios: data.nombre_interfaz_catalogo_usuarios || 'Usuarios',
        nombre_interfaz_catalogo_roles: data.nombre_interfaz_catalogo_roles || 'Roles',
        nombre_interfaz_catalogo_permisos: data.nombre_interfaz_catalogo_permisos || 'Permisos',
        nombre_interfaz_interfaces_graficas: data.nombre_interfaz_interfaces_graficas || 'Interfaces Gráficas2',
        nombre_interfaz_elevadores_graficos: data.nombre_interfaz_elevadores_graficos || 'Elevadores Gráficos',
        nombre_interfaz_cabinas_graficos: data.nombre_interfaz_cabinas_graficos || 'Cabinas Gráficos',
        nombre_interfaz_variables_scada: data.nombre_interfaz_variables_scada || 'Variables SCADA',
        nombre_interfaz_configuracion_ig: data.nombre_interfaz_configuracion_ig || 'Administración IG',
        nombre_interfaz_vinculacion_parametros: data.nombre_interfaz_vinculacion_parametros || 'Vinculación Parámetros',
        nombre_interfaz_ms_parametros: data.nombre_interfaz_ms_parametros || 'MS Parámetros',
        nombre_interfaz_roles: data.nombre_interfaz_roles || 'Roles',
        nombre_interfaz_permisos: data.nombre_interfaz_permisos || 'Permisos',

        nombre_interfaz_reportes_grupo: data.nombre_interfaz_reportes_grupo || 'Reportes',
        nombre_interfaz_reportes_alarmas: data.nombre_interfaz_reportes_alarmas || 'Alarmas',
        nombre_interfaz_reportes_eventos: data.nombre_interfaz_reportes_eventos || 'Eventos',
        nombre_interfaz_reportes_mantenimiento: data.nombre_interfaz_reportes_mantenimiento || 'Mantenimiento',
        nombre_interfaz_reportes_generales: data.nombre_interfaz_reportes_generales || 'Reportes',
        nombre_interfaz_reportes_log: data.nombre_interfaz_reportes_log || 'Log',
        nombre_interfaz_cabinas_catalogo: data.nombre_interfaz_cabinas_catalogo || 'Cabinas',
        nombre_interfaz_catalogo_cabinas: data.nombre_interfaz_catalogo_cabinas || 'Cabinas',
      }));
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageUpload = async (fieldName, file) => {
    setUploading(true);
    try {
      const formDataFile = new FormData();
      formDataFile.append('file', file);
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5290/api';
      const response = await fetch(`${API_URL}/configuraciones/upload-imagen`, {
        method: 'POST',
        body: formDataFile,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: `${API_URL.replace('/api', '')}${data.url}`,
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

  const renderImageUpload = (fieldName, label, currentValue) => (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-1">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="text"
          name={fieldName}
          value={currentValue || ''}
          onChange={handleChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          placeholder="URL de la imagen o sube una"
        />
        <button
          type="button"
          onClick={() => document.getElementById(`upload-sistema-${fieldName}`).click()}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm whitespace-nowrap"
          disabled={uploading}
        >
          {uploading ? 'Subiendo...' : '📁 Subir'}
        </button>
        <input
          id={`upload-sistema-${fieldName}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files.length > 0) {
              handleImageUpload(fieldName, e.target.files[0]);
            }
          }}
        />
      </div>
      {currentValue && (
        <div className="mt-2">
          <img src={currentValue} alt={label} className="h-12 rounded-lg object-contain border border-gray-200" />
        </div>
      )}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      await configuracionService.updateSistema(formData);
      
      // ✅ Disparar evento para que Sidebar se actualice
      const event = new CustomEvent('nombresInterfazActualizados', {
        detail: { nombres: formData }
      });
      window.dispatchEvent(event);
      
      // ✅ Actualizar título y favicon
      const config = await configuracionService.getSistemaPublic();
      if (config.nombre_pestana) {
        document.title = config.nombre_pestana;
      }
      if (config.logotipo_pestana) {
        const link = document.querySelector("link[rel*='icon']");
        if (link) {
          link.href = config.logotipo_pestana;
        }
      }
      
      setMessage({ type: 'success', text: 'Configuración del sistema guardada correctamente' });
      await cargarConfiguraciones();
      
      // ✅ Recargar la página para que Sidebar tome los nuevos nombres
      window.location.reload();
      
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 flex justify-center">
        <span className="text-primary-500">Cargando configuración...</span>
      </div>
    );
  }

  return (

    <div className="bg-white rounded-xl shadow-card p-6">
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {renderImageUpload('imagen_fondo_login', 'Imagen de Fondo Login', formData.imagen_fondo_login)}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información del Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Nombre del Sistema
            </label>
            <input
              type="text"
              name="nombre_sistema"
              value={formData.nombre_sistema || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Nombre Corto del Sistema
            </label>
            <input
              type="text"
              name="nombre_corto_sistema"
              value={formData.nombre_corto_sistema || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Nombre de Pestaña (Título del navegador)
            </label>
            <input
              type="text"
              name="nombre_pestana"
              value={formData.nombre_pestana || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ej: SmartLift SCADA"
            />
            <p className="text-xs text-text-muted mt-1">
              Este nombre aparecerá en la pestaña del navegador
            </p>
          </div>
        </div>

        {/* Logotipos del Sistema */}
        {renderImageUpload('logotipo_principal', 'Logotipo Principal', formData.logotipo_principal)}
        {renderImageUpload('logotipo_sidebar', 'Logotipo Sidebar', formData.logotipo_sidebar)}
        {renderImageUpload('logotipo_secundario', 'Logotipo Secundario', formData.logotipo_secundario)}
        {renderImageUpload('logotipo_pestana', 'Logotipo Pestaña', formData.logotipo_pestana)}
        {renderImageUpload('icono_sistema', 'Icono', formData.icono_sistema)}

        {/* Versión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Versión del Sistema
            </label>
            <input
              type="text"
              name="version_sistema"
              value={formData.version_sistema || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="v1.0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Fecha de la Versión
            </label>
            <input
              type="date"
              name="fecha_version"
              value={formData.fecha_version || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Tiempo de Inactividad (minutos)
            </label>
            <input
              type="number"
              name="tiempo_inactividad"
              value={formData.tiempo_inactividad || ''}
              onChange={handleChange}
              min="1"
              max="120"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-text-muted mt-1">
              Tiempo de inactividad antes de cerrar sesión automáticamente (1-120 minutos)
            </p>
          </div>
        </div>
        
        {/* Nombres de Interfaces */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-text-secondary mb-3">Nombres de Interfaces</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sistema */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Dashboard</label>
              <input type="text" name="nombre_interfaz_dashboard" value={formData.nombre_interfaz_dashboard || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Monitor SCADA</label>
              <input type="text" name="nombre_interfaz_monitor" value={formData.nombre_interfaz_monitor || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Interfaces Visuales</label>
              <input type="text" name="nombre_interfaz_interfaces_visuales" value={formData.nombre_interfaz_interfaces_visuales || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Visualización</label>
              <input type="text" name="nombre_interfaz_visualizacion" value={formData.nombre_interfaz_visualizacion || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            {/* Módulos principales */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Elevadores</label>
              <input type="text" name="nombre_interfaz_elevadores" value={formData.nombre_interfaz_elevadores || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Alarmas</label>
              <input type="text" name="nombre_interfaz_alarmas" value={formData.nombre_interfaz_alarmas || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Eventos</label>
              <input type="text" name="nombre_interfaz_eventos" value={formData.nombre_interfaz_eventos || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Mantenimiento</label>
              <input type="text" name="nombre_interfaz_mantenimiento" value={formData.nombre_interfaz_mantenimiento || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Reportes</label>
              <input type="text" name="nombre_interfaz_reportes" value={formData.nombre_interfaz_reportes || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Usuarios</label>
              <input type="text" name="nombre_interfaz_usuarios" value={formData.nombre_interfaz_usuarios || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Privilegios</label>
              <input type="text" name="nombre_interfaz_privilegios" value={formData.nombre_interfaz_privilegios || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Configuraciones</label>
              <input type="text" name="nombre_interfaz_configuraciones" value={formData.nombre_interfaz_configuraciones || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Integraciones</label>
              <input type="text" name="nombre_interfaz_integraciones" value={formData.nombre_interfaz_integraciones || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            {/* Catálogos */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogo</label>
              <input type="text" name="nombre_interfaz_catalogo" value={formData.nombre_interfaz_catalogo || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogo ALBA</label>
              <input type="text" name="nombre_interfaz_catalogo_alba" value={formData.nombre_interfaz_catalogo_alba || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogos</label>
              <input type="text" name="nombre_interfaz_catalogos" value={formData.nombre_interfaz_catalogos || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Empresas</label>
              <input type="text" name="nombre_interfaz_empresas" value={formData.nombre_interfaz_empresas || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Edificios</label>
              <input type="text" name="nombre_interfaz_edificios" value={formData.nombre_interfaz_edificios || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogo - Cabinas</label>
              <input type="text" name="nombre_interfaz_catalogo_cabinas" value={formData.nombre_interfaz_catalogo_cabinas || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Controladores</label>
              <input type="text" name="nombre_interfaz_controladores" value={formData.nombre_interfaz_controladores || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            {/* Parámetros */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Parámetros Elevador</label>
              <input type="text" name="nombre_interfaz_parametros_elevador" value={formData.nombre_interfaz_parametros_elevador || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Parámetros Cabina</label>
              <input type="text" name="nombre_interfaz_parametros_cabina" value={formData.nombre_interfaz_parametros_cabina || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            {/* Catálogo - subitems */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogo - Elevadores</label>
              <input type="text" name="nombre_interfaz_catalogo_elevadores" value={formData.nombre_interfaz_catalogo_elevadores || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogo - Controladores</label>
              <input type="text" name="nombre_interfaz_catalogo_controladores" value={formData.nombre_interfaz_catalogo_controladores || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogo - Variables SCADA</label>
              <input type="text" name="nombre_interfaz_catalogo_variables_scada" value={formData.nombre_interfaz_catalogo_variables_scada || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogo - Usuarios</label>
              <input type="text" name="nombre_interfaz_catalogo_usuarios" value={formData.nombre_interfaz_catalogo_usuarios || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogo - Roles</label>
              <input type="text" name="nombre_interfaz_catalogo_roles" value={formData.nombre_interfaz_catalogo_roles || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Catálogo - Permisos</label>
              <input type="text" name="nombre_interfaz_catalogo_permisos" value={formData.nombre_interfaz_catalogo_permisos || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            {/* Reportes - Grupo */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Reportes (Grupo)</label>
              <input type="text" name="nombre_interfaz_reportes_grupo" value={formData.nombre_interfaz_reportes_grupo || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Reportes - Alarmas</label>
              <input type="text" name="nombre_interfaz_reportes_alarmas" value={formData.nombre_interfaz_reportes_alarmas || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Reportes - Eventos</label>
              <input type="text" name="nombre_interfaz_reportes_eventos" value={formData.nombre_interfaz_reportes_eventos || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Reportes - Mantenimiento</label>
              <input type="text" name="nombre_interfaz_reportes_mantenimiento" value={formData.nombre_interfaz_reportes_mantenimiento || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Reportes - Generales</label>
              <input type="text" name="nombre_interfaz_reportes_generales" value={formData.nombre_interfaz_reportes_generales || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Reportes - Log</label>
              <input type="text" name="nombre_interfaz_reportes_log" value={formData.nombre_interfaz_reportes_log || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            {/* Otros */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Interfaces Gráficas</label>
              <input type="text" name="nombre_interfaz_interfaces_graficas" value={formData.nombre_interfaz_interfaces_graficas || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Elevadores Gráficos</label>
              <input type="text" name="nombre_interfaz_elevadores_graficos" value={formData.nombre_interfaz_elevadores_graficos || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Cabinas Gráficos</label>
              <input type="text" name="nombre_interfaz_cabinas_graficos" value={formData.nombre_interfaz_cabinas_graficos || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Variables SCADA</label>
              <input type="text" name="nombre_interfaz_variables_scada" value={formData.nombre_interfaz_variables_scada || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Administración IG</label>
              <input type="text" name="nombre_interfaz_configuracion_ig" value={formData.nombre_interfaz_configuracion_ig || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Vinculación Parámetros</label>
              <input type="text" name="nombre_interfaz_vinculacion_parametros" value={formData.nombre_interfaz_vinculacion_parametros || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">MS Parámetros</label>
              <input type="text" name="nombre_interfaz_ms_parametros" value={formData.nombre_interfaz_ms_parametros || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Roles</label>
              <input type="text" name="nombre_interfaz_roles" value={formData.nombre_interfaz_roles || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Permisos</label>
              <input type="text" name="nombre_interfaz_permisos" value={formData.nombre_interfaz_permisos || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default ConfiguracionesSistema;
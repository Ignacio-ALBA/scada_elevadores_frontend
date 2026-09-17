// frontend/src/components/pages/Configuraciones/ConfiguracionesGenerales.jsx
import React, { useState, useEffect } from 'react';
import { configuracionService } from '../../../services/configuracionService';
import { useSafeTheme } from '../../../hooks/useSafeTheme';
import { API_BASE_URL } from '../../../config';

const ConfiguracionesGenerales = () => {
  const [formData, setFormData] = useState({
    empresa_nombre: '',
    nombre_corto_empresa: '',
    logotipo_principal_empresa: '',
    logotipo_sidebar_empresa: '',
    logotipo_secundario_empresa: '',
    logotipo_pestana_empresa: '',
    icono_empresa: '',
    tema: 'claro',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { temaActual } = useSafeTheme();
  const isDark = temaActual === 'oscuro';

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    setLoading(true);
    try {
      const data = await configuracionService.getGenerales();
      setFormData({
        empresa_nombre: data.empresa_nombre || '',
        nombre_corto_empresa: data.nombre_corto_empresa || '',
        logotipo_principal_empresa: data.logotipo_principal_empresa || '',
        logotipo_sidebar_empresa: data.logotipo_sidebar_empresa || '',
        logotipo_secundario_empresa: data.logotipo_secundario_empresa || '',
        logotipo_pestana_empresa: data.logotipo_pestana_empresa || '',
        icono_empresa: data.icono_empresa || '',
        tema: data.tema || 'claro',
      });
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
      
      // const response = await fetch('http://localhost:8000/api/configuraciones/upload-imagen', {
      const response = await fetch(`${API_BASE_URL}/api/configuraciones/upload-imagen`, {
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
          [fieldName]: `http://localhost:8000${data.url}`,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      await configuracionService.updateGenerales(formData);
      setMessage({ type: 'success', text: 'Configuración guardada correctamente' });
      await cargarConfiguraciones();
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const renderImageUpload = (fieldName, label, currentValue) => (
    <div>
      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
        {label}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="text"
          name={fieldName}
          value={currentValue || ''}
          onChange={handleChange}
          className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
          placeholder="URL de la imagen o sube una"
        />
        <button
          type="button"
          onClick={() => document.getElementById(`upload-${fieldName}`).click()}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm whitespace-nowrap disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? 'Subiendo...' : '📁 Subir'}
        </button>
        <input
          id={`upload-${fieldName}`}
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

  if (loading) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-card p-6 flex justify-center`}>
        <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-6`}>
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Nombre de la Empresa
          </label>
          <input
            type="text"
            name="empresa_nombre"
            value={formData.empresa_nombre || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Nombre Corto de la Empresa
          </label>
          <input
            type="text"
            name="nombre_corto_empresa"
            value={formData.nombre_corto_empresa || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            placeholder="Ej: SmartLift"
          />
        </div>

        {renderImageUpload('logotipo_principal_empresa', 'Logotipo Principal', formData.logotipo_principal_empresa)}
        {renderImageUpload('logotipo_sidebar_empresa', 'Logotipo Sidebar', formData.logotipo_sidebar_empresa)}
        {renderImageUpload('logotipo_secundario_empresa', 'Logotipo Secundario', formData.logotipo_secundario_empresa)}
        {renderImageUpload('logotipo_pestana_empresa', 'Logotipo Pestaña', formData.logotipo_pestana_empresa)}
        {renderImageUpload('icono_empresa', 'Icono', formData.icono_empresa)}

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Tema
          </label>
          <select
            name="tema"
            value={formData.tema || 'claro'}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="claro">Claro</option>
            <option value="oscuro">Oscuro</option>
            <option value="sistema">Sistema (automático)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-sm ${
            isDark 
              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
          }`}
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default ConfiguracionesGenerales;
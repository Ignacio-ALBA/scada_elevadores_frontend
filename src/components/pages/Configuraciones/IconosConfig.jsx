// frontend/src/components/pages/Configuraciones/IconosConfig.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { usePermisos } from '../../../context/PermisoContext';
import { useSafeTheme } from '../../../hooks/useSafeTheme';

//  Lista de emojis disponibles como iconos
const EMOJIS_DISPONIBLES = [
  '📊', '🏢', '🔔', '📋', '🔧', '📄', '👤', '⚙️', '🔗', '📚', 
  '📖', '📡', '🔐', '🎨', '🖥️', '📈', '🚪', '💻', '🔌', '🏠',
  '📉', '📌', '📎', '🔍', '📱', '💾', '🖨️', '📤', '📥', '⭐',
  '🌟', '🔥', '💡', '🔑', '🛠️', '📦', '📫', '📪', '📬', '✏️'
];

//  Lista de módulos del sidebar
const MODULOS_SIDEBAR = [
  { id: 'dashboard', nombre: 'Dashboard', icono_default: '📊' },
  { id: 'interfaces_graficas', nombre: 'Interfaces Gráficas', icono_default: '👁️' },
  { id: 'alarmas', nombre: 'Alarmas', icono_default: '🔔' },
  { id: 'eventos', nombre: 'Eventos', icono_default: '📋' },
  { id: 'mantenimiento', nombre: 'Mantenimiento', icono_default: '🔧' },
  { id: 'reportes_grupo', nombre: 'Reportes', icono_default: '📄' },
  { id: 'catalogos', nombre: 'Catálogos', icono_default: '📚' },
  { id: 'catalogo_alba', nombre: 'Catálogo ALBA', icono_default: '📖' },
  { id: 'estilos', nombre: 'Estilos', icono_default: '🎨' },
  { id: 'empresas', nombre: 'Empresas', icono_default: '🏢' },
  { id: 'edificios', nombre: 'Edificios', icono_default: '🏗️' },
  { id: 'elevadores', nombre: 'Elevadores', icono_default: '🛗' },
  { id: 'cabinas', nombre: 'Cabinas', icono_default: '🚪' },
  { id: 'controladores', nombre: 'Controladores', icono_default: '💻' },
  { id: 'usuarios', nombre: 'Usuarios', icono_default: '👤' },
  { id: 'roles', nombre: 'Roles', icono_default: '👥' },
  { id: 'permisos', nombre: 'Permisos', icono_default: '🔐' },
  { id: 'privilegios', nombre: 'Privilegios', icono_default: '🔑' },
  { id: 'monitor', nombre: 'Monitor SCADA', icono_default: '📡' },
  { id: 'variables_scada', nombre: 'Variables SCADA', icono_default: '📊' },
  { id: 'configuracion_ig', nombre: 'Configuración IG', icono_default: '⚙️' },
  { id: 'vinculacion_parametros', nombre: 'Vinculación Parámetros', icono_default: '🔗' },
  { id: 'ms_parametros', nombre: 'MS Parámetros', icono_default: '📈' },
  { id: 'parametros_elevador', nombre: 'Parámetros Elevador', icono_default: '📐' },
  { id: 'parametros_cabina', nombre: 'Parámetros Cabina', icono_default: '📐' },
  { id: 'interfaces_visuales', nombre: 'Interfaces Visuales', icono_default: '🖥️' },
  { id: 'configuraciones', nombre: 'Configuraciones', icono_default: '⚙️' },
  { id: 'integraciones', nombre: 'Integraciones', icono_default: '🔌' },
  { id: 'elevadores_graficos', nombre: 'Elevadores Gráficos', icono_default: '📊' },
  { id: 'perfil', nombre: 'Perfil', icono_default: '👤' },
  { id: 'notificaciones', nombre: 'Notificaciones', icono_default: '🔔' },
  { id: 'vistas', nombre: 'Vistas', icono_default: '🎨' },
  { id: 'iconos', nombre: 'Íconos', icono_default: '🎨' },
  { id: 'cambiar_contrasena', nombre: 'Cambiar Contraseña', icono_default: '🔑' },
  { id: 'logs', nombre: 'Logs', icono_default: '📋' },
  { id: 'reportes_alarmas', nombre: 'Alarmas', icono_default: '🔔' },    
  { id: 'reportes_eventos', nombre: 'Eventos', icono_default: '📋' },    
  { id: 'reportes_mantenimiento', nombre: 'Mantenimiento', icono_default: '🔧' }, 
  { id: 'reportes_generales', nombre: 'Reportes', icono_default: '📄' }, 
  { id: 'reportes_log', nombre: 'Log', icono_default: '📋' }, 
];

const IconosConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [iconos, setIconos] = useState({});
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedModulo, setSelectedModulo] = useState(null);
  const { puedeVer } = usePermisos();

  //  DETECTAR TEMA
  const { temaActual } = useSafeTheme();
  const isDark = temaActual === 'oscuro';

  //  Verificar permisos
  const hasPermission = puedeVer('iconos');

  useEffect(() => {
    if (hasPermission) {
      cargarIconos();
    } else {
      setLoading(false);
    }
  }, [hasPermission]);

  const cargarIconos = async () => {
    setLoading(true);
    try {
      // const response = await api.get('/configuraciones/iconos');
      const response = await api.get('/configuraciones/iconos-sistema');
      setIconos(response.data || {});
    } catch (error) {
      console.error('Error cargando iconos:', error);
      setMessage({ type: 'error', text: 'Error al cargar los iconos' });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarIcono = async (moduloClave, tipo, valor) => {
    setSaving(true);
    try {
      // await api.post('/configuraciones/iconos', {
      await api.post('/configuraciones/iconos-sistema', {
        modulo_clave: moduloClave,
        tipo: tipo,
        valor: valor
      });
      
      setIconos(prev => ({
        ...prev,
        [moduloClave]: { tipo, valor }
      }));
      
      setMessage({ type: 'success', text: `Icono guardado correctamente` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error guardando icono:', error);
      setMessage({ type: 'error', text: 'Error al guardar el icono' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImage = async (event, moduloClave) => {
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

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // const response = await api.post('/configuraciones/iconos/upload', formData, {
      const response = await api.post('/configuraciones/iconos-sistema/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = response.data.url;
      await handleGuardarIcono(moduloClave, 'imagen', imageUrl);
      
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      setMessage({ type: 'error', text: 'Error al subir la imagen' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const getIconoActual = (moduloClave) => {
    const config = iconos[moduloClave];
    if (config) {
      if (config.tipo === 'imagen') {
        return { tipo: 'imagen', valor: config.valor };
      }
      return { tipo: 'emoji', valor: config.valor || '📄' };
    }
    const predefinido = MODULOS_SIDEBAR.find(i => i.id === moduloClave);
    return { tipo: 'emoji', valor: predefinido?.icono_default || '📄' };
  };

  //  CLASES PARA DARK MODE
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-300' : 'text-text-secondary';
  const textMuted = isDark ? 'text-gray-400' : 'text-text-muted';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const cardHover = isDark ? 'hover:shadow-gray-700/50' : 'hover:shadow-md';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800';
  const inputFocus = 'focus:ring-2 focus:ring-primary-500';
  const messageSuccess = isDark ? 'bg-green-900/30 text-green-300 border border-green-800' : 'bg-green-50 text-green-800 border border-green-200';
  const messageError = isDark ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-red-50 text-red-800 border border-red-200';
  const headerBg = isDark ? 'bg-gray-800' : 'bg-white';
  const footerBg = isDark ? 'bg-gray-700' : 'bg-gray-50';
  const footerBorder = isDark ? 'border-gray-600' : 'border-gray-200';
  const previewBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const previewBorder = isDark ? 'border-gray-600' : 'border-gray-200';
  const buttonDefault = isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  const buttonEmoji = isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  const buttonImage = isDark ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200';
  const buttonReset = isDark ? 'bg-red-900/50 text-red-300 hover:bg-red-800/50' : 'bg-red-100 text-red-700 hover:bg-red-200';

  //  Sin permisos
  if (!hasPermission) {
    return (
      <div className={`p-8 text-center ${bgColor} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'}`}>
        <div className="text-4xl mb-4">🔒</div>
        <h2 className={`text-xl font-semibold ${textSecondary}`}>Acceso restringido</h2>
        <p className={`${textMuted} mt-2`}>No tienes permisos para ver esta sección</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${bgColor} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex justify-between items-center ${headerBg} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-4`}>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
            🎨 Íconos del Sidebar
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Personaliza los iconos de cada menú del sidebar
          </p>
        </div>
        <button
          onClick={cargarIconos}
          className={`px-4 py-2 rounded-lg transition-colors text-sm ${
            isDark 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔄 Recargar
        </button>
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? messageSuccess : messageError}`}>
          {message.text}
        </div>
      )}

      {/* Lista de iconos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULOS_SIDEBAR.map((modulo) => {
          const iconoActual = getIconoActual(modulo.id);
          const isImage = iconoActual.tipo === 'imagen';
          
          return (
            <div 
              key={modulo.id}
              className={`${cardBg} p-4 rounded-xl border ${borderColor} ${cardHover} transition-shadow`}
            >
              <div className="flex items-center gap-3">
                {/* Preview del icono */}
                <div className={`w-12 h-12 rounded-lg ${previewBg} flex items-center justify-center flex-shrink-0 overflow-hidden border ${previewBorder}`}>
                  {isImage ? (
                    <img 
                      src={iconoActual.valor} 
                      alt={modulo.nombre}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-2xl">📄</span>';
                      }}
                    />
                  ) : (
                    <span className="text-2xl">{iconoActual.valor}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium ${textPrimary} truncate`}>
                    {modulo.nombre}
                  </h3>
                  <p className={`text-xs ${textMuted} truncate`}>
                    {isImage ? '🖼️ Imagen personalizada' : `😊 Emoji: ${iconoActual.valor}`}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-3 flex flex-wrap gap-2">
                {/* Selector de emoji */}
                <div className="relative group">
                  <button
                    className={`px-3 py-1 text-xs rounded-lg ${buttonEmoji} transition-colors flex items-center gap-1`}
                    title="Seleccionar emoji"
                  >
                    😊 Emoji
                  </button>
                  <div className={`absolute bottom-full left-0 mb-2 ${bgColor} rounded-lg shadow-xl border ${borderColor} p-2 w-64 max-h-48 overflow-y-auto hidden group-hover:block z-10`}>
                    <div className="grid grid-cols-8 gap-1">
                      {EMOJIS_DISPONIBLES.map((emoji) => (
                        <button
                          key={emoji}
                          className={`w-7 h-7 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex items-center justify-center text-lg transition-colors`}
                          onClick={() => handleGuardarIcono(modulo.id, 'emoji', emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upload de imagen */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadImage(e, modulo.id)}
                    disabled={uploading}
                  />
                  <span className={`px-3 py-1 text-xs rounded-lg ${buttonImage} transition-colors inline-block`}>
                    📷 Imagen
                  </span>
                </label>

                {/* Resetear a emoji por defecto */}
                <button
                  className={`px-3 py-1 text-xs rounded-lg ${buttonReset} transition-colors`}
                  onClick={() => {
                    handleGuardarIcono(modulo.id, 'emoji', modulo.icono_default);
                  }}
                >
                  🔄 Restaurar
                </button>
              </div>

              {/* Preview de imagen subida */}
              {isImage && (
                <div className={`mt-2 p-2 ${previewBg} rounded-lg border ${previewBorder}`}>
                  <div className="flex items-center gap-2">
                    <img 
                      src={iconoActual.valor} 
                      alt={modulo.nombre}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.target.src = '';
                        e.target.parentElement.innerHTML = '<span class="text-xs text-red-500">❌ Error</span>';
                      }}
                    />
                    <span className={`text-[10px] ${textMuted} truncate flex-1`}>
                      {iconoActual.valor.split('/').pop()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={`p-4 ${footerBg} rounded-lg border ${footerBorder}`}>
        <p className={`text-xs ${textMuted}`}>
          💡 Los iconos se guardan por usuario. Puedes usar emojis o subir imágenes (máx 2MB, formato PNG, JPG o SVG).
          <br />
          <span className="opacity-60">Los cambios se aplican automáticamente en el sidebar.</span>
        </p>
      </div>
    </div>
  );
};

export default IconosConfig;
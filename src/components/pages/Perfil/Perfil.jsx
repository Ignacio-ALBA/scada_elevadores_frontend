// frontend/src/components/pages/Perfil/Perfil.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import { useSafeTheme } from '../../../hooks/useSafeTheme';  // ✅ IMPORTAR
import api from '../../../services/api';
import { API_BASE_URL } from '../../../config';

const Perfil = ({ isDark = null }) => {
  const { user, updateUser } = useAuth();
  const pageTitle = useNombreInterfaz('perfil');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    correo: '',
    telefono: '',
    foto_perfil: null,
  });
  const [fotoPreview, setFotoPreview] = useState(null);

  //  USAR EL CONTEXTO DE TEMA
  const { temaActual } = useSafeTheme();
  const isDarkMode = temaActual === 'oscuro';

  //  LOG PARA DEBUG
  useEffect(() => {
    console.log('🔍 [Perfil] temaActual:', temaActual);
    console.log('🔍 [Perfil] isDarkMode:', isDarkMode);
  }, [temaActual]);

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        correo: user.correo || user.email || '',
        telefono: user.telefono || '',
        foto_perfil: user.foto_perfil || null,
      });
      setFotoPreview(user.foto_perfil || null);
    }
  }, [user]);

  // Obtener iniciales
  const getInitials = () => {
    if (!user) return 'U';
    const nombre = user.nombre || '';
    const apellido = user.apellido_paterno || '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  // Obtener nombre de rol
  const getRolNombre = () => {
    if (!user) return '';
    const roles = {
      1: 'SuperAdmin',
      2: 'Admin',
      3: 'Supervisor',
      4: 'Operador',
      5: 'Mantenimiento'
    };
    return roles[user?.rol_id] || user?.rol_nombre || '';
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData({
          ...formData,
          foto_perfil: file,
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const userId = user.id_usuario || user.id;

    if (!userId) {
      setMessage({ type: 'error', text: 'Error: No se encontró el ID del usuario' });
      setLoading(false);
      return;
    }

    try {
      // 1. Actualizar datos de texto (correo, teléfono)
      await api.put(`/usuarios/${userId}`, {
        correo: formData.correo,
        telefono: formData.telefono,
      });

      // 2. Si hay foto, subirla
      if (formData.foto_perfil instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append('foto_perfil', formData.foto_perfil);
        
        await api.put(`/usuarios/${userId}/foto`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // 3. Recargar datos frescos
      await updateUser({});

      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setEditando(false);
      
      // 4. Actualizar preview con la foto nueva
      if (formData.foto_perfil instanceof File) {
        const userResponse = await api.get('/auth/me');
        setFotoPreview(userResponse.data.foto_perfil);
      }
      
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error al actualizar el perfil';
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditando(false);
    setFormData({
      correo: user?.correo || user?.email || '',
      telefono: user?.telefono || '',
      foto_perfil: user?.foto_perfil || null,
    });
    setFotoPreview(user?.foto_perfil || null);
    setMessage(null);
  };
      
  return (
    <div className="space-y-6">
      {/* HEADER - IGUAL QUE Reportes.jsx */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-text-secondary'}>
            Información de tu perfil
          </p>
        </div>
        {!editando && (
          <button
            onClick={() => setEditando(true)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm ${
              isDarkMode 
                ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200 border border-primary-200'
            }`}
          >
            ✏️ Editar perfil
          </button>
        )}
      </div>

      {/* CARD - SIGUIENDO EL PATRÓN DE Reportes.jsx */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDarkMode ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-6`}>

        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Foto de perfil */}
          <div className="flex items-center gap-6 mb-6">
            <div className={`w-24 h-24 rounded-full overflow-hidden border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center flex-shrink-0`}>
              {fotoPreview ? (
                <img 
                  src={fotoPreview.startsWith('http') ? fotoPreview : `${API_BASE_URL}${fotoPreview}`} 
                  alt="Foto" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className={`text-4xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-primary-600'}`}>
                  {getInitials()}
                </span>
              )}
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {user?.nombre} {user?.apellido_paterno} {user?.apellido_materno}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getRolNombre()}
              </p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800'}`}>
                {user?.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          {/* Datos del perfil - SIGUIENDO PATRÓN DE Reportes.jsx */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Usuario - SOLO LECTURA */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                Usuario
              </label>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-cyan-400' : 'text-primary-500'}`}>
                {user?.username || '-'}
              </p>
            </div>

            {/* Correo - EDITABLE */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                Correo *
              </label>
              {editando ? (
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              ) : (
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {user?.correo || user?.email || '-'}
                </p>
              )}
            </div>

            {/* Teléfono - EDITABLE */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                Teléfono
              </label>
              {editando ? (
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="Ej: 55-1234-5678"
                />
              ) : (
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {user?.telefono || '-'}
                </p>
              )}
            </div>

            {/* Foto - EDITABLE */}
            {editando && (
              <div className="col-span-2">
                <label className={`block text-xs font-medium uppercase tracking-wider mb-1 ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                  Cambiar foto de perfil
                </label>
                <input
                  type="file"
                  name="foto_perfil"
                  accept="image/*"
                  onChange={handleChange}
                  className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                />
              </div>
            )}

            {/* Último acceso - SOLO LECTURA */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                Último acceso
              </label>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {user?.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleString('es-MX') : '-'}
              </p>
            </div>

            {/* Fecha registro - SOLO LECTURA */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                Fecha de registro
              </label>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {user?.fecha_registro ? new Date(user.fecha_registro).toLocaleString('es-MX') : '-'}
              </p>
            </div>
          </div>

          {/* Botones de acción cuando está en modo edición */}
          {editando && (
            <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={handleCancel}
                className={`px-6 py-2 border rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Perfil;
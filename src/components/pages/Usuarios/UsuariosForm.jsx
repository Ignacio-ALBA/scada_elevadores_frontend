// frontend/src/components/pages/Usuarios/UsuariosForm.jsx
import React, { useState, useEffect } from 'react';

const UsuarioForm = ({ usuario, onSave, onCancel, loading, rolOptions, isDark = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    telefono: '',
    rol_id: '',
    activo: true,
    password: '',
    foto_perfil: null,
  });

  const [fotoPreview, setFotoPreview] = useState(null);

  useEffect(() => {
    if (usuario) {
      setFormData({
        username: usuario.username || '',
        nombre: usuario.nombre || '',
        apellido_paterno: usuario.apellido_paterno || '',
        apellido_materno: usuario.apellido_materno || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        rol_id: usuario.rol_id || '',
        activo: usuario.activo !== undefined ? usuario.activo : true,
        password: '',
        foto_perfil: usuario.foto_perfil || null,
      });
      setFotoPreview(usuario.foto_perfil || null);
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData({
          ...formData,
          foto_perfil: file,
        });
        // Mostrar preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setFotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Si hay archivo, se subirá como FormData
    if (formData.foto_perfil instanceof File) {
      // Crear FormData para subir archivo
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'foto_perfil') {
          formDataToSend.append('foto_perfil', formData.foto_perfil);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      onSave(formDataToSend);
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/*  CAMPO DE FOTO */}
        <div className="col-span-2">
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Foto de perfil
          </label>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center`}>
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className={`text-2xl ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📷</span>
              )}
            </div>
            <input
              type="file"
              name="foto_perfil"
              accept="image/*"
              onChange={handleChange}
              className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Usuario *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            placeholder="Ej: carlos.admin"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Apellido Paterno *
          </label>
          <input
            type="text"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Apellido Materno *
          </label>
          <input
            type="text"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Correo *
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Teléfono
          </label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
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
            Rol *
          </label>
          <select
            name="rol_id"
            value={formData.rol_id}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            <option value="">Seleccionar rol</option>
            {rolOptions.filter(opt => opt.value !== 'todos').map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Contraseña {usuario ? '(Dejar en blanco para no cambiar)' : '*'}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!usuario}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
          <label className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            Activo
          </label>
        </div>
      </div>

      <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          type="button"
          onClick={onCancel}
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
          className={`px-6 py-2 rounded-lg transition-colors shadow-sm ${
            isDark 
              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
          }`}
        >
          {loading ? 'Guardando...' : 'Guardar Usuario'}
        </button>
      </div>
    </form>
  );
};

export default UsuarioForm;
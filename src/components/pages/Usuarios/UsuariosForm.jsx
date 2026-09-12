import React, { useState, useEffect } from 'react';

const UsuarioForm = ({ usuario, onSave, onCancel, loading, rolOptions }) => {
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
    confirm_password: ''
  });

  const [errors, setErrors] = useState({});

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
        confirm_password: ''
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Limpiar error del campo al modificar
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = 'El usuario es requerido';
    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }
    
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido_paterno) newErrors.apellido_paterno = 'El apellido paterno es requerido';
    
    if (!formData.correo) {
      newErrors.correo = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'Email inválido';
    }
    
    if (!formData.rol_id) newErrors.rol_id = 'El rol es requerido';
    
    // Validar contraseña solo en creación o si se está cambiando
    if (!usuario && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const { confirm_password, ...dataToSave } = formData;
      // Si no hay contraseña (edición sin cambio), no la enviamos
      if (!dataToSave.password) {
        delete dataToSave.password;
      }
      onSave(dataToSave);
    }
  };

  // Filtrar opciones de rol (excluir 'todos')
  const rolOptionsFiltered = rolOptions.filter(opt => opt.value !== 'todos');

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Usuario *
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: juan.perez"
            disabled={!!usuario}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Email *
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.correo ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ejemplo@correo.com"
          />
          {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nombre"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Apellido Paterno *
          </label>
          <input
            type="text"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.apellido_paterno ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Apellido Paterno"
          />
          {errors.apellido_paterno && <p className="text-red-500 text-xs mt-1">{errors.apellido_paterno}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Apellido Materno
          </label>
          <input
            type="text"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Apellido Materno"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Teléfono
          </label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="55-1234-5678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Rol *
          </label>
          <select
            name="rol_id"
            value={formData.rol_id}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.rol_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar rol</option>
            {rolOptionsFiltered.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.rol_id && <p className="text-red-500 text-xs mt-1">{errors.rol_id}</p>}
        </div>

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
          <label className="ml-2 text-sm text-text-secondary">
            Usuario activo
          </label>
        </div>

        <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
          <h4 className="text-sm font-medium text-text-secondary mb-3">
            {usuario ? 'Cambiar contraseña (dejar en blanco para mantener)' : 'Contraseña *'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Contraseña {!usuario && '*'}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={usuario ? 'Nueva contraseña' : 'Contraseña'}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Confirmar Contraseña {!usuario && '*'}
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={usuario ? 'Confirmar nueva contraseña' : 'Confirmar contraseña'}
              />
              {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Guardar Usuario'}
        </button>
      </div>
    </form>
  );
};

export default UsuarioForm;
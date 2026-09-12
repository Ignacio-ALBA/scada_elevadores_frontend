// frontend/src/components/pages/Roles/RolesForm.jsx
import React, { useState, useEffect } from 'react';

const RolesForm = ({ rol, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    nivelJerarquia: 0,
    descripcion: '',
    activo: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (rol) {
      setFormData({
        nombre: rol.nombre || '',
        nivelJerarquia: rol.nivel_jerarquia || 0,
        descripcion: rol.descripcion || '',
        activo: rol.activo !== false
      });
    }
  }, [rol]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no debe exceder 100 caracteres';
    }

    if (formData.nivelJerarquia < 0) {
      newErrors.nivelJerarquia = 'El nivel de jerarquía debe ser positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      nombre: formData.nombre,
      nivelJerarquia: parseInt(formData.nivelJerarquia),
      descripcion: formData.descripcion,
      activo: formData.activo
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Nombre del Rol *
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Supervisor"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.nombre
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500'
          }`}
        />
        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Nivel de Jerarquía
        </label>
        <input
          type="number"
          name="nivelJerarquia"
          value={formData.nivelJerarquia}
          onChange={handleChange}
          placeholder="0"
          min="0"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.nivelJerarquia
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500'
          }`}
        />
        {errors.nivelJerarquia && <p className="text-red-500 text-sm mt-1">{errors.nivelJerarquia}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describa el propósito de este rol..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="activo"
          name="activo"
          checked={formData.activo}
          onChange={handleChange}
          className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="activo" className="ml-2 block text-sm font-medium text-text-primary">
          Rol Activo
        </label>
      </div>

      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default RolesForm;

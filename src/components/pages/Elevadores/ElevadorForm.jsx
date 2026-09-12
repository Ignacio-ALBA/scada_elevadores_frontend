import React, { useState, useEffect } from 'react';

const ElevadorForm = ({ elevador, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    edificio: '',
    tipo: 'Eléctrico',
    capacidad_personas: 8,
    capacidad_kg: 630,
    piso_maximo: null,
    piso_minimo: null,
    estado_operativo: 'operativo',
    modelo: '',
    fabricante: '',
  });

  useEffect(() => {
    if (elevador) {
      setFormData({
        codigo: elevador.codigo || '',
        nombre: elevador.nombre || '',
        edificio: elevador.edificio || '',
        tipo: elevador.tipo || 'Eléctrico',
        capacidad_personas: elevador.capacidad_personas || 8,
        capacidad_kg: elevador.capacidad_kg || 630,
        estado_operativo: elevador.estado_operativo || 'operativo',
        modelo: elevador.modelo || '',
        fabricante: elevador.fabricante || '',
        piso_maximo: elevador.piso_maximo !== undefined ? elevador.piso_maximo : null, 
        piso_minimo: elevador.piso_minimo !== undefined ? elevador.piso_minimo : null, 
      });
    }
  }, [elevador]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'piso_maximo' || name === 'piso_minimo') {
      setFormData({
        ...formData,
        [name]: value === '' ? null : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? (parseInt(value) || 0) : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Código *
          </label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: ELEV-001"
          />
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
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: Elevador Principal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Edificio *
          </label>
          <select
            name="edificio"
            value={formData.edificio}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Seleccionar edificio</option>
            <option value="Torre A">Torre A</option>
            <option value="Torre B">Torre B</option>
            <option value="Torre C">Torre C</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Tipo *
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="Hidráulico">Hidráulico</option>
            <option value="Eléctrico">Eléctrico</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Capacidad (personas) *
          </label>
          <input
            type="number"
            name="capacidad_personas"
            value={formData.capacidad_personas}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Capacidad (kg) *
          </label>
          <input
            type="number"
            name="capacidad_kg"
            value={formData.capacidad_kg}
            onChange={handleChange}
            required
            min="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Piso Mínimo
          </label>
          <input
            type="number"
            name="piso_minimo"
            value={formData.piso_minimo !== null ? formData.piso_minimo : ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: -1, 0, 1"
          />
        </div>

        // Para piso_maximo:
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Piso Máximo
          </label>
          <input
            type="number"
            name="piso_maximo"
            value={formData.piso_maximo !== null ? formData.piso_maximo : ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: 25, 30, 50"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Estado *
          </label>
          <select
            name="estado_operativo"
            value={formData.estado_operativo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="operativo">Operativo</option>
            <option value="mantenimiento">En Mantenimiento</option>
            <option value="falla">Con Falla</option>
            <option value="desconectado">Desconectado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Modelo
          </label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: OTIS-2000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Fabricante
          </label>
          <input
            type="text"
            name="fabricante"
            value={formData.fabricante}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ej: OTIS"
          />
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
          {loading ? 'Guardando...' : 'Guardar Elevador'}
        </button>
      </div>
    </form>
  );
};

export default ElevadorForm;
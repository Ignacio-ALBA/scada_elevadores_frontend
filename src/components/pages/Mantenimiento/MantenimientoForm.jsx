// frontend/src/components/pages/Mantenimiento/MantenimientoForm.jsx
import React, { useState, useEffect } from 'react';
import { elevadorService } from '../../../services/elevadorService';

const MantenimientoForm = ({ mantenimiento, onSave, onCancel, loading }) => {
  const [elevadores, setElevadores] = useState([]);
  const [loadingElevadores, setLoadingElevadores] = useState(true);
  const [formData, setFormData] = useState({
    id_elevador: '',
    tipo: 'preventivo',
    descripcion: '',
    fecha_programada: '',
    estado: 'programado',
    costo: '',
    notas: '',
  });

  useEffect(() => {
    cargarElevadores();
  }, []);

  useEffect(() => {
    if (mantenimiento) {
      setFormData({
        id_elevador: mantenimiento.id_elevador || '',
        tipo: mantenimiento.tipo || 'preventivo',
        descripcion: mantenimiento.descripcion || '',
        fecha_programada: mantenimiento.fecha_programada || '',
        estado: mantenimiento.estado || 'programado',
        costo: mantenimiento.costo || '',
        notas: mantenimiento.notas || '',
      });
    }
  }, [mantenimiento]);

  const cargarElevadores = async () => {
    setLoadingElevadores(true);
    try {
      const data = await elevadorService.getAll({ activo: true });
      setElevadores(data);
    } catch (error) {
      console.error('Error cargando elevadores:', error);
    } finally {
      setLoadingElevadores(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.id_elevador) {
      alert('Debes seleccionar un elevador');
      return;
    }
    if (!formData.descripcion) {
      alert('La descripción es requerida');
      return;
    }
    if (!formData.fecha_programada) {
      alert('La fecha programada es requerida');
      return;
    }

    const dataToSend = {
      ...formData,
      id_elevador: parseInt(formData.id_elevador),
      costo: parseFloat(formData.costo) || 0,
    };

    onSave(dataToSend);
  };

  const tipos = [
    { value: 'preventivo', label: 'Preventivo' },
    { value: 'correctivo', label: 'Correctivo' },
    { value: 'predictivo', label: 'Predictivo' },
    { value: 'urgente', label: 'Urgente' },
  ];

  const estados = [
    { value: 'programado', label: 'Programado' },
    { value: 'en_progreso', label: 'En Progreso' },
    { value: 'realizado', label: 'Realizado' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  if (loadingElevadores) {
    return (
      <div className="p-6 text-center">
        <span className="text-text-muted">Cargando elevadores...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Elevador *
        </label>
        <select
          name="id_elevador"
          value={formData.id_elevador}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Seleccionar elevador</option>
          {elevadores.map((e) => (
            <option key={e.id_elevador || e.id} value={e.id_elevador || e.id}>
              {e.codigo} - {e.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Tipo de Mantenimiento *
        </label>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {tipos.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Descripción *
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Descripción del mantenimiento"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Fecha Programada *
        </label>
        <input
          type="date"
          name="fecha_programada"
          value={formData.fecha_programada}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Estado
        </label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {estados.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Costo
        </label>
        <input
          type="number"
          name="costo"
          value={formData.costo}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          Notas
        </label>
        <textarea
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Notas adicionales"
        />
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
          {loading ? 'Guardando...' : 'Guardar Mantenimiento'}
        </button>
      </div>
    </form>
  );
};

export default MantenimientoForm;
import React, { useState, useEffect } from 'react';
import { configuracionService } from '../../../services/configuracionService';

// Colores por defecto (fallback)
const coloresDefault = [
  { id: 1, nombre: 'OK', color: '#4CAF50', descripcion: 'Funcionamiento normal' },
  { id: 2, nombre: 'Advertencia', color: '#FFC107', descripcion: 'Advertencia - monitorear' },
  { id: 3, nombre: 'Alarma', color: '#F44336', descripcion: 'Alarma - requiere atención inmediata' },
  { id: 4, nombre: 'Mantenimiento', color: '#2196F3', descripcion: 'En mantenimiento' },
  { id: 5, nombre: 'Desconectado', color: '#9E9E9E', descripcion: 'Sin comunicación' },
  { id: 6, nombre: 'Standby', color: '#FF9800', descripcion: 'En espera' },
  { id: 7, nombre: 'Emergencia', color: '#9C27B0', descripcion: 'Modo emergencia' },
  { id: 8, nombre: 'Procesando', color: '#00BCD4', descripcion: 'Actualizando datos' },
];

const ConfiguracionesColores = () => {
  const [colores, setColores] = useState(coloresDefault);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Cargar colores al montar el componente
  useEffect(() => {
    cargarColores();
  }, []);

  const cargarColores = async () => {
    setLoading(true);
    try {
      const data = await configuracionService.getColores();
      if (data && data.length > 0) {
        setColores(data);
      }
    } catch (error) {
      console.error('Error cargando colores:', error);
      // Si hay error, usar colores por defecto
      setColores(coloresDefault);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (id, newColor) => {
    setColores(colores.map(c => c.id === id ? { ...c, color: newColor } : c));
  };

  const handleReset = () => {
    setColores(coloresDefault);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      await configuracionService.updateColores(colores);
      setMessage({ type: 'success', text: 'Colores guardados correctamente' });
      // Recargar para confirmar
      await cargarColores();
    } catch (error) {
      console.error('Error guardando colores:', error);
      setMessage({ type: 'error', text: 'Error al guardar los colores' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 flex justify-center">
        <span className="text-primary-500">Cargando colores...</span>
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

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary-500">Colores por Estado</h3>
        <button
          onClick={handleReset}
          className="text-sm text-text-muted hover:text-primary-500 transition-colors"
        >
          Restablecer valores por defecto
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colores.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
              <div
                className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <label className="block text-sm font-medium text-text-secondary">
                  {item.nombre}
                </label>
                <input
                  type="color"
                  value={item.color}
                  onChange={(e) => handleColorChange(item.id, e.target.value)}
                  className="w-full h-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <input
                type="text"
                value={item.color}
                onChange={(e) => handleColorChange(item.id, e.target.value)}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))}
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

export default ConfiguracionesColores;
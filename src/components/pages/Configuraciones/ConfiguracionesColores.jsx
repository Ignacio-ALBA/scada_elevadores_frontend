// frontend/src/components/pages/Configuraciones/ConfiguracionesColores.jsx
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

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

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
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-card p-6 flex justify-center`}>
        <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando colores...</span>
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

      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
          Colores por Estado
        </h3>
        <button
          onClick={handleReset}
          className={`text-sm ${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-text-muted hover:text-primary-500'} transition-colors`}
        >
          Restablecer valores por defecto
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colores.map((item) => (
            <div key={item.id} className={`flex items-center gap-4 p-3 border rounded-lg ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <div
                className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  {item.nombre}
                </label>
                <input
                  type="color"
                  value={item.color}
                  onChange={(e) => handleColorChange(item.id, e.target.value)}
                  className={`w-full h-8 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              <input
                type="text"
                value={item.color}
                onChange={(e) => handleColorChange(item.id, e.target.value)}
                className={`w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
            </div>
          ))}
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

export default ConfiguracionesColores;
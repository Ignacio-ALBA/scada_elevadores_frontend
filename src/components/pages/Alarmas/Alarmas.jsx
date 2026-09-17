// frontend/src/components/pages/Alarmas/Alarmas.jsx
import React, { useState, useEffect } from 'react';
import { alarmasService } from '../../../services/alarmasService';
import { elevadorService } from '../../../services/elevadorService';
import { tiposAlarmaService } from '../../../services/tiposAlarmaService';
import AlarmasFilters from './AlarmasFilters';
import AlarmasTable from './AlarmasTable';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

// Opciones FUERA del componente
const prioridadOptions = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' }
];

const estadoOptions = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'activa', label: 'Activa' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'resuelta', label: 'Resuelta' }
];

const Alarmas = () => {
  const [alarmas, setAlarmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAlarma, setEditingAlarma] = useState(null);
  const [elevadores, setElevadores] = useState([]);
  const [tiposAlarma, setTiposAlarma] = useState([]);
  const [message, setMessage] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    estado: 'todos',
    prioridad: 'todos'
  });
  const [formData, setFormData] = useState({
    id_elevador: '',
    id_tipo_alarma: '',
    mensaje: '',
    prioridad: 'media',
    notas: ''
  });
  const pageTitle = useNombreInterfaz('alarmas');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const alarmasData = await alarmasService.getAll({ resuelta: false });
      const alarmasList = Array.isArray(alarmasData) ? alarmasData : [];
      
      let filtered = alarmasList;
      
      if (filters.search && filters.search.trim() !== '') {
        const searchLower = filters.search.toLowerCase().trim();
        filtered = filtered.filter(a => 
          (a.mensaje && a.mensaje.toLowerCase().includes(searchLower)) ||
          (a.elevador_nombre && a.elevador_nombre.toLowerCase().includes(searchLower)) ||
          (a.codigo_elevador && a.codigo_elevador.toLowerCase().includes(searchLower))
        );
      }
      
      if (filters.estado && filters.estado !== 'todos') {
        if (filters.estado === 'activa') {
          filtered = filtered.filter(a => !a.confirmada && !a.resuelta);
        } else if (filters.estado === 'confirmada') {
          filtered = filtered.filter(a => a.confirmada && !a.resuelta);
        } else if (filters.estado === 'resuelta') {
          filtered = filtered.filter(a => a.resuelta);
        }
      }
      
      if (filters.prioridad && filters.prioridad !== 'todos') {
        filtered = filtered.filter(a => 
          a.prioridad && a.prioridad.toLowerCase() === filters.prioridad.toLowerCase()
        );
      }
      
      setAlarmas(filtered);
      
      const [elevadoresData, tiposData] = await Promise.all([
        elevadorService.getAll({ activo: true }),
        tiposAlarmaService.getAll()
      ]);
      setElevadores(Array.isArray(elevadoresData) ? elevadoresData : []);
      setTiposAlarma(Array.isArray(tiposData) ? tiposData : []);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      setAlarmas([]);
      setElevadores([]);
      setTiposAlarma([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      estado: 'todos',
      prioridad: 'todos'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAlarma = async (e) => {
    e.preventDefault();
    
    if (!formData.id_elevador) {
      setMessage({ type: 'error', text: 'Selecciona un elevador' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    if (!formData.mensaje) {
      setMessage({ type: 'error', text: 'El mensaje es requerido' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      if (editingAlarma) {
        await alarmasService.update(editingAlarma.id || editingAlarma.id_alarma, formData);
        setMessage({ type: 'success', text: 'Alarma actualizada correctamente' });
      } else {
        await alarmasService.create(formData);
        setMessage({ type: 'success', text: 'Alarma manual creada correctamente' });
      }
      setShowModal(false);
      setEditingAlarma(null);
      setFormData({
        id_elevador: '',
        id_tipo_alarma: '',
        mensaje: '',
        prioridad: 'media',
        notas: ''
      });
      cargarDatos();
    } catch (error) {
      console.error('Error guardando alarma:', error);
      setMessage({ type: 'error', text: editingAlarma ? 'Error al actualizar la alarma' : 'Error al crear la alarma manual' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleConfirmar = async (id) => {
    if (!window.confirm('¿Confirmar esta alarma?')) return;
    try {
      await alarmasService.confirmar(id);
      setMessage({ type: 'success', text: 'Alarma confirmada correctamente' });
      cargarDatos();
    } catch (error) {
      console.error('Error confirmando alarma:', error);
      setMessage({ type: 'error', text: 'Error al confirmar la alarma' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleResolver = async (id) => {
    if (!window.confirm('¿Resolver esta alarma?')) return;
    try {
      await alarmasService.resolver(id);
      setMessage({ type: 'success', text: 'Alarma resuelta correctamente' });
      cargarDatos();
    } catch (error) {
      console.error('Error resolviendo alarma:', error);
      setMessage({ type: 'error', text: 'Error al resolver la alarma' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta alarma? Esta acción no se puede deshacer.')) return;
    try {
      await alarmasService.delete(id);
      setMessage({ type: 'success', text: 'Alarma eliminada correctamente' });
      cargarDatos();
    } catch (error) {
      console.error('Error eliminando alarma:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la alarma' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleEdit = (alarma) => {
    setEditingAlarma(alarma);
    setFormData({
      id_elevador: alarma.id_elevador || '',
      id_tipo_alarma: alarma.id_tipo_alarma || '',
      mensaje: alarma.mensaje || '',
      prioridad: alarma.prioridad || 'media',
      notas: alarma.notas || ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAlarma(null);
    setFormData({
      id_elevador: '',
      id_tipo_alarma: '',
      mensaje: '',
      prioridad: 'media',
      notas: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Gestión de alarmas del sistema
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm ${
            isDark 
              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
          }`}
        >
          <span className="text-lg">+</span> Nueva Alarma Manual
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <AlarmasFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        estadoOptions={estadoOptions}
        prioridadOptions={prioridadOptions}
        isDark={isDark}
      />

      <AlarmasTable
        alarmas={alarmas}
        loading={loading}
        onConfirmar={handleConfirmar}
        onResolver={handleResolver}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isDark={isDark}
      />

      {/* Modal Nueva Alarma Manual / Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
              {editingAlarma ? 'Editar Alarma Manual' : 'Nueva Alarma Manual'}
            </h2>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
              {editingAlarma 
                ? 'Edita los campos de la alarma manual.' 
                : 'Las alarmas manuales son generadas por el usuario para registrar situaciones no automatizadas.'}
            </p>
            <form onSubmit={handleCreateAlarma}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Elevador *
                  </label>
                  <select
                    name="id_elevador"
                    value={formData.id_elevador}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="">Seleccionar elevador</option>
                    {elevadores.map(e => (
                      <option key={e.id_elevador} value={e.id_elevador}>
                        {e.codigo} - {e.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Tipo de Alarma
                  </label>
                  <select
                    name="id_tipo_alarma"
                    value={formData.id_tipo_alarma}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="">Seleccionar tipo (opcional)</option>
                    {tiposAlarma.map(t => (
                      <option key={t.id_tipo} value={t.id_tipo}>
                        {t.nombre} ({t.prioridad})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Prioridad
                  </label>
                  <select
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    {prioridadOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Mensaje *
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="Descripción de la alarma manual"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Notas
                  </label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    rows="2"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="Notas adicionales (opcional)"
                  />
                </div>
              </div>

              <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`px-4 py-2 border rounded-lg transition-colors shadow-sm ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50 bg-white shadow-md'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg transition-colors shadow-sm ${
                    isDark 
                      ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
                  }`}
                >
                  {editingAlarma ? 'Actualizar Alarma' : 'Crear Alarma Manual'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alarmas;
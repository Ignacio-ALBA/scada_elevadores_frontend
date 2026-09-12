import React, { useState, useEffect } from 'react';
import IntegracionCard from './IntegracionCard';
import IntegracionForm from './IntegracionForm';
import { integracionService } from '../../../services/integracionService';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const tiposIntegracion = [
  { value: 'modbus', label: 'Modbus TCP', icon: '🔌' },
  { value: 'mqtt', label: 'MQTT', icon: '📡' },
  { value: 'rest', label: 'REST API', icon: '🌐' },
  { value: 'websocket', label: 'WebSocket', icon: '🔗' },
  { value: 'smtp', label: 'SMTP (Correo)', icon: '✉️' },
];

const Integraciones = () => {
  const [integraciones, setIntegraciones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIntegracion, setEditingIntegracion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const pageTitle = useNombreInterfaz('integraciones');

  // Cargar integraciones al montar el componente
  useEffect(() => {
    cargarIntegraciones();
  }, []);

  const cargarIntegraciones = async () => {
    setLoading(true);
    try {
      const data = await integracionService.getAll();
      setIntegraciones(data);
    } catch (error) {
      console.error('Error cargando integraciones:', error);
      setMessage({ type: 'error', text: 'Error al cargar las integraciones' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingIntegracion(null);
    setShowForm(true);
  };

  const handleEdit = (integracion) => {
    setEditingIntegracion(integracion);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta integración?')) {
      try {
        await integracionService.delete(id);
        await cargarIntegraciones();
        setMessage({ type: 'success', text: 'Integración eliminada correctamente' });
      } catch (error) {
        console.error('Error eliminando integración:', error);
        setMessage({ type: 'error', text: 'Error al eliminar la integración' });
      }
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleToggle = async (id) => {
    try {
      await integracionService.toggle(id);
      await cargarIntegraciones();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setMessage({ type: 'error', text: 'Error al cambiar el estado' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editingIntegracion) {
        await integracionService.update(editingIntegracion.id, data);
        setMessage({ type: 'success', text: 'Integración actualizada correctamente' });
      } else {
        await integracionService.create(data);
        setMessage({ type: 'success', text: 'Integración creada correctamente' });
      }
      await cargarIntegraciones();
      setShowForm(false);
      setEditingIntegracion(null);
    } catch (error) {
      console.error('Error guardando integración:', error);
      setMessage({ type: 'error', text: 'Error al guardar la integración' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIntegracion(null);
  };

  // Contar integraciones activas
  const activas = integraciones.filter(i => i.activa).length;
  const total = integraciones.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-primary-500">Cargando integraciones...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold text-primary-500">Integraciones</h1> */}
          <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
          <p className="text-text-secondary">
            Gestiona las integraciones con sistemas externos
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          Nueva Integración
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-card border-l-4 border-primary-500">
          <div className="text-text-secondary text-sm">Total Integraciones</div>
          <div className="text-2xl font-bold text-primary-500">{total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-card border-l-4 border-green-500">
          <div className="text-text-secondary text-sm">Activas</div>
          <div className="text-2xl font-bold text-green-600">{activas}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-card border-l-4 border-orange-500">
          <div className="text-text-secondary text-sm">Inactivas</div>
          <div className="text-2xl font-bold text-orange-600">{total - activas}</div>
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Lista de integraciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integraciones.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-text-muted bg-white rounded-xl shadow-card">
            No hay integraciones configuradas
          </div>
        ) : (
          integraciones.map((integracion) => (
            <IntegracionCard
              key={integracion.id}
              integracion={integracion}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              tipos={tiposIntegracion}
            />
          ))
        )}
      </div>

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-500">
                {editingIntegracion ? 'Editar Integración' : 'Nueva Integración'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <IntegracionForm
              integracion={editingIntegracion}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={saving}
              tipos={tiposIntegracion}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Integraciones;
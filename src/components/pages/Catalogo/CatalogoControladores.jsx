import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const CatalogoControladores = ({ canEdit }) => {
  const [data, setData] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [estadoTarget, setEstadoTarget] = useState(null);
  const [estadoAccion, setEstadoAccion] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    direccion_ip: '',
    puerto: 502,
    protocolo: 'modbus_tcp',
    firmware: '',
    serie: '',
    id_edificio: null,
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    cargarDatos();
    cargarEdificios();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/controladores/');
      setData(response.data);
    } catch (error) {
      console.error('Error cargando controladores:', error);
      setMessage({ type: 'error', text: 'Error al cargar los controladores' });
    } finally {
      setLoading(false);
    }
  };

  const cargarEdificios = async () => {
    try {
      const response = await api.get('/edificios/');
      setEdificios(response.data);
    } catch (error) {
      console.error('Error cargando edificios:', error);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      nombre: '',
      marca: '',
      modelo: '',
      direccion_ip: '',
      puerto: 502,
      protocolo: 'modbus_tcp',
      firmware: '',
      serie: '',
      id_edificio: null,
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    if (item.estado === 'eliminado') {
      setMessage({ type: 'error', text: 'No se puede editar un controlador eliminado' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    setEditingItem(item);
    setFormData({
      nombre: item.nombre || '',
      marca: item.marca || '',
      modelo: item.modelo || '',
      direccion_ip: item.direccion_ip || '',
      puerto: item.puerto || 502,
      protocolo: item.protocolo || 'modbus_tcp',
      firmware: item.firmware || '',
      serie: item.serie || '',
      id_edificio: item.id_edificio || null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este controlador? (No se podrá recuperar)')) return;
    try {
      await api.delete(`/controladores/${id}`);
      setMessage({ type: 'success', text: 'Controlador eliminado correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el controlador' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const openEstadoModal = (item, accion) => {
    if (item.estado === 'eliminado') {
      setMessage({ type: 'error', text: 'No se puede cambiar el estado de un controlador eliminado' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    
    const id = item.id_controlador || item.id;
    if (!id) {
      setMessage({ type: 'error', text: 'Error: ID del controlador no encontrado' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    
    setEstadoTarget({ ...item, id: id });
    setEstadoAccion(accion);
    setShowEstadoModal(true);
  };

  const handleCambiarEstado = async () => {
    const id = estadoTarget?.id || estadoTarget?.id_controlador;
    if (!id) {
      setMessage({ type: 'error', text: 'Error: ID del controlador no encontrado' });
      setShowEstadoModal(false);
      setEstadoTarget(null);
      setEstadoAccion('');
      setTimeout(() => setMessage(null), 5000);
      return;
    }
    
    try {
      await api.patch(`/controladores/${id}/estado`, { estado: estadoAccion });
      setMessage({ type: 'success', text: `Controlador cambiado a '${estadoAccion}'` });
      await cargarDatos();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      const errorMsg = error.response?.data?.detail || 'Error al cambiar estado';
      if (typeof errorMsg === 'string') {
        setMessage({ type: 'error', text: errorMsg });
      } else {
        setMessage({ type: 'error', text: 'Error al cambiar el estado del controlador' });
      }
    } finally {
      setShowEstadoModal(false);
      setEstadoTarget(null);
      setEstadoAccion('');
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_edificio) {
      setMessage({ type: 'error', text: 'Debes seleccionar un edificio' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    try {
      if (editingItem) {
        await api.put(`/controladores/${editingItem.id_controlador || editingItem.id}`, formData);
        setMessage({ type: 'success', text: 'Controlador actualizado correctamente' });
      } else {
        await api.post('/controladores/', formData);
        setMessage({ type: 'success', text: 'Controlador creado correctamente' });
      }
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error guardando:', error);
      setMessage({ type: 'error', text: 'Error al guardar el controlador' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const estadoColors = {
    activo: 'bg-green-100 text-green-800',
    inactivo: 'bg-yellow-100 text-yellow-800',
    eliminado: 'bg-red-100 text-red-800',
  };

  const estadoLabels = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    eliminado: 'Eliminado',
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'direccion_ip', label: 'IP' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColors[item.estado] || 'bg-gray-100'}`}>
          {estadoLabels[item.estado] || item.estado}
        </span>
      )
    },
  ];

  const accionesDisponibles = (item) => {
    if (item.estado === 'eliminado') return [];
    if (item.estado === 'activo') {
      return [
        { label: 'Desactivar', accion: 'inactivo', color: 'text-yellow-600 hover:bg-yellow-50' },
        { label: 'Eliminar', accion: 'eliminado', color: 'text-red-600 hover:bg-red-50' },
      ];
    }
    if (item.estado === 'inactivo') {
      return [
        { label: 'Activar', accion: 'activo', color: 'text-green-600 hover:bg-green-50' },
        { label: 'Eliminar', accion: 'eliminado', color: 'text-red-600 hover:bg-red-50' },
      ];
    }
    return [];
  };

  return (
    <div>
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">Total: {data.length} controladores</span>
            {canEdit && (
              <button
                onClick={handleCreate}
                className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                </svg>
                Nuevo
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-text-secondary">
                    {col.label}
                  </th>
                ))}
                {canEdit && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (canEdit ? 1 : 0)} className="px-4 py-8 text-center text-text-muted">
                    Cargando...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (canEdit ? 1 : 0)} className="px-4 py-8 text-center text-text-muted">
                    No hay controladores registrados
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const itemId = item.id_controlador || item.id;
                  return (
                    <tr key={itemId} className="hover:bg-gray-50">
                      {columns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-sm">
                          {col.render ? col.render(item) : item[col.key] || '-'}
                        </td>
                      ))}
                      {canEdit && (
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-1 flex-wrap">
                            {item.estado !== 'eliminado' && (
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                                title="Editar"
                              >
                                ✏️
                              </button>
                            )}
                            {accionesDisponibles(item).map((acc) => (
                              <button
                                key={acc.accion}
                                onClick={() => openEstadoModal({ ...item, id: itemId }, acc.accion)}
                                className={`p-1 rounded text-sm ${acc.color}`}
                                title={acc.label}
                              >
                                {acc.label === 'Activar' ? '✅' : 
                                 acc.label === 'Desactivar' ? '⏸️' : 
                                 '🗑️'}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-500">
                {editingItem ? 'Editar Controlador' : 'Nuevo Controlador'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Marca</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Dirección IP</label>
                  <input
                    type="text"
                    name="direccion_ip"
                    value={formData.direccion_ip}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="192.168.1.100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Puerto</label>
                  <input
                    type="number"
                    name="puerto"
                    value={formData.puerto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Protocolo</label>
                  <select
                    name="protocolo"
                    value={formData.protocolo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="modbus_tcp">Modbus TCP</option>
                    <option value="modbus_rtu">Modbus RTU</option>
                    <option value="opc_ua">OPC UA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Firmware</label>
                  <input
                    type="text"
                    name="firmware"
                    value={formData.firmware}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Número de Serie</label>
                  <input
                    type="text"
                    name="serie"
                    value={formData.serie}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Edificio *
                  </label>
                  <select
                    name="id_edificio"
                    value={formData.id_edificio || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Seleccionar edificio</option>
                    {edificios.map((ed) => (
                      <option key={ed.id_edificio} value={ed.id_edificio}>
                        {ed.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para confirmar cambio de estado */}
      {showEstadoModal && estadoTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-primary-500 mb-4">
              Confirmar cambio de estado
            </h3>
            <p className="text-text-secondary mb-2">
              ¿Estás seguro de cambiar el controlador <strong>{estadoTarget.nombre}</strong>?
            </p>
            <p className="text-sm text-text-muted mb-4">
              Estado actual: <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColors[estadoTarget.estado]}`}>
                {estadoLabels[estadoTarget.estado]}
              </span>
              {' → '}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColors[estadoAccion]}`}>
                {estadoLabels[estadoAccion]}
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowEstadoModal(false); setEstadoTarget(null); setEstadoAccion(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCambiarEstado}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoControladores;
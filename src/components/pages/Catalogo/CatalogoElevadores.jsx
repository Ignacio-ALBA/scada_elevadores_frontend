import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import CatalogoTable from './CatalogoTable';

const CatalogoElevadores = ({ canEdit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/elevadores/');
      setData(response.data);
    } catch (error) {
      console.error('Error cargando elevadores:', error);
      setMessage({ type: 'error', text: 'Error al cargar los elevadores' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    // Redirigir a la interfaz de Elevadores para crear
    window.location.href = '/elevadores';
  };

  const handleEdit = (item) => {
    // Redirigir a la interfaz de Elevadores para editar
    window.location.href = `/elevadores?edit=${item.id_elevador || item.id}`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elevador?')) return;
    
    try {
      await api.delete(`/elevadores/${id}`);
      setMessage({ type: 'success', text: 'Elevador eliminado correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el elevador' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const columns = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'edificio', label: 'Edificio' },
    { key: 'tipo', label: 'Tipo' },
    { 
      key: 'estado_operativo', 
      label: 'Estado',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.estado_operativo === 'operativo' ? 'bg-green-100 text-green-800' :
          item.estado_operativo === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.estado_operativo || '-'}
        </span>
      )
    },
  ];

  return (
    <div>
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}
      <CatalogoTable
        data={data}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        canEdit={canEdit}
        emptyMessage="No hay elevadores registrados"
      />
    </div>
  );
};

export default CatalogoElevadores;
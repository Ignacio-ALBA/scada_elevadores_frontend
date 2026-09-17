import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import CatalogoTable from './CatalogoTable';

const CatalogoUsuarios = ({ canEdit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/usuarios/');
      setData(response.data.data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setMessage({ type: 'error', text: 'Error al cargar los usuarios' });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    window.location.href = '/usuarios';
  };

  const handleEdit = (item) => {
    window.location.href = `/usuarios?edit=${item.id_usuario || item.id}`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setMessage({ type: 'success', text: 'Usuario eliminado correctamente' });
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el usuario' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const columns = [
    { key: 'username', label: 'Usuario' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'correo', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    { 
      key: 'activo', 
      label: 'Estado',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${item.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.activo ? 'Activo' : 'Inactivo'}
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
        emptyMessage="No hay usuarios registrados"
      />
    </div>
  );
};

export default CatalogoUsuarios;
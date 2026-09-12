// frontend/src/components/pages/Controladores/Controladores.jsx
import React, { useState, useEffect } from 'react';
import { controladorService } from '../../../services/controladorService';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const Controladores = () => {
  const [controladores, setControladores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageTitle = useNombreInterfaz('controladores');

  useEffect(() => {
    cargarControladores();
  }, []);

  const cargarControladores = async () => {
    try {
      setLoading(true);
      const data = await controladorService.getAll();
      setControladores(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando controladores:', err);
      setError('Error al cargar los controladores');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* <h1 className="text-2xl font-bold text-primary-500">Controladores</h1> */}
        <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
          + Nuevo Controlador
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {controladores.map((controlador) => (
              <tr key={controlador.id_controlador} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{controlador.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{controlador.marca}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{controlador.modelo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{controlador.direccion_ip}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    controlador.estado === 'activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {controlador.estado || 'activo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-primary-500 hover:text-primary-700 mr-3">Editar</button>
                  <button className="text-red-500 hover:text-red-700">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Controladores;
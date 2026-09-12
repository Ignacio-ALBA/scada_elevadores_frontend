import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const CatalogoPermisos = ({ canEdit }) => {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const pageTitle = useNombreInterfaz('permisos');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar roles
      const rolesResponse = await api.get('/roles/');
      setRoles(rolesResponse.data);
      
      // Cargar todos los permisos
      const permisosResponse = await api.get('/permisos/');
      setData(permisosResponse.data);

      // console.log('🔍 Permisos response:', permisosResponse.data);
      // console.log('🔍 Roles response:', rolesResponse.data);
      
      // Seleccionar el primer rol por defecto
      if (rolesResponse.data.length > 0 && !selectedRol) {
        setSelectedRol(rolesResponse.data[0].id_rol);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleRolChange = (e) => {
    setSelectedRol(parseInt(e.target.value));
  };

  const handleTogglePermiso = async (rolId, moduloId, campo) => {
    if (!canEdit) return;
    
    // Encontrar el permiso actual
    const permiso = data.find(p => p.id_rol === rolId && p.id_modulo === moduloId);
    if (!permiso) return;
    
    const nuevoValor = !permiso[campo];
    
    try {
      setSaving(true);
      await api.patch(`/permisos/${permiso.id}`, {
        [campo]: nuevoValor
      });
      
      // Actualizar localmente
      setData(data.map(p => 
        p.id_rol === rolId && p.id_modulo === moduloId 
          ? { ...p, [campo]: nuevoValor }
          : p
      ));

      // console.log('🔍 Enviando PATCH a /permisos/${permiso.id}', {
      //     [campo]: nuevoValor
      // });
      
      setMessage({ type: 'success', text: 'Permiso actualizado correctamente' });
    } catch (error) {
      console.error('Error actualizando permiso:', error);
      setMessage({ type: 'error', text: 'Error al actualizar el permiso' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Filtrar permisos por rol seleccionado
  const permisosPorRol = data.filter(p => p.id_rol === selectedRol);
  
  // Obtener el nombre del rol seleccionado
  const rolSeleccionado = roles.find(r => r.id_rol === selectedRol);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-8 flex justify-center">
        <span className="text-primary-500">Cargando permisos...</span>
      </div>
    );
  }

  return (
    <div>
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {/* Header con selector de rol */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
          <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-text-secondary">Rol:</label>
            <select
              value={selectedRol || ''}
              onChange={handleRolChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-w-[200px]"
            >
              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre} {rol.estado !== 'activo' ? `(${rol.estado})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-text-muted">
            {permisosPorRol.length} permisos para {rolSeleccionado?.nombre || 'este rol'}
          </div>
        </div>

        {/* Tabla de permisos */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Módulo
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider w-20">
                  Ver
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider w-20">
                  Crear
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider w-20">
                  Editar
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider w-20">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {permisosPorRol.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-text-muted">
                    No hay permisos configurados para este rol
                  </td>
                </tr>
              ) : (
                permisosPorRol.map((permiso) => (
                  <tr key={permiso.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-text-secondary">
                      {permiso.modulo_nombre || permiso.modulo}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePermiso(permiso.id_rol, permiso.id_modulo, 'puede_ver')}
                        disabled={!canEdit || saving}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          permiso.puede_ver
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        } ${!canEdit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        {permiso.puede_ver ? '✅' : '❌'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePermiso(permiso.id_rol, permiso.id_modulo, 'puede_crear')}
                        disabled={!canEdit || saving}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          permiso.puede_crear
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        } ${!canEdit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        {permiso.puede_crear ? '✅' : '❌'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePermiso(permiso.id_rol, permiso.id_modulo, 'puede_editar')}
                        disabled={!canEdit || saving}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          permiso.puede_editar
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        } ${!canEdit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        {permiso.puede_editar ? '✅' : '❌'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePermiso(permiso.id_rol, permiso.id_modulo, 'puede_eliminar')}
                        disabled={!canEdit || saving}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          permiso.puede_eliminar
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        } ${!canEdit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        {permiso.puede_eliminar ? '✅' : '❌'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-text-muted">
            {canEdit ? '💡 Haz clic en los botones para activar/desactivar permisos' : '🔒 Solo lectura'}
          </span>
          {saving && (
            <span className="text-xs text-primary-500 flex items-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              Guardando...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogoPermisos;
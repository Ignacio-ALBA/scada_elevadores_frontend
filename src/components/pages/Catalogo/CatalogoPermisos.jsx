// frontend/src/components/pages/Catalogo/CatalogoPermisos.jsx
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

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  useEffect(() => {
    cargarDatos();
  }, []);

  // 🔄 Cuando los roles se cargan, selecciona el primero que tenga permisos
  useEffect(() => {
    if (Array.isArray(roles) && roles.length > 0 && !selectedRol) {
      // Preferir rol 1 (SuperAdmin) que siempre tiene permisos
      const rolConPermisos = roles.find(r => r.idRol === 1) || roles[0];
      console.log('🔄 Seleccionando rol con permisos:', rolConPermisos.idRol, rolConPermisos.nombre);
      setSelectedRol(rolConPermisos.idRol);
    }
  }, [roles]);

  // 🔄 Cuando cambia el rol seleccionado, cargar permisos específicos
  useEffect(() => {
    if (selectedRol) {
      cargarPermisosDelRol(selectedRol);
    }
  }, [selectedRol]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const rolesResponse = await api.get('/roles/');
      
      // El array real está en response.data.data.data
      const rolesArray = rolesResponse.data?.data?.data || rolesResponse.data?.data || rolesResponse.data || [];
      console.log('🔍 rolesArray cargados:', rolesArray.length, 'roles');
      setRoles(rolesArray);
    } catch (error) {
      console.error('Error cargando roles:', error);
      setMessage({ type: 'error', text: 'Error al cargar los roles' });
      setRoles([]);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarPermisosDelRol = async (rolId) => {
    try {
      console.log('🔍 Cargando permisos para rol:', rolId);
      const permisosResponse = await api.get(`/permisos/rol/${rolId}`);
      console.log('🔍 permisosResponse completa:', permisosResponse);
      console.log('🔍 permisosResponse.data:', permisosResponse.data);
      
      // El endpoint /permisos/rol/{id} retorna directamente un array en response.data.data
      let permisosArray = [];
      
      if (Array.isArray(permisosResponse.data?.data)) {
        permisosArray = permisosResponse.data.data;
      } else if (Array.isArray(permisosResponse.data)) {
        permisosArray = permisosResponse.data;
      } else if (permisosResponse.data?.success && Array.isArray(permisosResponse.data?.data)) {
        permisosArray = permisosResponse.data.data;
      }
      
      console.log('🔍 permisosArray para rol', rolId, ':', Array.isArray(permisosArray) ? permisosArray.length : 'no es array', permisosArray);
      setData(permisosArray);
    } catch (error) {
      console.error('Error cargando permisos del rol:', error);
      setData([]);
    }
  };

  const handleRolChange = (e) => {
    setSelectedRol(parseInt(e.target.value));
  };

  const handleTogglePermiso = async (rolId, moduloId, campo) => {
    if (!canEdit) return;
    
    const permiso = data.find(p => p.idRol === rolId && p.idModulo === moduloId);
    if (!permiso) return;
    
    const nuevoValor = !permiso[campo];
    
    try {
      setSaving(true);
      // Convertir camelCase a snake_case para el backend
      const campoSnakeCase = campo.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      await api.patch(`/permisos/${permiso.id}`, {
        [campoSnakeCase]: nuevoValor
      });
      
      setData(data.map(p => 
        p.idRol === rolId && p.idModulo === moduloId 
          ? { ...p, [campo]: nuevoValor }
          : p
      ));
      
      setMessage({ type: 'success', text: 'Permiso actualizado correctamente' });
    } catch (error) {
      console.error('Error actualizando permiso:', error);
      setMessage({ type: 'error', text: 'Error al actualizar el permiso' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Ya no necesitamos filtrar porque data ya contiene solo los permisos del rol seleccionado
  const permisosPorRol = Array.isArray(data) ? data : [];
  const rolSeleccionado = Array.isArray(roles) ? roles.find(r => r.idRol === selectedRol) : null;

  // ✅ Estilos para los botones de permisos según tema
  const getPermisoButtonClass = (tipo, valor) => {
    const colores = {
      ver: { activo: 'bg-green-100 text-green-700 hover:bg-green-200', inactivo: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
      crear: { activo: 'bg-blue-100 text-blue-700 hover:bg-blue-200', inactivo: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
      editar: { activo: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200', inactivo: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
      eliminar: { activo: 'bg-red-100 text-red-700 hover:bg-red-200', inactivo: 'bg-gray-100 text-gray-400 hover:bg-gray-200' },
    };
    
    if (isDark) {
      return {
        activo: tipo === 'ver' ? 'bg-green-900/50 text-green-300 hover:bg-green-800/50' :
               tipo === 'crear' ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' :
               tipo === 'editar' ? 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-800/50' :
               'bg-red-900/50 text-red-300 hover:bg-red-800/50',
        inactivo: 'bg-gray-700 text-gray-500 hover:bg-gray-600'
      };
    }
    
    return colores[tipo] || colores.ver;
  };

  if (loading) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-card p-8 flex justify-center`}>
        <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando permisos...</span>
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

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
        {/* Header con selector de rol */}
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-wrap justify-between items-center gap-3`}>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <div className="flex items-center gap-3">
            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Rol:</label>
            <select
              value={selectedRol || ''}
              onChange={handleRolChange}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-w-[200px] ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              {Array.isArray(roles) ? roles.map((rol) => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.nombre} {rol.estado !== 'activo' ? `(${rol.estado})` : ''}
                </option>
              )) : null}
            </select>
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
            {permisosPorRol.length} permisos para {rolSeleccionado?.nombre || 'este rol'}
          </div>
        </div>

        {/* Tabla de permisos */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Módulo
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-20 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Ver
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-20 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Crear
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-20 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Editar
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-20 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {permisosPorRol.length === 0 ? (
                <tr>
                  <td colSpan="5" className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    No hay permisos configurados para este rol
                  </td>
                </tr>
              ) : (
                permisosPorRol.map((permiso) => {
                  const buttonStyle = getPermisoButtonClass(
                    permiso.campo || 'ver', 
                    permiso.puedeVer
                  );
                  
                  return (
                    <tr key={permiso.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-text-secondary'}`}>
                        {permiso.nombreModulo || permiso.modulo}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePermiso(permiso.idRol, permiso.idModulo, 'puedeVer')}
                          disabled={!canEdit || saving}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            permiso.puedeVer
                              ? isDark ? 'bg-green-900/50 text-green-300 hover:bg-green-800/50' : 'bg-green-100 text-green-700 hover:bg-green-200'
                              : isDark ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          } ${!canEdit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          {permiso.puedeVer ? '✅' : '❌'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePermiso(permiso.idRol, permiso.idModulo, 'puedeCrear')}
                          disabled={!canEdit || saving}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            permiso.puedeCrear
                              ? isDark ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : isDark ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          } ${!canEdit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          {permiso.puedeCrear ? '✅' : '❌'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePermiso(permiso.idRol, permiso.idModulo, 'puedeEditar')}
                          disabled={!canEdit || saving}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            permiso.puedeEditar
                              ? isDark ? 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-800/50' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : isDark ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          } ${!canEdit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          {permiso.puedeEditar ? '✅' : '❌'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePermiso(permiso.idRol, permiso.idModulo, 'puedeEliminar')}
                          disabled={!canEdit || saving}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            permiso.puedeEliminar
                              ? isDark ? 'bg-red-900/50 text-red-300 hover:bg-red-800/50' : 'bg-red-100 text-red-700 hover:bg-red-200'
                              : isDark ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          } ${!canEdit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          {permiso.puedeEliminar ? '✅' : '❌'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className={`p-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t flex justify-between items-center`}>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
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
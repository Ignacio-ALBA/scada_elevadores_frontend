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

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const rolesResponse = await api.get('/roles/');
      setRoles(rolesResponse.data);
      
      const permisosResponse = await api.get('/permisos/');
      setData(permisosResponse.data);
      
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
    
    const permiso = data.find(p => p.id_rol === rolId && p.id_modulo === moduloId);
    if (!permiso) return;
    
    const nuevoValor = !permiso[campo];
    
    try {
      setSaving(true);
      await api.patch(`/permisos/${permiso.id}`, {
        [campo]: nuevoValor
      });
      
      setData(data.map(p => 
        p.id_rol === rolId && p.id_modulo === moduloId 
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

  const permisosPorRol = data.filter(p => p.id_rol === selectedRol);
  const rolSeleccionado = roles.find(r => r.id_rol === selectedRol);

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
              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre} {rol.estado !== 'activo' ? `(${rol.estado})` : ''}
                </option>
              ))}
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
                    permiso.puede_ver
                  );
                  
                  return (
                    <tr key={permiso.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-text-secondary'}`}>
                        {permiso.modulo_nombre || permiso.modulo}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePermiso(permiso.id_rol, permiso.id_modulo, 'puede_ver')}
                          disabled={!canEdit || saving}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            permiso.puede_ver
                              ? isDark ? 'bg-green-900/50 text-green-300 hover:bg-green-800/50' : 'bg-green-100 text-green-700 hover:bg-green-200'
                              : isDark ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
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
                              ? isDark ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : isDark ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
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
                              ? isDark ? 'bg-yellow-900/50 text-yellow-300 hover:bg-yellow-800/50' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : isDark ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
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
                              ? isDark ? 'bg-red-900/50 text-red-300 hover:bg-red-800/50' : 'bg-red-100 text-red-700 hover:bg-red-200'
                              : isDark ? 'bg-gray-700 text-gray-500 hover:bg-gray-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          } ${!canEdit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          {permiso.puede_eliminar ? '✅' : '❌'}
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
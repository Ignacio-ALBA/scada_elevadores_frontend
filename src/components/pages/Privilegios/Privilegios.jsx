// frontend/src/components/pages/Privilegios/Privilegios.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

// SVG Iconos inline
const IconSave = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
    <path d="M14 6H6v8h8V6z"/>
  </svg>
);

const IconRefresh = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3a1 1 0 011 1v1.5a6 6 0 11-3.4-5.4 1 1 0 11.8 1.8A4 4 0 1010 15a4 4 0 003.2-6.4l-.7.7a1 1 0 01-1.4-1.4l2-2a1 1 0 011.4 0l2 2a1 1 0 01-1.4 1.4l-.7-.7A6 6 0 0110 3z"/>
  </svg>
);

// Nombre de los módulos para mostrar
const moduleLabels = {
  dashboard: 'Dashboard',
  elevadores: 'Elevadores',
  alarmas: 'Alarmas',
  eventos: 'Eventos',
  mantenimiento: 'Mantenimiento',
  reportes: 'Reportes',
  usuarios: 'Usuarios',
  configuraciones: 'Configuraciones',
  integraciones: 'Integraciones',
  catalogo: 'Catálogo',
  privilegios: 'Privilegios',
};

const Privilegios = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [selectedRolId, setSelectedRolId] = useState(null);
  const [permisos, setPermisos] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const pageTitle = useNombreInterfaz('privilegios');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  // Cargar roles al montar el componente
  useEffect(() => {
    cargarRoles();
  }, []);

  // Cargar permisos cuando cambia el rol seleccionado
  useEffect(() => {
    if (selectedRolId !== null && selectedRolId !== undefined) {
      cargarPermisos(selectedRolId);
    }
  }, [selectedRolId]);

  const cargarRoles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/roles/');
      const rolesArray = response.data.data || [];
      
      if (rolesArray && rolesArray.length > 0) {
        const rolesData = rolesArray.map(rol => ({
          id: rol.id_rol || rol.idRol,
          nombre: rol.nombre,
          nivel: rol.nivel_jerarquia || rol.nivelJerarquia
        }));
        setRoles(rolesData);
        setSelectedRolId(rolesData[0].id);
      } else {
        console.warn('⚠️ No hay roles en la API, usando mock');
        const mockRoles = [
          { id: 1, nombre: 'SuperAdmin', nivel: 1 },
          { id: 2, nombre: 'Admin', nivel: 2 },
          { id: 3, nombre: 'Supervisor', nivel: 3 },
          { id: 4, nombre: 'Operador', nivel: 4 },
          { id: 5, nombre: 'Mantenimiento', nivel: 5 },
        ];
        setRoles(mockRoles);
        setSelectedRolId(1);
      }
    } catch (error) {
      console.error('❌ Error cargando roles:', error);
      const mockRoles = [
        { id: 1, nombre: 'SuperAdmin', nivel: 1 },
        { id: 2, nombre: 'Admin', nivel: 2 },
        { id: 3, nombre: 'Supervisor', nivel: 3 },
        { id: 4, nombre: 'Operador', nivel: 4 },
        { id: 5, nombre: 'Mantenimiento', nivel: 5 },
      ];
      setRoles(mockRoles);
      setSelectedRolId(1);
    } finally {
      setLoading(false);
    }
  };

  const cargarPermisos = async (rolId) => {
    if (!rolId) {
      console.warn('⚠️ rolId inválido:', rolId);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get(`/permisos/rol/${rolId}`);
      
      const permisosArray = response.data.data || [];
      const modulos = {};
      permisosArray.forEach(permiso => {
        if (permiso.modulo_clave) {
          modulos[permiso.modulo_clave] = {
            ver: permiso.puede_ver,
            crear: permiso.puede_crear,
            editar: permiso.puede_editar,
            eliminar: permiso.puede_eliminar
          };
        }
      });

      const filteredModulos = {};
      Object.keys(modulos).forEach(key => {
        if (key && key !== 'null' && key !== 'undefined') {
          filteredModulos[key] = modulos[key];
        }
      });
      setPermisos(filteredModulos);
    } catch (error) {
      console.error('❌ Error cargando permisos:', error);
      setPermisos({});
    } finally {
      setLoading(false);
    }
  };

  const handlePermisoChange = (modulo, accion, value) => {
    setPermisos(prev => ({
      ...prev,
      [modulo]: {
        ...prev[modulo],
        [accion]: value
      }
    }));
  };

  const handleToggleAll = (modulo, value) => {
    setPermisos(prev => ({
      ...prev,
      [modulo]: {
        ver: value,
        crear: value,
        editar: value,
        eliminar: value
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedRolId) {
      setMessage({ type: 'error', text: 'Selecciona un rol primero' });
      return;
    }
    
    setSaving(true);
    setMessage(null);
    
    try {
      await api.put(`/permisos/rol/${selectedRolId}`, permisos);
      setMessage({ type: 'success', text: 'Permisos guardados correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar los permisos' });
      console.error('Error guardando permisos:', error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleReset = () => {
    if (selectedRolId) {
      cargarPermisos(selectedRolId);
    }
  };

  const handleRolChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setSelectedRolId(value);
    }
  };

  if (loading && roles.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${isDark ? 'text-gray-400' : 'text-primary-500'}`}>
        <span>Cargando privilegios...</span>
      </div>
    );
  }

  const moduloKeys = Object.keys(permisos).filter(key => key && key !== 'null' && key !== 'undefined');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>
            Gestiona los permisos de cada rol en el sistema
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={loading}
            className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 ${
              isDark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <IconRefresh />
            Restablecer
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm ${
              isDark 
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
            }`}
          >
            <IconSave />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Selector de Rol */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'}`}>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
          Seleccionar Rol
        </label>
        <select
          value={selectedRolId || ''}
          onChange={handleRolChange}
          className={`w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          {roles.length === 0 ? (
            <option value="">No hay roles disponibles</option>
          ) : (
            roles.map(rol => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Tabla de Permisos */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/4 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Módulo
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Ver
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Crear
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Editar
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Eliminar
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Todos
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {loading ? (
                <tr>
                  <td colSpan="6" className={`px-6 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Cargando permisos...
                  </td>
                </tr>
              ) : moduloKeys.length === 0 ? (
                <tr>
                  <td colSpan="6" className={`px-6 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    No hay permisos configurados para este rol
                  </td>
                </tr>
              ) : (
                moduloKeys.map((modulo) => {
                  const p = permisos[modulo] || { ver: false, crear: false, editar: false, eliminar: false };
                  const label = moduleLabels[modulo] || modulo;
                  const allChecked = p.ver && p.crear && p.editar && p.eliminar;
                  
                  return (
                    <tr key={modulo} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 font-medium ${isDark ? 'text-blue-400' : 'text-primary-500'}`}>
                        {label}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={p.ver || false}
                          onChange={(e) => handlePermisoChange(modulo, 'ver', e.target.checked)}
                          className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={p.crear || false}
                          onChange={(e) => handlePermisoChange(modulo, 'crear', e.target.checked)}
                          className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={p.editar || false}
                          onChange={(e) => handlePermisoChange(modulo, 'editar', e.target.checked)}
                          className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={p.eliminar || false}
                          onChange={(e) => handlePermisoChange(modulo, 'eliminar', e.target.checked)}
                          className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={allChecked}
                          onChange={(e) => handleToggleAll(modulo, e.target.checked)}
                          className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className={`px-6 py-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
          {selectedRolId && roles.length > 0 && (
            <span>
              Gestionando permisos para <strong className={isDark ? 'text-gray-200' : 'text-gray-800'}>
                {roles.find(r => r.id === selectedRolId)?.nombre || 'rol seleccionado'}
              </strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Privilegios;
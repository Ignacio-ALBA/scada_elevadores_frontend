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
      // console.log('🔍 Cargando roles...');
      const response = await api.get('/roles/');
      // console.log('🔍 Respuesta de roles:', response.data);
      
      // Verificar que los datos existen
      if (response.data?.data?.data && response.data.data.data.length > 0) {
        // Mapear para asegurar que tienen el campo 'id'
        const rolesData = response.data.data.data.map(rol => ({
          id: rol.idRol || rol.id,  // Intentar con idRol primero
          nombre: rol.nombre,
          nivel: rol.nivelJerarquia || rol.nivel_jerarquia || rol.nivel
        }));
        // console.log('🔍 Roles mapeados:', rolesData);
        setRoles(rolesData);
        setSelectedRolId(rolesData[0].id);
      } else {
        // Fallback: roles mock
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
      // Fallback: roles mock
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
      // console.log(`🔍 Cargando permisos para rol: ${rolId}`);
      const response = await api.get(`/permisos/rol/${rolId}`);
      // console.log('🔍 Permisos cargados:', response.data);
      
      // const modulos = response.data.modulos || {};
      const modulos = {};
      const permisosData = response.data?.data?.data || response.data?.data || response.data || [];
      (Array.isArray(permisosData) ? permisosData : []).forEach(permiso => {
        if (permiso.modulo_clave) {
          modulos[permiso.modulo_clave] = {
            ver: permiso.puede_ver,
            crear: permiso.puede_crear,
            editar: permiso.puede_editar,
            eliminar: permiso.puede_eliminar
          };
        }
      });

      // Filtrar módulos inválidos
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
      <div className="flex items-center justify-center h-64">
        <span className="text-primary-500">Cargando privilegios...</span>
      </div>
    );
  }

  const moduloKeys = Object.keys(permisos).filter(key => key && key !== 'null' && key !== 'undefined');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-bold text-primary-500">Privilegios</h1> */}
          <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
          <p className="text-text-secondary">
            Gestiona los permisos de cada rol en el sistema
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <IconRefresh />
            Restablecer
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <IconSave />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      {/* Selector de Rol */}
      <div className="bg-white p-4 rounded-xl shadow-card">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Seleccionar Rol
        </label>
        <select
          value={selectedRolId || ''}
          onChange={handleRolChange}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-1/4">
                  Módulo
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Ver
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Crear
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Editar
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Eliminar
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Todos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-text-muted">
                    Cargando permisos...
                  </td>
                </tr>
              ) : moduloKeys.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-text-muted">
                    No hay permisos configurados para este rol
                  </td>
                </tr>
              ) : (
                moduloKeys.map((modulo) => {
                  const p = permisos[modulo] || { ver: false, crear: false, editar: false, eliminar: false };
                  const label = moduleLabels[modulo] || modulo;
                  const allChecked = p.ver && p.crear && p.editar && p.eliminar;
                  
                  return (
                    <tr key={modulo} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary-500">
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
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-text-muted">
          {selectedRolId && roles.length > 0 && (
            <span>
              Gestionando permisos para <strong>{roles.find(r => r.id === selectedRolId)?.nombre || 'rol seleccionado'}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Privilegios;
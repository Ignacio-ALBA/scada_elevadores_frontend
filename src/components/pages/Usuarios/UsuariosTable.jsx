// frontend/src/components/pages/Usuarios/UsuariosTable.jsx
import React from 'react';

const UsuariosTable = ({ 
  usuarios, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  loading,
  isDark = false 
}) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-card p-8 flex justify-center`}>
        <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando usuarios...</span>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Usuario
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Nombre
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Correo
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Rol
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Estado
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Último Acceso
              </th>
              <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="7" className={`px-6 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                    {usuario.username}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {usuario.nombre} {usuario.apellido_paterno}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {usuario.correo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      usuario.rol === 'SuperAdmin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      usuario.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(usuario.ultimo_acceso)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(usuario)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'text-cyan-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'}`}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onToggleActive(usuario.id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'text-yellow-400 hover:bg-gray-700' : 'text-yellow-600 hover:bg-yellow-50'}`}
                        title={usuario.activo ? 'Desactivar' : 'Activar'}
                      >
                        {usuario.activo ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => onDelete(usuario.id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'}`}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className={`px-6 py-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
        Mostrando {usuarios.length} usuarios
      </div>
    </div>
  );
};

export default UsuariosTable;
import React, { useState, useEffect, useCallback } from 'react';
import UsuariosTable from './UsuariosTable';
import UsuarioForm from './UsuariosForm';
import UsuariosFilters from './UsuariosFilters';
import PermisoButton from '../../common/PermisoButton';
import PermisoGuard from '../../common/PermisoGuard';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import { usuarioService } from '../../../services/usuarioService';

// SVG Iconos inline
const IconPlus = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
  </svg>
);



const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  
  // Separar estado de control de resultado para evitar loops
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState({
    totalCount: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    activo: undefined
  });
  const pageTitle = useNombreInterfaz('usuarios');

  // Memorizar la función loadUsuarios para evitar infinite loops
  const loadUsuarios = useCallback(async (page, size, activo) => {
    try {
      setLoading(true);
      console.log('📥 Cargando usuarios:', { page, limit: size, activo });
      
      const response = await usuarioService.getAll({
        page,
        limit: size,
        activo: activo
      });

      console.log('✅ Respuesta usuarios completa:', response);
      console.log('✅ Usuarios mapeados:', response.data);
      
      setUsuarios(response.data || []);
      // Solo actualizar totalCount y totalPages, no currentPage/pageSize (eso ya está en control)
      setPaginationInfo({
        totalCount: response.totalCount,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      console.error('Error details:', error.response?.data || error.message);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar usuarios cuando cambien paginación o filtros (sin depender de paginationInfo)
  useEffect(() => {
    console.log('🔄 useEffect disparado - cargando usuarios');
    loadUsuarios(currentPage, pageSize, filters.activo);
  }, [currentPage, pageSize, filters.activo, loadUsuarios]);

  const handleAdd = () => {
    setEditingUsuario(null);
    setShowForm(true);
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await usuarioService.delete(id);
        // Resetear a página 1 para recargar la lista
        setCurrentPage(1);
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  const handleSave = async (usuarioData) => {
    try {
      setLoading(true);
      if (editingUsuario) {
        await usuarioService.update(editingUsuario.id_usuario, usuarioData);
      } else {
        await usuarioService.create(usuarioData);
      }
      setShowForm(false);
      setEditingUsuario(null);
      // Resetear a página 1 para recargar la lista
      setCurrentPage(1);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert('Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUsuario(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset a página 1 cuando cambia el tamaño
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1); // Reset a página 1 cuando cambia filtro
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      activo: undefined
    });
    setCurrentPage(1);
  };

  return (
    <PermisoGuard modulo="usuarios">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            {/* <h1 className="text-2xl font-bold text-primary-500">Usuarios</h1> */}
            <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
            <p className="text-text-secondary">Gestiona los usuarios del sistema</p>
          </div>
          <PermisoButton 
            modulo="usuarios" 
            accion="crear"
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
            onClick={handleAdd}
          >
            <IconPlus />
            Nuevo Usuario
          </PermisoButton>
        </div>

        <UsuariosFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
        />

        <UsuariosTable
            usuarios={usuarios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
        />

        {/* Paginación */}
        <div className="bg-white rounded-xl shadow-card p-4 flex justify-between items-center">
          <div className="text-sm text-text-muted">
            Mostrando {usuarios.length} de {paginationInfo.totalCount} usuarios
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Página {currentPage} de {paginationInfo.totalPages}
              </span>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= paginationInfo.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              className="px-2 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="5">5 por página</option>
              <option value="10">10 por página</option>
              <option value="20">20 por página</option>
              <option value="50">50 por página</option>
            </select>
          </div>
        </div>

        {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-primary-500">
                    {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
                </div>
                <UsuarioForm
                usuario={editingUsuario}
                onSave={handleSave}
                onCancel={handleCancel}
                loading={loading}
                rolOptions={rolOptions}
                />
            </div>
            </div>
        )}
        </div>
    </PermisoGuard>
  );
};

export default Usuarios;
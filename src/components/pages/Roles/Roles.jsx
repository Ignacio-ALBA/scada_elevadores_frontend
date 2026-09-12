// frontend/src/components/pages/Roles/Roles.jsx
import React, { useState, useEffect, useCallback } from 'react';
import RolesTable from './RolesTable';
import RolesForm from './RolesForm';
import RolesFilters from './RolesFilters';
import { rolService } from '../../../services/rolService';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

// SVG Iconos inline
const IconPlus = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
  </svg>
);

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRol, setEditingRol] = useState(null);
  
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
  const pageTitle = useNombreInterfaz('roles');

  // Memorizar la función loadRoles para evitar infinite loops
  const loadRoles = useCallback(async (page, size, activo) => {
    try {
      setLoading(true);
      console.log('📥 Cargando roles:', { page, limit: size, activo });
      
      const response = await rolService.getAll({
        page,
        limit: size,
        activo: activo
      });

      console.log('✅ Respuesta roles completa:', response);
      console.log('✅ Roles mapeados:', response.data);
      
      setRoles(response.data || []);
      // Solo actualizar totalCount y totalPages, no currentPage/pageSize (eso ya está en control)
      setPaginationInfo({
        totalCount: response.totalCount,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('❌ Error cargando roles:', error);
      console.error('Error details:', error.response?.data || error.message);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar roles cuando cambien paginación o filtros (sin depender de paginationInfo)
  useEffect(() => {
    console.log('🔄 useEffect disparado - cargando roles');
    loadRoles(currentPage, pageSize, filters.activo);
  }, [currentPage, pageSize, filters.activo, loadRoles]);



  const handleAdd = () => {
    setEditingRol(null);
    setShowForm(true);
  };

  const handleEdit = (rol) => {
    setEditingRol(rol);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      try {
        await rolService.delete(id);
        // Resetear a página 1 para recargar la lista
        setCurrentPage(1);
      } catch (error) {
        console.error('Error eliminando rol:', error);
        alert('Error al eliminar el rol');
      }
    }
  };

  const handleSave = async (rolData) => {
    try {
      setLoading(true);
      if (editingRol) {
        await rolService.update(editingRol.id_rol, rolData);
      } else {
        await rolService.create(rolData);
      }
      setShowForm(false);
      setEditingRol(null);
      // Resetear a página 1 para recargar la lista
      setCurrentPage(1);
    } catch (error) {
      console.error('Error guardando rol:', error);
      alert('Error al guardar el rol');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRol(null);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
          <p className="text-text-secondary">Gestiona los roles del sistema</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
        >
          <IconPlus />
          Nuevo Rol
        </button>
      </div>

      <RolesFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <RolesTable
        roles={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Paginación */}
      <div className="bg-white rounded-xl shadow-card p-4 flex justify-between items-center">
        <div className="text-sm text-text-muted">
          Mostrando {roles.length} de {paginationInfo.totalCount} roles
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

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-500">
                {editingRol ? 'Editar Rol' : 'Nuevo Rol'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <RolesForm
              rol={editingRol}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;

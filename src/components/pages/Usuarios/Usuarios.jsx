// frontend/src/components/pages/Usuarios/Usuarios.jsx
import React, { useState, useEffect } from 'react';
import UsuariosTable from './UsuariosTable';
import UsuarioForm from './UsuariosForm';
import UsuariosFilters from './UsuariosFilters';
import PermisoButton from '../../common/PermisoButton';
import PermisoGuard from '../../common/PermisoGuard';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

// SVG Iconos inline
const IconPlus = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
  </svg>
);

// Datos mock
const mockUsuarios = [
  {
    id: 1,
    username: 'carlos.admin',
    nombre: 'Carlos',
    apellido_paterno: 'Ramírez',
    apellido_materno: 'González',
    correo: 'carlos@smartlift.com',
    rol: 'SuperAdmin',
    rol_id: 1,
    activo: true,
    ultimo_acceso: '2026-07-03T14:30:00',
    telefono: '55-1111-1111'
  },
  {
    id: 2,
    username: 'ana.empresa',
    nombre: 'Ana',
    apellido_paterno: 'Martínez',
    apellido_materno: 'López',
    correo: 'ana@empresa.com',
    rol: 'Admin',
    rol_id: 2,
    activo: true,
    ultimo_acceso: '2026-07-03T12:15:00',
    telefono: '33-2222-2222'
  },
  {
    id: 3,
    username: 'roberto.supervisor',
    nombre: 'Roberto',
    apellido_paterno: 'Sánchez',
    apellido_materno: 'Pérez',
    correo: 'roberto@smartlift.com',
    rol: 'Supervisor',
    rol_id: 3,
    activo: true,
    ultimo_acceso: '2026-07-02T16:45:00',
    telefono: '55-3333-3333'
  },
  {
    id: 4,
    username: 'maria.operador',
    nombre: 'María',
    apellido_paterno: 'García',
    apellido_materno: 'Ruiz',
    correo: 'maria@smartlift.com',
    rol: 'Operador',
    rol_id: 4,
    activo: true,
    ultimo_acceso: '2026-07-02T10:20:00',
    telefono: '55-4444-4444'
  },
  {
    id: 5,
    username: 'luis.tecnico',
    nombre: 'Luis',
    apellido_paterno: 'Torres',
    apellido_materno: 'Díaz',
    correo: 'luis@smartlift.com',
    rol: 'Mantenimiento',
    rol_id: 5,
    activo: false,
    ultimo_acceso: '2026-06-28T09:00:00',
    telefono: '55-5555-5555'
  }
];

const rolOptions = [
  { value: 'todos', label: 'Todos los roles' },
  { value: 1, label: 'SuperAdmin' },
  { value: 2, label: 'Admin' },
  { value: 3, label: 'Supervisor' },
  { value: 4, label: 'Operador' },
  { value: 5, label: 'Mantenimiento' }
];

const estadoOptions = [
  { value: 'todos', label: 'Todos los estados' },
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' }
];

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [filteredUsuarios, setFilteredUsuarios] = useState(mockUsuarios);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    rol: 'todos',
    estado: 'todos'
  });
  const pageTitle = useNombreInterfaz('usuarios');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  useEffect(() => {
    let result = usuarios;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(u =>
        u.username.toLowerCase().includes(searchLower) ||
        u.nombre.toLowerCase().includes(searchLower) ||
        u.apellido_paterno.toLowerCase().includes(searchLower) ||
        u.correo.toLowerCase().includes(searchLower)
      );
    }

    if (filters.rol !== 'todos') {
      result = result.filter(u => u.rol_id === parseInt(filters.rol));
    }

    if (filters.estado !== 'todos') {
      result = result.filter(u => u.activo === (filters.estado === 'true'));
    }

    setFilteredUsuarios(result);
  }, [usuarios, filters]);

  const handleAdd = () => {
    setEditingUsuario(null);
    setShowForm(true);
  };

  const handleEdit = (usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const handleToggleActive = (id) => {
    setUsuarios(usuarios.map(u =>
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  };

  const handleSave = (usuarioData) => {
    setLoading(true);
    setTimeout(() => {
      if (editingUsuario) {
        setUsuarios(usuarios.map(u =>
          u.id === editingUsuario.id ? { ...u, ...usuarioData } : u
        ));
      } else {
        const newId = Math.max(...usuarios.map(u => u.id)) + 1;
        setUsuarios([...usuarios, { ...usuarioData, id: newId }]);
      }
      setShowForm(false);
      setEditingUsuario(null);
      setLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUsuario(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      rol: 'todos',
      estado: 'todos'
    });
  };

  return (
    <PermisoGuard modulo="usuarios">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
              {pageTitle}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
              Gestiona los usuarios del sistema
            </p>
          </div>
          <PermisoButton 
            modulo="usuarios" 
            accion="crear"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm ${
              isDark 
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
            }`}
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
          rolOptions={rolOptions}
          estadoOptions={estadoOptions}
          isDark={isDark}
        />

        <UsuariosTable
          usuarios={filteredUsuarios}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          loading={loading}
          isDark={isDark}
        />

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
                  {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                <button
                  onClick={handleCancel}
                  className={isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
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
                isDark={isDark}
              />
            </div>
          </div>
        )}
      </div>
    </PermisoGuard>
  );
};

export default Usuarios;
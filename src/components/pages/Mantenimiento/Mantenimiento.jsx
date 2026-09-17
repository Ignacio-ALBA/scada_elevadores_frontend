// frontend/src/components/pages/Mantenimiento/Mantenimiento.jsx
import React, { useState, useEffect } from 'react';
import { mantenimientoService } from '../../../services/mantenimientoService';
import MantenimientoTable from './MantenimientoTable';
import MantenimientoForm from './MantenimientoForm';
import MantenimientoFilters from './MantenimientoFilters';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const IconPlus = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
  </svg>
);

const tipoOptions = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'preventivo', label: 'Preventivo' },
  { value: 'correctivo', label: 'Correctivo' },
  { value: 'predictivo', label: 'Predictivo' },
  { value: 'urgente', label: 'Urgente' },
];

const estadoOptions = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'programado', label: 'Programado' },
  { value: 'en_progreso', label: 'En Progreso' },
  { value: 'realizado', label: 'Realizado' },
  { value: 'cancelado', label: 'Cancelado' },
];

const Mantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMantenimiento, setEditingMantenimiento] = useState(null);
  const [message, setMessage] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    tipo: 'todos',
    estado: 'todos',
    fecha_desde: '',
    fecha_hasta: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'fecha_programada', direction: 'desc' });
  const [stats, setStats] = useState({
    total: 0,
    programados: 0,
    en_progreso: 0,
    realizados: 0,
    cancelados: 0,
  });

  const pageTitle = useNombreInterfaz('mantenimiento');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  useEffect(() => {
    cargarDatos();
    cargarEstadisticas();
  }, [filters, currentPage, pageSize, sortConfig]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const params = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        sort_by: sortConfig.key,
        sort_dir: sortConfig.direction,
      };
      
      if (filters.search && filters.search.trim() !== '') {
        params.search = filters.search.trim();
      }
      if (filters.tipo && filters.tipo !== 'todos') {
        params.tipo = filters.tipo;
      }
      if (filters.estado && filters.estado !== 'todos') {
        params.estado = filters.estado;
      }
      if (filters.fecha_desde) {
        params.fecha_desde = filters.fecha_desde;
      }
      if (filters.fecha_hasta) {
        params.fecha_hasta = filters.fecha_hasta;
      }
      
      const response = await mantenimientoService.getAll(params);
      setMantenimientos(response.data || []);
      setTotalRegistros(response.total || 0);
    } catch (error) {
      console.error('Error cargando mantenimientos:', error);
      setMessage({ type: 'error', text: 'Error al cargar los mantenimientos' });
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const params = {};
      
      if (filters.search && filters.search.trim() !== '') {
        params.search = filters.search.trim();
      }
      if (filters.tipo && filters.tipo !== 'todos') {
        params.tipo = filters.tipo;
      }
      if (filters.estado && filters.estado !== 'todos') {
        params.estado = filters.estado;
      }
      if (filters.fecha_desde) {
        params.fecha_desde = filters.fecha_desde;
      }
      if (filters.fecha_hasta) {
        params.fecha_hasta = filters.fecha_hasta;
      }
      
      const data = await mantenimientoService.getEstadisticas(params);
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setEditingMantenimiento(null);
    setShowForm(true);
  };

  const handleEdit = (mantenimiento) => {
    setEditingMantenimiento(mantenimiento);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este mantenimiento? Esto cambiará su estado a Cancelado.')) return;
    try {
      await mantenimientoService.delete(id);
      setMessage({ type: 'success', text: 'Mantenimiento eliminado correctamente' });
      await cargarDatos();
      await cargarEstadisticas();
    } catch (error) {
      console.error('Error eliminando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar el mantenimiento';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al eliminar' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSave = async (data) => {
    setLoading(true);
    setMessage(null);

    try {
      const dataToSend = {
        ...data,
        id_elevador: parseInt(data.id_elevador),
        costo: parseFloat(data.costo) || 0,
      };

      if (editingMantenimiento) {
        await mantenimientoService.update(editingMantenimiento.id, dataToSend);
        setMessage({ type: 'success', text: 'Mantenimiento actualizado correctamente' });
      } else {
        await mantenimientoService.create(dataToSend);
        setMessage({ type: 'success', text: 'Mantenimiento creado correctamente' });
      }
      setShowForm(false);
      setEditingMantenimiento(null);
      await cargarDatos();
      await cargarEstadisticas();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar el mantenimiento';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMantenimiento(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      tipo: 'todos',
      estado: 'todos',
      fecha_desde: '',
      fecha_hasta: '',
    });
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalRegistros / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Gestiona el mantenimiento de los elevadores
          </p>
        </div>
        <button
          onClick={handleAdd}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm ${
            isDark 
              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
          }`}
        >
          <IconPlus />
          Nuevo Mantenimiento
        </button>
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} border-l-4 border-primary-500`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>Total</div>
          <div className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{stats.total}</div>
        </div>
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} border-l-4 border-blue-500`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>Programados</div>
          <div className="text-2xl font-bold text-blue-600">{stats.programados}</div>
        </div>
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} border-l-4 border-yellow-500`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>En Progreso</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.en_progreso}</div>
        </div>
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} border-l-4 border-green-500`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>Realizados</div>
          <div className="text-2xl font-bold text-green-600">{stats.realizados}</div>
        </div>
      </div>

      {/* Filtros */}
      <MantenimientoFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        tipoOptions={tipoOptions}
        estadoOptions={estadoOptions}
        isDark={isDark}
      />

      {/* Tabla */}
      <MantenimientoTable
        mantenimientos={mantenimientos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        onSort={handleSort}
        sortConfig={sortConfig}
        isDark={isDark}
      />

      {/* Paginación */}
      {totalRegistros > 0 && (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-4 flex justify-between items-center flex-wrap gap-2`}>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
              Mostrando {mantenimientos.length} de {totalRegistros} mantenimientos
            </span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className={`px-2 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-lg transition-colors disabled:opacity-50 ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              ◀ Anterior
            </button>
            <span className={`px-3 py-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={`px-3 py-1 border rounded-lg transition-colors disabled:opacity-50 ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Siguiente ▶
            </button>
          </div>
        </div>
      )}

      {/* Modal Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
                {editingMantenimiento ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
              </h2>
              <button onClick={handleCancel} className={isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}>✕</button>
            </div>
            <MantenimientoForm
              mantenimiento={editingMantenimiento}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={loading}
              isDark={isDark}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Mantenimiento;
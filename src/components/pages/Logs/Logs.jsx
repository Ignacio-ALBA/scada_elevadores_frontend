// frontend/src/components/pages/Logs/Logs.jsx
import React, { useState, useEffect } from 'react';
import LogsFilters from './LogsFilters';
import LogsDetalleModal from './LogsDetalleModal';
import { logsService } from '../../../services/logsService';
import DataTable from '../../common/DataTable';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

// SVG Iconos inline
const IconRefresh = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
  </svg>
);

const IconEye = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
  </svg>
);

const Logs = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    tipo: 'todos',
    fecha_desde: '',
    fecha_hasta: '',
    usuario: '',
  });
  const pageTitle = useNombreInterfaz('reportes_log');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  // Estadísticas
  const [stats, setStats] = useState({
    total: 0,
    login_exitosos: 0,
    logout: 0,
    navegaciones: 0,
    acciones: 0,
    errores: 0,
  });

  useEffect(() => {
    cargarDatos();
  }, [filters, currentPage, pageSize]);

  const cargarLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      
      if (filters.tipo && filters.tipo !== 'todos') {
        params.tipo = filters.tipo;
      }
      if (filters.fecha_desde) {
        params.fecha_desde = filters.fecha_desde;
      }
      if (filters.fecha_hasta) {
        params.fecha_hasta = filters.fecha_hasta;
      }
      if (filters.usuario) {
        params.usuario = filters.usuario;
      }

      const response = await logsService.getLogs(params);
      setLogs(response.logs || []);
      setTotalLogs(response.total || 0);
    } catch (error) {
      console.error('Error al cargar logs:', error);
      setLogs([]);
      setTotalLogs(0);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const params = {};
      if (filters.fecha_desde) {
        params.fecha_desde = filters.fecha_desde.split('T')[0];
      }
      if (filters.fecha_hasta) {
        params.fecha_hasta = filters.fecha_hasta.split('T')[0];
      }
      const data = await logsService.getStats(params);
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const cargarDatos = async () => {
    await Promise.all([cargarLogs(), cargarEstadisticas()]);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      tipo: 'todos',
      fecha_desde: '',
      fecha_hasta: '',
      usuario: '',
    });
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleVerDetalle = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const handleRefresh = () => {
    cargarDatos();
  };

  // Obtener color según tipo de log
  const getTipoColor = (tipo) => {
    const colores = {
      'login': isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      'logout': isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800',
      'navegacion': isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
      'accion': isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800',
      'error': isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
      'auditoria': isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
    };
    return colores[tipo] || (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800');
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      'login': 'Login',
      'logout': 'Logout',
      'navegacion': 'Navegación',
      'accion': 'Acción',
      'error': 'Error',
      'auditoria': 'Auditoría',
    };
    return labels[tipo] || tipo;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Columnas para DataTable
  const columns = [
    {
      key: 'timestamp',
      title: 'Fecha/Hora',
      render: (value) => formatDate(value),
      width: 'w-48',
    },
    {
      key: 'tipo',
      title: 'Tipo',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(value)}`}>
          {getTipoLabel(value)}
        </span>
      ),
      width: 'w-32',
    },
    {
      key: 'usuario',
      title: 'Usuario',
      render: (value, item) => (
        <div>
          <div className={`font-medium text-sm ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{value || '-'}</div>
          {item.nombre_completo && (
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>{item.nombre_completo}</div>
          )}
        </div>
      ),
      width: 'w-40',
    },
    {
      key: 'mensaje',
      title: 'Mensaje',
      render: (value) => (
        <div className={`text-sm max-w-md truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`} title={value}>
          {value || '-'}
        </div>
      ),
    },
    {
      key: 'origen',
      title: 'Origen',
      render: (value) => (
        <div>
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{value || '-'}</div>
          {value && value.includes('http') && (
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'} truncate max-w-xs`}>
              {value}
            </div>
          )}
        </div>
      ),
      width: 'w-40',
    },
  ];

  // Acciones por fila
  const actions = [
    {
      label: 'Ver detalles',
      icon: <IconEye />,
      onClick: (item) => handleVerDetalle(item),
      className: isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-primary-500 hover:text-primary-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Registro completo de actividades del sistema
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm ${
            isDark 
              ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
          }`}
        >
          <IconRefresh />
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Filtros */}
      <LogsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        isDark={isDark}
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-4`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Total</div>
          <div className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{stats.total}</div>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-4`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Logins</div>
          <div className="text-2xl font-bold text-green-600">{stats.login_exitosos}</div>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-4`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Logouts</div>
          <div className={`text-2xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{stats.logout}</div>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-4`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Navegaciones</div>
          <div className="text-2xl font-bold text-blue-600">{stats.navegaciones}</div>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-4`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Acciones</div>
          <div className="text-2xl font-bold text-purple-600">{stats.acciones}</div>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-4`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Errores</div>
          <div className="text-2xl font-bold text-red-600">{stats.errores}</div>
        </div>
      </div>

      {/* Tabla de Logs */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
        <DataTable
          columns={columns}
          data={logs}
          total={totalLogs}
          loading={loading}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          actions={actions}
          emptyMessage="No hay registros de logs para mostrar"
          showSearch={false}
          showPageSizeSelector={true}
          pageSizeOptions={[10, 20, 50, 100]}
          tableClassName="min-w-full"
          isDark={isDark}
        />
      </div>

      {/* Modal de Detalle */}
      <LogsDetalleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        log={selectedLog}
        isDark={isDark}
      />
    </div>
  );
};

export default Logs;
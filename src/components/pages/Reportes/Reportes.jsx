// frontend/src/components/pages/Reportes/Reportes.jsx
import React, { useState, useEffect } from 'react';
import ReportesFilters from './ReportesFilters';
import { reporteService } from '../../../services/reporteService';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

// SVG Iconos inline
const IconDownload = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 1a1 1 0 011 1v9.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 11.586V2a1 1 0 011-1z"/>
    <path d="M3 16a1 1 0 011 1h12a1 1 0 011-1H3z"/>
  </svg>
);

const IconPDF = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
    <path d="M12 2v4h4"/>
    <path d="M6 10h8v1H6zM6 12h8v1H6zM6 14h5v1H6z"/>
  </svg>
);

const IconPrev = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
  </svg>
);

const IconNext = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
  </svg>
);

const Reportes = () => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({
    total_eventos: 0,
    eventos_hoy: 0,
    total_elevadores: 0,
    alarmas_activas: 0,
    eventos_por_tipo: []
  });
  const [eventos, setEventos] = useState([]);
  const [totalEventos, setTotalEventos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    tipo: 'todos',
    fecha_desde: '',
    fecha_hasta: '',
  });
  const pageTitle = useNombreInterfaz('reportes');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  useEffect(() => {
    cargarDatos();
  }, [filters, currentPage, pageSize]);

  const cargarEstadisticas = async () => {
    try {
      const params = {};
      if (filters.fecha_desde) {
        params.fecha_desde = filters.fecha_desde.split('T')[0];
      }
      if (filters.fecha_hasta) {
        params.fecha_hasta = filters.fecha_hasta.split('T')[0];
      }
      const data = await reporteService.getStats(params.fecha_desde, params.fecha_hasta);
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const cargarEventos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.fecha_desde) {
        params.fecha_desde = filters.fecha_desde;
      }
      if (filters.fecha_hasta) {
        params.fecha_hasta = filters.fecha_hasta;
      }
      if (filters.tipo && filters.tipo !== 'todos') {
        params.tipo = filters.tipo;
      }
      
      const data = await reporteService.getEventos(
        params.fecha_desde,
        params.fecha_hasta,
        pageSize,
        (currentPage - 1) * pageSize,
        filters.tipo
      );
      setEventos(data.eventos || []);
      setTotalEventos(data.total || 0);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      setEventos([]);
      setTotalEventos(0);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatos = async () => {
    await Promise.all([cargarEstadisticas(), cargarEventos()]);
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
    });
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const params = {};
      if (filters.fecha_desde) {
        params.fecha_desde = filters.fecha_desde.split('T')[0];
      }
      if (filters.fecha_hasta) {
        params.fecha_hasta = filters.fecha_hasta.split('T')[0];
      }
      const result = await reporteService.exportCSV(params.fecha_desde, params.fecha_hasta);
      if (result) {
        alert(`✅ CSV exportado correctamente`);
      }
    } catch (error) {
      alert('❌ Error al exportar CSV: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const params = {};
      if (filters.fecha_desde) {
        params.fecha_desde = filters.fecha_desde.split('T')[0];
      }
      if (filters.fecha_hasta) {
        params.fecha_hasta = filters.fecha_hasta.split('T')[0];
      }
      const result = await reporteService.exportPDF(params.fecha_desde, params.fecha_hasta);
      if (result) {
        alert(`✅ PDF exportado correctamente`);
      }
    } catch (error) {
      alert('❌ Error al exportar PDF: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.ceil(totalEventos / pageSize);

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Genera reportes del sistema de elevadores
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={exporting || loading}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm ${
              isDark 
                ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
            }`}
          >
            <IconDownload />
            {exporting ? 'Exportando...' : 'CSV'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting || loading}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm ${
              isDark 
                ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
            }`}
          >
            <IconPDF />
            {exporting ? 'Exportando...' : 'PDF'}
          </button>
        </div>
      </div>

      <ReportesFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        isDark={isDark}
      />

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
          Resumen de eventos
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando datos...</span>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Total Eventos</div>
                <div className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{stats.total_eventos}</div>
              </div>
              <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Eventos de Hoy</div>
                <div className="text-2xl font-bold text-green-600">{stats.eventos_hoy}</div>
              </div>
              <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Total Elevadores</div>
                <div className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{stats.total_elevadores}</div>
              </div>
              <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg border`}>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Alarmas Activas</div>
                <div className="text-2xl font-bold text-red-600">{stats.alarmas_activas}</div>
              </div>
            </div>

            {stats.eventos_por_tipo && stats.eventos_por_tipo.length > 0 && (
              <div className="mt-4">
                <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Eventos por tipo</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.eventos_por_tipo.map((item, index) => (
                    <span key={index} className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-cyan-900/30 text-cyan-300' : 'bg-blue-50 text-blue-700'}`}>
                      {item.tipo}: {item.cantidad}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center flex-wrap gap-2`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
            Vista previa de eventos
          </h3>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
            Mostrando {eventos.length} de {totalEventos} eventos
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <span className={isDark ? 'text-gray-400' : 'text-primary-500'}>Cargando eventos...</span>
          </div>
        ) : eventos.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
            No hay eventos para mostrar
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                      Fecha/Hora
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                      Elevador
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                      Descripción
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                      Usuario
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {eventos.map((evento) => (
                    <tr key={evento.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                        {formatDate(evento.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`font-medium text-sm ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                          {evento.elevador_codigo || '-'}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                          {evento.elevador_nombre || ''}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {evento.descripcion || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {evento.usuario || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={`px-6 py-4 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t flex justify-between items-center flex-wrap gap-2`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Página {currentPage} de {totalPages}
                  </span>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className={`ml-4 px-2 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    <option value={5}>5 por página</option>
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                    <option value={50}>50 por página</option>
                    <option value={100}>100 por página</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded-lg transition-colors disabled:opacity-50 ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconPrev />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border rounded-lg transition-colors disabled:opacity-50 ${
                      isDark 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconNext />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reportes;
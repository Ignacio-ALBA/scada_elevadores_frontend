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

  useEffect(() => {
    cargarDatos();
  }, [filters, currentPage, pageSize]);

  //  Cargar estadísticas con filtros
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

  //  Cargar eventos con filtros (igual que exportación)
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

  //  Cargar todos los datos
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

  // Exportar CSV con filtros actuales
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

  // Exportar PDF con filtros actuales
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
          {/* <h1 className="text-2xl font-bold text-primary-500">Reportes</h1> */}
          <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
          <p className="text-text-secondary">
            Genera reportes del sistema de elevadores
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={exporting || loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <IconDownload />
            {exporting ? 'Exportando...' : 'CSV'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting || loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
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
      />

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-primary-500 mb-4">Resumen de eventos</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="text-primary-500">Cargando datos...</span>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-text-muted">Total Eventos</div>
                <div className="text-2xl font-bold text-primary-500">{stats.total_eventos}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-text-muted">Eventos de Hoy</div>
                <div className="text-2xl font-bold text-green-600">{stats.eventos_hoy}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-text-muted">Total Elevadores</div>
                <div className="text-2xl font-bold text-primary-500">{stats.total_elevadores}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-text-muted">Alarmas Activas</div>
                <div className="text-2xl font-bold text-red-600">{stats.alarmas_activas}</div>
              </div>
            </div>

            {stats.eventos_por_tipo && stats.eventos_por_tipo.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-text-secondary mb-2">Eventos por tipo</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.eventos_por_tipo.map((item, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {item.tipo}: {item.cantidad}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
          <h3 className="text-lg font-semibold text-primary-500">Vista previa de eventos</h3>
          <span className="text-sm text-text-muted">
            Mostrando {eventos.length} de {totalEventos} eventos
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <span className="text-primary-500">Cargando eventos...</span>
          </div>
        ) : eventos.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            No hay eventos para mostrar
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Fecha/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Elevador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Usuario
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {eventos.map((evento) => (
                    <tr key={evento.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(evento.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-primary-500 text-sm">
                          {evento.elevador_codigo || '-'}
                        </div>
                        <div className="text-xs text-text-muted">
                          {evento.elevador_nombre || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {evento.descripcion || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {evento.usuario || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-muted">
                    Página {currentPage} de {totalPages}
                  </span>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="ml-4 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IconPrev />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
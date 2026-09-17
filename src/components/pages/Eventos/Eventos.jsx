// frontend/src/components/pages/Eventos/Eventos.jsx
import React, { useState, useEffect } from 'react';
import { eventosService } from '../../../services/eventosService';
import { reporteService } from '../../../services/reporteService';
import EventosFilters from './EventosFilters';
import EventosTable from './EventosTable';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const tipoOptions = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'operacion', label: 'Operación' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'alarmas', label: 'Alarmas' }
];

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [totalEventos, setTotalEventos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    tipo: 'todos',
    fecha_desde: '',
    fecha_hasta: ''
  });
  const pageTitle = useNombreInterfaz('eventos');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

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
      
      const data = await eventosService.getAllWithFilters(
        params.fecha_desde,
        params.fecha_hasta,
        pageSize,
        (currentPage - 1) * pageSize,
        params.tipo
      );
      
      setEventos(data.eventos || []);
      setTotalEventos(data.total || 0);
      
    } catch (error) {
      console.error('Error cargando eventos:', error);
      setEventos([]);
      setTotalEventos(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, [filters, currentPage, pageSize]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      tipo: 'todos',
      fecha_desde: '',
      fecha_hasta: ''
    });
    setCurrentPage(1);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const result = await reporteService.exportCSV(filters.fecha_desde, filters.fecha_hasta);
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
      const result = await reporteService.exportPDF(filters.fecha_desde, filters.fecha_hasta);
      if (result) {
        alert(`✅ PDF exportado correctamente`);
      }
    } catch (error) {
      alert('❌ Error al exportar PDF: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.ceil(totalEventos / pageSize) || 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Historial de eventos del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={exporting || loading}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 text-sm shadow-sm ${
              isDark 
                ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 1a1 1 0 011 1v9.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 11.586V2a1 1 0 011-1z"/>
              <path d="M3 16a1 1 0 011 1h12a1 1 0 011-1H3z"/>
            </svg>
            {exporting ? 'Exportando...' : 'CSV'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting || loading}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 text-sm shadow-sm ${
              isDark 
                ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
              <path d="M12 2v4h4"/>
              <path d="M6 10h8v1H6zM6 12h8v1H6zM6 14h5v1H6z"/>
            </svg>
            {exporting ? 'Exportando...' : 'PDF'}
          </button>
        </div>
      </div>

      <EventosFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        tipoOptions={tipoOptions}
        isDark={isDark}
      />

      <EventosTable
        eventos={eventos}
        loading={loading}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        total={totalEventos}
        isDark={isDark}
      />
    </div>
  );
};

export default Eventos;
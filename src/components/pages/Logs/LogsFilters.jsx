import React from 'react';

// SVG Iconos inline
const IconClose = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
  </svg>
);

const LogsFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tipo de Log */}
        <select
          value={filters.tipo || 'todos'}
          onChange={(e) => onFilterChange('tipo', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="todos">Todos los tipos</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="navegacion">Navegación</option>
          <option value="accion">Acción</option>
          <option value="error">Error</option>
          <option value="auditoria">Auditoría</option>
        </select>

        {/* Usuario */}
        <input
          type="text"
          placeholder="Buscar por usuario..."
          value={filters.usuario || ''}
          onChange={(e) => onFilterChange('usuario', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        {/* Fecha desde */}
        <div className="flex flex-col gap-1">
          <input
            type="datetime-local"
            value={filters.fecha_desde || ''}
            onChange={(e) => onFilterChange('fecha_desde', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-[10px] text-text-muted">Fecha y hora desde</span>
        </div>

        {/* Fecha hasta */}
        <div className="flex flex-col gap-1">
          <input
            type="datetime-local"
            value={filters.fecha_hasta || ''}
            onChange={(e) => onFilterChange('fecha_hasta', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-[10px] text-text-muted">Fecha y hora hasta</span>
        </div>
      </div>

      {/* Botón limpiar */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <IconClose />
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default LogsFilters;

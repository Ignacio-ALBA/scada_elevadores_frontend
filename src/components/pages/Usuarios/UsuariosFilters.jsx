import React from 'react';

// SVG Iconos inline
const IconSearch = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
  </svg>
);

const IconReset = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 5.414 1 1 0 01-1.414-1.414A5.002 5.002 0 004.059 4.1V3a1 1 0 011-1z" clipRule="evenodd"/>
  </svg>
);

const UsuariosFilters = ({ 
  filters, 
  onFilterChange, 
  onReset
}) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-4 space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-xs">
          <label className="block text-sm font-medium text-text-primary mb-2">Búsqueda</label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Buscar por usuario, nombre, email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <IconSearch />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-xs">
          <label className="block text-sm font-medium text-text-primary mb-2">Estado</label>
          <select
            value={filters.activo === undefined ? 'todos' : filters.activo}
            onChange={(e) => onFilterChange('activo', e.target.value === 'todos' ? undefined : e.target.value === 'true')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="todos">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-colors"
          >
            <IconReset />
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuariosFilters;
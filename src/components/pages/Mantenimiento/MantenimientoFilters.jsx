// frontend/src/components/pages/Mantenimiento/MantenimientoFilters.jsx
import React from 'react';

const IconSearch = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M12.9 14.32a8 8 0 111.41-1.41l4.29 4.29a1 1 0 01-1.41 1.41l-4.29-4.29zM8 14A6 6 0 108 2a6 6 0 000 12z"/>
  </svg>
);

const MantenimientoFilters = ({ 
  filters, 
  onFilterChange, 
  onReset,
  tipoOptions,
  estadoOptions
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">
            <IconSearch />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <select
          value={filters.tipo || 'todos'}
          onChange={(e) => onFilterChange('tipo', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {tipoOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={filters.estado || 'todos'}
          onChange={(e) => onFilterChange('estado', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {estadoOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={filters.fecha_desde || ''}
          onChange={(e) => onFilterChange('fecha_desde', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Fecha desde"
        />

        <input
          type="datetime-local"
          value={filters.fecha_hasta || ''}
          onChange={(e) => onFilterChange('fecha_hasta', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Fecha hasta"
        />

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
          </svg>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default MantenimientoFilters;
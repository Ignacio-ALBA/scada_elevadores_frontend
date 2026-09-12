import React from 'react';

// SVG Iconos inline
const IconSearch = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M12.9 14.32a8 8 0 111.41-1.41l4.29 4.29a1 1 0 01-1.41 1.41l-4.29-4.29zM8 14A6 6 0 108 2a6 6 0 000 12z"/>
  </svg>
);

const IconClose = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
  </svg>
);

// Definir opciones
const estadoOptions = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'activa', label: 'Activa' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'resuelta', label: 'Resuelta' },
];

const prioridadOptions = [
  { value: 'todos', label: 'Todas las prioridades' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

const AlarmasFilters = ({ 
  filters = {}, 
  onFilterChange, 
  onReset,
  estadoOptions = [],
  prioridadOptions = []
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda por texto */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por mensaje, elevador..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12.9 14.32a8 8 0 111.41-1.41l4.29 4.29a1 1 0 01-1.41 1.41l-4.29-4.29zM8 14A6 6 0 108 2a6 6 0 000 12z"/>
            </svg>
          </div>
        </div>

        {/* Filtro por Estado */}
        <select
          value={filters.estado || 'todos'}
          onChange={(e) => onFilterChange('estado', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {estadoOptions.length > 0 ? (
            estadoOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))
          ) : (
            <>
              <option value="todos">Todos los estados</option>
              <option value="activa">Activa</option>
              <option value="confirmada">Confirmada</option>
              <option value="resuelta">Resuelta</option>
            </>
          )}
        </select>

        {/* Filtro por Prioridad */}
        <select
          value={filters.prioridad || 'todos'}
          onChange={(e) => onFilterChange('prioridad', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {prioridadOptions.length > 0 ? (
            prioridadOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))
          ) : (
            <>
              <option value="todos">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </>
          )}
        </select>

        {/* Botón limpiar filtros */}
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

export default AlarmasFilters;
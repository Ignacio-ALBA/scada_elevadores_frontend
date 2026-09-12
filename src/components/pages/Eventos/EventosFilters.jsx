// frontend/src/components/pages/Eventos/EventosFilters.jsx
import React from 'react';

const EventosFilters = ({ 
  filters = {}, 
  onFilterChange, 
  onReset,
  tipoOptions = []
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Buscar por descripción, elevador..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />

        <select
          value={filters.tipo || 'todos'}
          onChange={(e) => onFilterChange('tipo', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {tipoOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* ✅ Fecha y hora desde */}
        <div className="flex flex-col gap-1">
          <input
            type="datetime-local"
            value={filters.fecha_desde || ''}
            onChange={(e) => onFilterChange('fecha_desde', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-[10px] text-text-muted">Fecha y hora desde</span>
        </div>

        {/* ✅ Fecha y hora hasta */}
        <div className="flex flex-col gap-1">
          <input
            type="datetime-local"
            value={filters.fecha_hasta || ''}
            onChange={(e) => onFilterChange('fecha_hasta', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-[10px] text-text-muted">Fecha y hora hasta</span>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
            </svg>
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventosFilters;
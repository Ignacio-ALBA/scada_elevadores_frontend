// frontend/src/components/pages/Usuarios/UsuariosFilters.jsx
import React from 'react';

const IconSearch = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M12.9 14.32a8 8 0 111.41-1.41l4.29 4.29a1 1 0 01-1.41 1.41l-4.29-4.29zM8 14A6 6 0 108 2a6 6 0 000 12z"/>
  </svg>
);

const UsuariosFilters = ({ 
  filters, 
  onFilterChange, 
  onReset,
  rolOptions,
  estadoOptions,
  isDark = false
}) => {
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <IconSearch />
          </div>
          <input
            type="text"
            placeholder="Buscar por usuario, nombre..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        </div>

        <select
          value={filters.rol}
          onChange={(e) => onFilterChange('rol', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          {rolOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={filters.estado}
          onChange={(e) => onFilterChange('estado', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          {estadoOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={onReset}
          className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            isDark 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
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

export default UsuariosFilters;
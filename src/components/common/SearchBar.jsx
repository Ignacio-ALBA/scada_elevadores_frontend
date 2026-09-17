// frontend/src/components/common/SearchBar.jsx
import React from 'react';
import { useSafeTheme } from '../../hooks/useSafeTheme';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = 'Buscar...',
  filters = [],
  filterValues = {},
  onFilterChange,
  onClear,
  totalItems = 0,
  filteredItems = 0,
  isDark = false,
  children 
}) => {
  const { temaActual } = useSafeTheme();
  const dark = isDark || temaActual === 'oscuro';

  return (
    <div className={`${dark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl ${dark ? 'shadow-lg shadow-black/50' : 'shadow-card'} mb-6`}>
      <div className="flex flex-wrap items-center gap-4">
        {/* Búsqueda */}
        <div className="flex-1 min-w-[200px] relative">
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12.9 14.32a8 8 0 111.41-1.41l4.29 4.29a1 1 0 01-1.41 1.41l-4.29-4.29zM8 14A6 6 0 108 2a6 6 0 000 12z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              dark 
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
            }`}
          />
          {searchTerm && (
            <button
              onClick={onClear || (() => onSearchChange(''))}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          )}
        </div>

        {/* Filtros dinámicos */}
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filterValues[filter.key] || 'todos'}
            onChange={(e) => onFilterChange && onFilterChange(filter.key, e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${
              dark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            <option value="todos">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}

        {/* Botón limpiar */}
        {(searchTerm || Object.values(filterValues).some(v => v && v !== 'todos')) && (
          <button
            onClick={onClear || (() => {
              onSearchChange('');
              if (onFilterChange) {
                Object.keys(filterValues).forEach(key => {
                  onFilterChange(key, 'todos');
                });
              }
            })}
            className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              dark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
            </svg>
            Limpiar filtros
          </button>
        )}

        {/* Contador */}
        <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} ml-auto`}>
          {searchTerm || Object.values(filterValues).some(v => v && v !== 'todos') 
            ? `Mostrando ${filteredItems} de ${totalItems} registros`
            : `Total: ${totalItems} registros`
          }
        </div>

        {children}
      </div>
    </div>
  );
};

export default SearchBar;
// frontend/src/components/pages/Logs/LogsFilters.jsx
import React from 'react';

const IconClose = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
  </svg>
);

const LogsFilters = ({ filters, onFilterChange, onReset, isDark = false }) => {
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          value={filters.tipo || 'todos'}
          onChange={(e) => onFilterChange('tipo', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-100' 
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          <option value="todos">Todos los tipos</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="navegacion">Navegación</option>
          <option value="accion">Acción</option>
          <option value="error">Error</option>
          <option value="auditoria">Auditoría</option>
        </select>

        <input
          type="text"
          placeholder="Buscar por usuario..."
          value={filters.usuario || ''}
          onChange={(e) => onFilterChange('usuario', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />

        <div className="flex flex-col gap-1">
          <input
            type="datetime-local"
            value={filters.fecha_desde || ''}
            onChange={(e) => onFilterChange('fecha_desde', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
          <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Fecha y hora desde</span>
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="datetime-local"
            value={filters.fecha_hasta || ''}
            onChange={(e) => onFilterChange('fecha_hasta', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
          <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Fecha y hora hasta</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onReset}
          className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm ${
            isDark 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <IconClose />
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default LogsFilters;
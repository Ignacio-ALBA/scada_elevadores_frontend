// frontend/src/components/common/StatCard.jsx
import React from 'react';
import { useSafeTheme } from '../../hooks/useSafeTheme';

const StatCard = ({ icon: Icon, title, value, subtitle, color, onRefresh, loading }) => {
  //  Obtener el tema del localStorage
  const { temaActual } = useSafeTheme();
  const isDark = temaActual === 'oscuro';

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color === 'blue' ? `${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'}` : 
                         color === 'red' ? `${isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-600'}` : 
                         color === 'green' ? `${isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-600'}` : 
                         color === 'yellow' ? `${isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-600'}` : 
                         color === 'cyan' ? `${isDark ? 'bg-cyan-900/50 text-cyan-300' : 'bg-cyan-100 text-cyan-600'}` : 
                         `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}`}>
          <Icon />
        </div>
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`mt-2 text-xs ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors disabled:opacity-50`}
        >
          {loading ? 'Actualizando...' : '🔄 Actualizar'}
        </button>
      )}
    </div>
  );
};

export default StatCard;
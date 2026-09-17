// frontend/src/components/common/ChartCard.jsx
import React from 'react';
import { useSafeTheme } from '../../hooks/useSafeTheme';

const ChartCard = ({ title, children, onRefresh, loading, actions }) => {
  const { temaActual } = useSafeTheme();
  const isDark = temaActual === 'oscuro';

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>{title}</h3>
        <div className="flex items-center gap-2">
          {actions}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className={`text-xs ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors disabled:opacity-50`}
            >
              {loading ? '...' : '🔄'}
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
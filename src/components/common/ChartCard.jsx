// frontend/src/components/common/ChartCard.jsx
import React, { useState } from 'react';

const ChartCard = ({ 
  title, 
  children, 
  onRefresh, 
  loading = false,
  actions = null
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing chart:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">{title}</h3>
        <div className="flex items-center gap-2">
          {actions}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
              title="Actualizar gráfico"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          {loading && (
            <span className="inline-block w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
      <div className={loading ? 'opacity-50' : ''}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
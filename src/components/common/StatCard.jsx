// frontend/src/components/common/StatCard.jsx
import React, { useState } from 'react';

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = 'blue',
  onRefresh,
  loading = false
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing stat card:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const colorClasses = {
    blue: 'bg-blue-50',
    red: 'bg-red-50',
    cyan: 'bg-cyan-50',
    yellow: 'bg-yellow-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50'
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    red: 'text-red-500',
    cyan: 'text-cyan-500',
    yellow: 'text-yellow-500',
    green: 'text-green-500',
    purple: 'text-purple-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 relative">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className={`w-6 h-6 ${iconColorClasses[color] || iconColorClasses.blue}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-primary-500">
            {loading || refreshing ? (
              <span className="inline-block w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              value
            )}
          </p>
          {subtitle && (
            <p className="text-xs text-text-muted">{subtitle}</p>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            title="Actualizar"
          >
            <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default StatCard;
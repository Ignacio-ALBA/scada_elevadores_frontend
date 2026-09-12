// frontend/src/components/common/Container.jsx
import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';

export const Container = ({ children, className = '' }) => {
  const { isDark } = useDarkMode();
  
  return (
    <div className={`${isDark ? 'text-dark' : 'text-light'} ${className}`}>
      {children}
    </div>
  );
};

export const Card = ({ children, className = '' }) => {
  const { isDark } = useDarkMode();
  
  return (
    <div className={`${isDark ? 'card-dark' : 'card-light'} rounded-xl shadow-card p-6 ${className}`}>
      {children}
    </div>
  );
};

export const Table = ({ children, className = '' }) => {
  const { isDark } = useDarkMode();
  
  return (
    <div className={`rounded-xl shadow-card overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-white'} ${className}`}>
      <table className={`w-full ${isDark ? 'table-dark' : 'table-light'}`}>
        {children}
      </table>
    </div>
  );
};
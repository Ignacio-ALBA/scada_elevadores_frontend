// frontend/src/components/pages/InterfazGrafica/vistas/VistaMejorada/icons.jsx
import React from 'react';

export const IconPiso = ({ 
  size = 30, 
  numero, 
  activo = false, 
  color = '#64748b', 
  textColor = '#ffffff',
  isDark = false  
}) => {
  const isGround = numero === 0;
  const label = isGround ? 'PB' : numero;
  
  const circleFill = activo 
    ? (isDark ? '#1e293b' : '#e2e8f0') 
    : (isDark ? '#0f172a' : '#f1f5f9');
  const textColorFinal = activo ? color : (isDark ? '#ffffff' : '#1e293b');
  
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="20" 
        cy="20" 
        r="16" 
        fill={circleFill} 
        stroke={activo ? color : color} 
        strokeWidth="1.5"
      />
      <text 
        x="20" 
        y="23" 
        textAnchor="middle" 
        fontSize={isGround ? 10 : 12} 
        fontWeight="bold" 
        fill={textColorFinal} 
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>
  );
};
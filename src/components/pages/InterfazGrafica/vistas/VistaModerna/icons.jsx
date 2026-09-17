// frontend/src/components/pages/InterfazGrafica/icons.js
import React from 'react';

// ============================================
// ICONO DE ELEVADOR
// ============================================
export const IconElevador = ({ size = 40, color = '#22d3ee', estado = 'normal' }) => {
  const estadoColor = estado === 'normal' ? '#22d3ee' :
                       estado === 'falla' ? '#ef4444' :
                       estado === 'mantenimiento' ? '#eab308' :
                       estado === 'sismo' ? '#f97316' : '#94a3b8';
  
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cuerpo del elevador */}
      <rect x="12" y="8" width="40" height="48" rx="4" fill="#1e293b" stroke={estadoColor} strokeWidth="2"/>
      
      {/* Puertas */}
      <rect x="20" y="14" width="10" height="36" rx="2" fill={estadoColor} opacity="0.3"/>
      <rect x="34" y="14" width="10" height="36" rx="2" fill={estadoColor} opacity="0.3"/>
      
      {/* Línea de puertas */}
      <line x1="30" y1="14" x2="30" y2="50" stroke={estadoColor} strokeWidth="1.5" opacity="0.5"/>
      
      {/* Luz de estado */}
      <circle cx="32" cy="58" r="4" fill={estadoColor} opacity="0.8">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};

// ============================================
// ICONO DE CABINA
// ============================================
export const IconCabina = ({ size = 28, color = '#22d3ee', estado = 'normal', numero = 1 }) => {
  const estadoColor = estado === 'normal' ? '#22d3ee' :
                       estado === 'alerta' ? '#eab308' :
                       estado === 'falla_critica' ? '#ef4444' : '#94a3b8';
  
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Marco de la cabina */}
      <rect x="4" y="4" width="32" height="32" rx="3" fill="#0f172a" stroke={estadoColor} strokeWidth="1.5"/>
      
      {/* Número de cabina */}
      <text x="20" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill={estadoColor} fontFamily="monospace">
        {numero}
      </text>
      
      {/* Indicador de estado */}
      <circle cx="32" cy="8" r="3" fill={estadoColor}>
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
};

// ============================================
// ICONO DE PISO
// ============================================
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
  
  //  Usar isDark para determinar el color de fondo
  const circleFill = activo 
    ? (isDark ? '#1e293b' : '#e2e8f0') 
    : (isDark ? '#0f172a' : '#f1f5f9');
  const textColorFinal = activo ? '#22d3ee' : (isDark ? '#ffffff' : '#1e293b');
  
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="20" 
        cy="20" 
        r="16" 
        fill={circleFill} 
        stroke={activo ? '#22d3ee' : color} 
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
      {activo && (
        <line x1="4" y1="20" x2="10" y2="20" stroke="#22d3ee" strokeWidth="2" opacity="0.5"/>
      )}
    </svg>
  );
};

// ============================================
// ICONO DE RIEL (para la columna del elevador)
// ============================================
export const IconRiel = ({ size = 60, color = '#334155', activo = false }) => {
  const railColor = activo ? '#22d3ee' : color;
  
  return (
    <svg width="12" height={size} viewBox="0 0 12 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Riel principal */}
      <rect x="4" y="0" width="4" height="60" rx="2" fill={railColor} opacity={activo ? 0.6 : 0.3}/>
      
      {/* Rieles laterales */}
      <rect x="0" y="0" width="2" height="60" rx="1" fill={railColor} opacity={activo ? 0.3 : 0.1}/>
      <rect x="10" y="0" width="2" height="60" rx="1" fill={railColor} opacity={activo ? 0.3 : 0.1}/>
    </svg>
  );
};

// ============================================
// ICONO DE ELEVADOR PEQUEÑO (para carrusel)
// ============================================
export const IconElevadorSmall = ({ size = 20, color = '#22d3ee', estado = 'normal' }) => {
  const estadoColor = estado === 'normal' ? '#22d3ee' :
                       estado === 'falla' ? '#ef4444' :
                       estado === 'mantenimiento' ? '#eab308' :
                       estado === 'sismo' ? '#f97316' : '#94a3b8';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2" fill="#1e293b" stroke={estadoColor} strokeWidth="1.5"/>
      <rect x="8" y="6" width="3" height="12" rx="1" fill={estadoColor} opacity="0.4"/>
      <rect x="13" y="6" width="3" height="12" rx="1" fill={estadoColor} opacity="0.4"/>
      <line x1="11" y1="6" x2="11" y2="18" stroke={estadoColor} strokeWidth="1" opacity="0.3"/>
    </svg>
  );
};

// ============================================
// ICONO DE CABINA PEQUEÑA (para carrusel)
// ============================================
export const IconCabinaSmall = ({ size = 16, color = '#22d3ee', estado = 'normal', numero = 1 }) => {
  const estadoColor = estado === 'normal' ? '#22d3ee' :
                       estado === 'alerta' ? '#eab308' :
                       estado === 'falla_critica' ? '#ef4444' : '#94a3b8';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#0f172a" stroke={estadoColor} strokeWidth="1.2"/>
      <text x="12" y="15" textAnchor="middle" fontSize="10" fontWeight="bold" fill={estadoColor} fontFamily="monospace">
        {numero}
      </text>
    </svg>
  );
};

// ============================================
// ICONO DE DIRECCIÓN (para carrusel)
// ============================================
export const IconDireccion = ({ size = 20, sentido = 'frenado' }) => {
  const colors = {
    subiendo: '#22d3ee',
    bajando: '#f97316',
    frenado: '#94a3b8'
  };
  const color = colors[sentido] || '#94a3b8';
  
  if (sentido === 'subiendo') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L4 12H8V20H16V12H20L12 4Z" fill={color} opacity="0.8"/>
        <circle cx="12" cy="12" r="2" fill="white" opacity="0.5"/>
      </svg>
    );
  }
  
  if (sentido === 'bajando') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20L4 12H8V4H16V12H20L12 20Z" fill={color} opacity="0.8"/>
        <circle cx="12" cy="12" r="2" fill="white" opacity="0.5"/>
      </svg>
    );
  }
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="12" height="12" rx="2" fill={color} opacity="0.4"/>
      <circle cx="12" cy="12" r="3" fill={color} opacity="0.8"/>
    </svg>
  );
};

// ============================================
// ICONO DE ESTADO DE ELEVADOR (para carrusel)
// ============================================
export const IconEstado = ({ estado = 'normal', size = 16 }) => {
  const estados = {
    normal: { color: '#22d3ee', label: '✅' },
    falla: { color: '#ef4444', label: '❌' },
    mantenimiento: { color: '#eab308', label: '🔧' },
    sismo: { color: '#f97316', label: '🌊' },
    desconocido: { color: '#94a3b8', label: '❓' }
  };
  
  const info = estados[estado] || estados.desconocido;
  
  return (
    <span className="text-lg" title={estado}>
      {info.label}
    </span>
  );
};
// frontend/src/components/pages/ElevadoresGraficos/InterfaceCard.jsx
import React from 'react';

// SVG Iconos
const IconElevator = () => (
  <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
  </svg>
);

const IconCabina = () => (
  <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
    <path d="M8 8a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1V8z"/>
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 010-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
  </svg>
);

const InterfaceCard = ({ configuracion, onClick }) => {
  const {
    id_configuracion,
    nombre,
    nombre_corto,
    descripcion,
    zona,
    elevadores,
    cabinas,
    orden
  } = configuracion;

  // Contar elevadores y cabinas
  const totalElevadores = elevadores?.length || 0;
  const totalCabinas = cabinas?.length || 0;

  // Obtener colores según el estado
  const getStatusColor = () => {
    if (configuracion.estado === 'activo' && configuracion.activo === true) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = () => {
    if (configuracion.estado === 'activo' && configuracion.activo === true) {
      return 'Activo';
    }
    return 'Inactivo';
  };

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-card hover:shadow-xl transition-all duration-300 
        border border-gray-200 overflow-hidden cursor-pointer
        hover:scale-[1.02] hover:border-primary-300
        ${configuracion.estado === 'inactivo' ? 'opacity-75' : ''}
      `}
      onClick={() => onClick(configuracion)}
    >
      {/* Header con badge de estado */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {nombre_corto || nombre}
          </h3>
          {nombre_corto && nombre !== nombre_corto && (
            <p className="text-sm text-text-muted truncate">{nombre}</p>
          )}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Zona */}
        {zona && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="text-lg">📍</span>
            <span>Zona: {zona}</span>
          </div>
        )}

        {/* Descripción */}
        {descripcion && (
          <p className="text-sm text-text-muted line-clamp-2">
            {descripcion}
          </p>
        )}

        {/* Estadísticas */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <IconElevator />
            <span>{totalElevadores} elevador{totalElevadores !== 1 ? 'es' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <IconCabina />
            <span>{totalCabinas} cabina{totalCabinas !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Orden */}
        {orden !== undefined && orden !== null && (
          <div className="text-xs text-text-muted">
            Orden: {orden}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-text-muted">
          ID: {id_configuracion}
        </span>
        <div className="flex items-center gap-1 text-sm text-primary-500 font-medium">
          Ver interfaz
          <IconArrowRight />
        </div>
      </div>
    </div>
  );
};

export default InterfaceCard;
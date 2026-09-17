// frontend/src/components/pages/ElevadoresGraficos/InterfaceCard.jsx
import React from 'react';

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

const InterfaceCard = ({ configuracion, onClick, isDark }) => {
  const {
    id_configuracion,
    nombre,
    descripcion,
    estado,
    zona,
    plc_origen,
    activo,
    creado_por
  } = configuracion;

  const getStatusColor = () => {
    if (estado === 'activo' && activo) {
      return isDark ? 'bg-green-900/50 text-green-300 border-green-800' : 'bg-green-100 text-green-800 border-green-200';
    }
    return isDark ? 'bg-red-900/50 text-red-300 border-red-800' : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusText = () => {
    if (estado === 'activo' && activo) return 'Activo';
    return 'Inactivo';
  };

  return (
    <div 
      className={`${isDark ? 'bg-gray-800 shadow-lg shadow-black/50' : 'bg-white shadow-card'} 
                 rounded-xl hover:shadow-xl transition-all duration-300 
                 ${isDark ? 'border-gray-700' : 'border-gray-200'} 
                 border overflow-hidden cursor-pointer
                 hover:scale-[1.02] ${isDark ? 'hover:border-cyan-600' : 'hover:border-primary-300'}`}
      onClick={() => onClick(configuracion)}
    >
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'} flex justify-between items-start`}>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-cyan-400' : 'text-gray-800'} truncate`}>
            {nombre}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'} truncate`}>
            {descripcion || 'Sin descripción'}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
          <span className="text-lg">📍</span>
          <span>Zona: {zona || 'No especificada'}</span>
        </div>
        
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'} line-clamp-2`}>
          {descripcion || 'Configuración de interfaz gráfica para elevadores'}
        </p>
        
        <div className="flex items-center gap-4 pt-2">
          <div className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            <IconElevator />
            <span>{configuracion.elevadores?.length || 0} elevadores</span>
          </div>
          <div className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
            <IconCabina />
            <span>{configuracion.cabinas?.length || 0} cabinas</span>
          </div>
        </div>

        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>
          Orden: {configuracion.orden || 0}
        </div>
      </div>

      <div className={`px-4 py-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'} border-t flex justify-between items-center`}>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
          ID: {id_configuracion}
        </span>
        <div className={`flex items-center gap-1 text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
          Ver interfaz
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 010-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default InterfaceCard;
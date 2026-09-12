import React from 'react';

const estadoColors = {
  conectado: 'bg-green-100 text-green-800',
  desconectado: 'bg-red-100 text-red-800',
  error: 'bg-orange-100 text-orange-800',
  configurando: 'bg-yellow-100 text-yellow-800',
};

const estadoLabels = {
  conectado: 'Conectado',
  desconectado: 'Desconectado',
  error: 'Error',
  configurando: 'Configurando...',
};

const getIconForTipo = (tipo) => {
  const icons = {
    modbus: '🔌',
    mqtt: '📡',
    rest: '🌐',
    websocket: '🔗',
    smtp: '✉️',
  };
  return icons[tipo] || '🔌';
};

const IntegracionCard = ({ integracion, onEdit, onDelete, onToggle, tipos }) => {
  const { id, nombre, tipo, descripcion, activa, estado, parametros, ultima_comunicacion } = integracion;

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tipoLabel = tipos.find(t => t.value === tipo)?.label || tipo;

  return (
    <div className={`bg-white rounded-xl shadow-card p-6 border-l-4 ${activa ? 'border-green-500' : 'border-gray-300'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getIconForTipo(tipo)}</span>
          <div>
            <h3 className="text-lg font-semibold text-primary-500">{nombre}</h3>
            <span className="text-xs text-text-muted">{tipoLabel}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColors[estado] || 'bg-gray-100'}`}>
          {estadoLabels[estado] || estado}
        </span>
      </div>

      <p className="text-text-secondary text-sm mt-2">{descripcion}</p>

      <div className="mt-3 space-y-1 text-sm">
        {parametros && Object.keys(parametros).map((key) => (
          <div key={key} className="flex justify-between">
            <span className="text-text-muted">{key}:</span>
            <span className="font-mono text-xs">{String(parametros[key])}</span>
          </div>
        ))}
        <div className="flex justify-between text-xs text-text-muted border-t border-gray-100 pt-2 mt-2">
          <span>Última comunicación: {formatDate(ultima_comunicacion)}</span>
          <span>{activa ? '🟢 Activa' : '🔴 Inactiva'}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onToggle(id)}
          className={`px-3 py-1 rounded-lg text-xs transition-colors ${
            activa 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {activa ? 'Desactivar' : 'Activar'}
        </button>
        <button
          onClick={() => onEdit(integracion)}
          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(id)}
          className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs hover:bg-red-100 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default IntegracionCard;
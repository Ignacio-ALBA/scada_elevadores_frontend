import React, { useState, useEffect } from 'react';

const IntegracionForm = ({ integracion, onSave, onCancel, loading, tipos }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'modbus',
    descripcion: '',
    parametros: {},
  });

  const [paramValues, setParamValues] = useState({});

  useEffect(() => {
    if (integracion) {
      setFormData({
        nombre: integracion.nombre || '',
        tipo: integracion.tipo || 'modbus',
        descripcion: integracion.descripcion || '',
        parametros: integracion.parametros || {},
      });
      setParamValues(integracion.parametros || {});
    }
  }, [integracion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleParamChange = (key, value) => {
    setParamValues({ ...paramValues, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      parametros: paramValues,
    });
  };

  // Parámetros según tipo de integración
  const getParamFields = (tipo) => {
    const params = {
      modbus: [
        { key: 'host', label: 'Host/IP', type: 'text', default: '' },
        { key: 'puerto', label: 'Puerto', type: 'number', default: 502 },
        { key: 'timeout', label: 'Timeout (s)', type: 'number', default: 5 },
      ],
      mqtt: [
        { key: 'host', label: 'Host/IP', type: 'text', default: '' },
        { key: 'puerto', label: 'Puerto', type: 'number', default: 1883 },
        { key: 'usuario', label: 'Usuario', type: 'text', default: '' },
        { key: 'password', label: 'Contraseña', type: 'password', default: '' },
      ],
      rest: [
        { key: 'url', label: 'URL', type: 'text', default: '' },
        { key: 'api_key', label: 'API Key', type: 'password', default: '' },
        { key: 'timeout', label: 'Timeout (s)', type: 'number', default: 10 },
      ],
      smtp: [
        { key: 'host', label: 'Host SMTP', type: 'text', default: '' },
        { key: 'puerto', label: 'Puerto', type: 'number', default: 587 },
        { key: 'usuario', label: 'Usuario', type: 'text', default: '' },
        { key: 'password', label: 'Contraseña', type: 'password', default: '' },
        { key: 'from', label: 'Correo remitente', type: 'text', default: '' },
      ],
      websocket: [
        { key: 'host', label: 'Host/IP', type: 'text', default: '' },
        { key: 'puerto', label: 'Puerto', type: 'number', default: 8080 },
        { key: 'path', label: 'Path', type: 'text', default: '/ws' },
      ],
    };
    return params[tipo] || [];
  };

  const paramFields = getParamFields(formData.tipo);

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ej: Modbus Principal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Tipo *
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {tipos.map((t) => (
              <option key={t.value} value={t.value}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Descripción de la integración..."
          />
        </div>

        {/* Parámetros dinámicos según tipo */}
        {paramFields.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-text-secondary mb-3">Parámetros de conexión</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paramFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={paramValues[field.key] || field.default || ''}
                    onChange={(e) => handleParamChange(field.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Integración'}
        </button>
      </div>
    </form>
  );
};

export default IntegracionForm;
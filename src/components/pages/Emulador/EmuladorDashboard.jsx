import React, { useState, useEffect } from 'react';
import { emuladorService } from '../../../services/emuladorService';

const EmuladorDashboard = () => {
  const [datos, setDatos] = useState(null);
  const [plcs, setPlcs] = useState([]);
  const [plcSeleccionado, setPlcSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [intervalo, setIntervalo] = useState(null);

  useEffect(() => {
    cargarPLCs();
    
    // Actualizar cada 1 segundo
    const interval = setInterval(() => {
      if (plcSeleccionado) {
        cargarDatos(plcSeleccionado);
      }
    }, 1000);
    setIntervalo(interval);
    
    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, []);

  // Cargar datos cuando cambia el PLC seleccionado
  useEffect(() => {
    if (plcSeleccionado) {
      cargarDatos(plcSeleccionado);
    }
  }, [plcSeleccionado]);

  const cargarPLCs = async () => {
    try {
      const data = await emuladorService.obtenerPLCs();
      console.log('PLCs cargados:', data);
      setPlcs(data.plcs || []);
      if (data.plcs && data.plcs.length > 0) {
        setPlcSeleccionado(data.plcs[0].nombre);
      }
    } catch (err) {
      console.error('Error cargando PLCs:', err);
      setError('Error al conectar con el emulador');
    }
  };

  const cargarDatos = async (plc) => {
    if (!plc) return;
    try {
      const data = await emuladorService.obtenerDatos(plc);
      console.log('Datos cargados para', plc, ':', data);
      setDatos(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al obtener datos del emulador');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !datos) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-primary-500">Conectando con el emulador...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-6 rounded-xl shadow-card">
        <h3 className="font-semibold">❌ Error de conexión</h3>
        <p className="text-sm">{error}</p>
        <p className="text-sm mt-2">
          Asegúrate de que el emulador esté corriendo en <strong>http://localhost:8001</strong>
        </p>
      </div>
    );
  }

  // Obtener el PLC actual - puede estar en datos.plc o datos.plcs[plcSeleccionado]
  const plcActual = datos?.plc || datos?.plcs?.[plcSeleccionado];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary-500">Emulador Modbus</h1>
          <p className="text-text-secondary">
            Datos en tiempo real del emulador de PLCs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={plcSeleccionado}
            onChange={(e) => setPlcSeleccionado(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {plcs.map((plc) => (
              <option key={plc.nombre} value={plc.nombre}>
                {plc.nombre} ({plc.edificio})
              </option>
            ))}
          </select>
          <span className="text-sm text-text-muted">
            Actualizado: {datos?.timestamp ? new Date(datos.timestamp).toLocaleTimeString() : '-'}
          </span>
        </div>
      </div>

      {datos && plcActual && (
        <div className="grid grid-cols-1 gap-6">
          {/* Tarjetas de registros principales */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-primary-500 mb-4">
              Registros del PLC
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plcActual.registros && Object.entries(plcActual.registros)
                .filter(([dir]) => {
                  const dec = parseInt(dir);
                  return [40001, 40002, 40003, 40005, 40010].includes(dec);
                })
                .map(([dir, reg]) => (
                  <div key={dir} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-text-muted">{reg.nombre}</div>
                        <div className="text-2xl font-bold text-primary-500">{reg.valor}</div>
                      </div>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                        {reg.hex}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      {reg.descripcion || 'Sin descripción'}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Información del PLC */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-primary-500 mb-4">
              Información del PLC
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-text-muted">Nombre</div>
                <div className="font-medium">{plcActual.nombre || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted">Edificio</div>
                <div className="font-medium">{plcActual.edificio || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted">IP</div>
                <div className="font-mono font-medium">{plcActual.direccion_ip || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-text-muted">Puerto</div>
                <div className="font-medium">{plcActual.puerto || '-'}</div>
              </div>
            </div>
          </div>

          {/* Todas los registros (tabla) */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-primary-500">
                Todos los registros
              </h3>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Direc. Dec</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Direc. Hex</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Acceso</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {plcActual.registros && Object.entries(plcActual.registros)
                    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                    .map(([dir, reg]) => (
                      <tr key={dir} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-mono">{dir}</td>
                        <td className="px-4 py-2 text-sm font-mono">{reg.hex}</td>
                        <td className="px-4 py-2 text-sm">{reg.nombre}</td>
                        <td className="px-4 py-2 text-sm font-mono font-medium">{reg.valor}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            reg.acceso === 'R' ? 'bg-blue-100 text-blue-800' :
                            reg.acceso === 'W' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {reg.acceso}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{reg.tipo}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmuladorDashboard;
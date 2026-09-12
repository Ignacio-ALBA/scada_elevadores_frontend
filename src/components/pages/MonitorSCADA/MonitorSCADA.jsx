// frontend/src/components/pages/MonitorSCADA/MonitorSCADA.jsx
import React, { useState, useEffect } from 'react';
import { emuladorService } from '../../../services/emuladorService';
import { variableScadaService } from '../../../services/variableScadaService';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const MonitorSCADA = () => {
  const [activeTab, setActiveTab] = useState('json');
  const [datosEmulador, setDatosEmulador] = useState(null);
  const [variablesScada, setVariablesScada] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plcSeleccionado, setPlcSeleccionado] = useState('PLC-TorreA-01');
  const [plcs, setPlcs] = useState([]);
  const pageTitle = useNombreInterfaz('monitor');

  useEffect(() => {
    cargarPLCs();
    cargarDatos();
    cargarVariablesScada();
    
    const interval = setInterval(() => {
      cargarDatos();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [plcSeleccionado]);

  const cargarPLCs = async () => {
    try {
      const data = await emuladorService.obtenerPLCs();
      setPlcs(data.plcs || []);
    } catch (error) {
      console.error('Error cargando PLCs:', error);
      setPlcs([
        { nombre: 'PLC-TorreA-01', edificio: 'Torre A' },
        { nombre: 'PLC-TorreA-02', edificio: 'Torre A' },
        { nombre: 'PLC-TorreB-01', edificio: 'Torre B' },
      ]);
    }
  };

  const cargarDatos = async () => {
    try {
      const data = await emuladorService.obtenerDatos(plcSeleccionado);
      setDatosEmulador(data);
    } catch (error) {
      console.error('Error cargando datos del emulador:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarVariablesScada = async () => {
    try {
      const data = await variableScadaService.getAll({ activo: true });
      setVariablesScada(data);
    } catch (error) {
      console.error('Error cargando variables SCADA:', error);
    }
  };

  const obtenerValorVariable = (variable) => {
    if (!datosEmulador || !datosEmulador.plc?.registros) return '--';
    const registro = datosEmulador.plc.registros[variable.direccion_modbus];
    return registro ? registro.valor : '--';
  };

  // Obtener el PLC actual de los datos
  const plcActual = datosEmulador?.plc;

  return (
    <div className="space-y-6">
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
        <nav className="flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'json'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-text-secondary hover:text-primary-500'
            }`}
          >
            📊 Datos JSON
          </button>
          <button
            onClick={() => setActiveTab('scada')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'scada'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-text-secondary hover:text-primary-500'
            }`}
          >
            📋 Variables SCADA
          </button>
          <button
            onClick={() => setActiveTab('tabla')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'tabla'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-text-secondary hover:text-primary-500'
            }`}
          >
            📋 Tabla de Parámetros
          </button>
        </nav>
      </div>

      {/* Contenido */}
      <div className="mt-4">
        {/* Pestaña 1: Datos JSON */}
        {activeTab === 'json' && (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-primary-500">
                Datos JSON del emulador
              </h3>
              <button
                onClick={() => {
                  const jsonStr = JSON.stringify(datosEmulador, null, 2);
                  navigator.clipboard.writeText(jsonStr);
                  alert('✅ JSON copiado al portapapeles');
                }}
                className="px-3 py-1 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition-colors"
              >
                📋 Copiar JSON
              </button>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <pre className="p-4 text-sm font-mono text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(datosEmulador, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Pestaña 2: Variables SCADA */}
        {activeTab === 'scada' && (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-primary-500">
                Variables SCADA con valores en tiempo real
              </h3>
              <span className="text-sm text-text-muted">
                {variablesScada.filter(v => v.activo).length} variables activas
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Título</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">PLC</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Dirección</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Unidad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {variablesScada.filter(v => v.activo).map((variable) => (
                    <tr key={variable.id_variable || variable.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-primary-500">{variable.nombre}</td>
                      <td className="px-4 py-3 text-sm">{variable.titulo}</td>
                      <td className="px-4 py-3 text-sm">{variable.plc_origen}</td>
                      <td className="px-4 py-3 text-sm font-mono">{variable.direccion_modbus}</td>
                      <td className="px-4 py-3 text-sm font-bold text-cyan-600">
                        {obtenerValorVariable(variable)}
                      </td>
                      <td className="px-4 py-3 text-sm">{variable.unidad || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${variable.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {variable.activo ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {variablesScada.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-text-muted">
                        No hay variables SCADA configuradas. Ve a Catálogo → Variables SCADA para crear.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: TABLA DE PARÁMETROS */}
        {
        activeTab === 'tabla' && (
            <div className="space-y-6">
            {/* Encabezado con selector de PLC y timestamp */}
            <div className="flex justify-between items-center">
                <div>
                {/* <h3 className="text-2xl font-bold text-primary-500">Monitor SCADA</h3> */}
                <h3 className="text-lg font-semibold text-primary-500">
                  Variables SCADA con valores en tiempo real
                </h3>
                <p className="text-text-secondary">
                    Visualización de datos en tiempo real del emulador
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
                        {plc.nombre} ({plc.edificio || 'Sin edificio'})
                    </option>
                    ))}
                </select>
                <span className="text-sm text-text-muted">
                    Actualizado: {datosEmulador?.timestamp ? new Date(datosEmulador.timestamp).toLocaleTimeString() : '-'}
                </span>
                </div>
            </div>

            {/* Tabla de Parámetros */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
                <h1 className="text-lg font-semibold text-primary-500">
                    Tabla de Parámetros - {plcSeleccionado}
                </h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-text-muted">
                    {plcActual?.registros ? Object.keys(plcActual.registros).length : 0} registros
                    </span>
                    <button
                    onClick={() => {
                        if (plcActual?.registros) {
                        const registrosArray = Object.entries(plcActual.registros).map(([dir, reg]) => ({
                            direccion: dir,
                            ...reg
                        }));
                        const csvContent = [
                            ['Dirección', 'Hex', 'Nombre', 'Valor', 'Acceso', 'Tipo', 'Descripción'].join(','),
                            ...registrosArray.map(r => 
                            [r.direccion, r.hex, r.nombre, r.valor, r.acceso, r.tipo, r.descripcion].join(',')
                            )
                        ].join('\n');
                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `parametros_${plcSeleccionado}_${new Date().toISOString().split('T')[0]}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                        }
                    }}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                    📥 Exportar CSV
                    </button>
                    <button
                    onClick={() => {
                        if (plcActual?.registros) {
                        const jsonStr = JSON.stringify(plcActual.registros, null, 2);
                        navigator.clipboard.writeText(jsonStr);
                        alert('✅ JSON copiado al portapapeles');
                        }
                    }}
                    className="px-3 py-1 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                    📋 Copiar JSON
                    </button>
                </div>
                </div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Dirección</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Hex</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Valor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Acceso</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Descripción</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {plcActual?.registros ? (
                        Object.entries(plcActual.registros)
                        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                        .map(([dir, reg]) => (
                            <tr key={dir} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm font-mono">{dir}</td>
                            <td className="px-4 py-2 text-sm font-mono">{reg.hex}</td>
                            <td className="px-4 py-2 text-sm">{reg.nombre}</td>
                            <td className="px-4 py-2 text-sm font-mono font-bold text-cyan-600">{reg.valor}</td>
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
                            <td className="px-4 py-2 text-sm text-gray-500 max-w-xs truncate">
                                {reg.descripcion || '-'}
                            </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-text-muted">
                            No hay datos disponibles para este PLC
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-text-muted">
                Última actualización: {datosEmulador?.timestamp ? new Date(datosEmulador.timestamp).toLocaleString() : '-'}
                </div>
            </div>
            </div>
        )
        }
      </div>
    </div>
  );
};

export default MonitorSCADA;
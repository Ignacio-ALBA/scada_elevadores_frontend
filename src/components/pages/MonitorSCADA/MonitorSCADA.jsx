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

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

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

  const plcActual = datosEmulador?.plc;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
          {pageTitle}
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>
          Monitoreo en tiempo real de datos SCADA
        </p>
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'json'
                ? isDark 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-primary-500 text-primary-500'
                : isDark
                  ? 'border-transparent text-gray-400 hover:text-cyan-400'
                  : 'border-transparent text-text-secondary hover:text-primary-500'
            }`}
          >
            📊 Datos JSON
          </button>
          <button
            onClick={() => setActiveTab('scada')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'scada'
                ? isDark 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-primary-500 text-primary-500'
                : isDark
                  ? 'border-transparent text-gray-400 hover:text-cyan-400'
                  : 'border-transparent text-text-secondary hover:text-primary-500'
            }`}
          >
            📋 Variables SCADA
          </button>
          <button
            onClick={() => setActiveTab('tabla')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'tabla'
                ? isDark 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-primary-500 text-primary-500'
                : isDark
                  ? 'border-transparent text-gray-400 hover:text-cyan-400'
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
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
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
              <pre className={`p-4 text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                {JSON.stringify(datosEmulador, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Pestaña 2: Variables SCADA */}
        {activeTab === 'scada' && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                Variables SCADA con valores en tiempo real
              </h3>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                {variablesScada.filter(v => v.activo).length} variables activas
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Nombre</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Título</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>PLC</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Dirección</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Valor</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Unidad</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Estado</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {variablesScada.filter(v => v.activo).map((variable) => (
                    <tr key={variable.id_variable || variable.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{variable.nombre}</td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{variable.titulo}</td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{variable.plc_origen}</td>
                      <td className={`px-4 py-3 text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{variable.direccion_modbus}</td>
                      <td className={`px-4 py-3 text-sm font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {obtenerValorVariable(variable)}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{variable.unidad || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${variable.activo ? (isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800') : (isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')}`}>
                          {variable.activo ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {variablesScada.length === 0 && (
                    <tr>
                      <td colSpan="7" className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
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
        {activeTab === 'tabla' && (
          <div className="space-y-6">
            {/* Encabezado con selector de PLC y timestamp */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'}`}>
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                    Tabla de Parámetros - {plcSeleccionado}
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-text-secondary'} text-sm`}>
                    Visualización de datos en tiempo real del emulador
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    value={plcSeleccionado}
                    onChange={(e) => setPlcSeleccionado(e.target.value)}
                    className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    {plcs.map((plc) => (
                      <option key={plc.nombre} value={plc.nombre}>
                        {plc.nombre} ({plc.edificio || 'Sin edificio'})
                      </option>
                    ))}
                  </select>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Actualizado: {datosEmulador?.timestamp ? new Date(datosEmulador.timestamp).toLocaleTimeString() : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabla de Parámetros */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} overflow-hidden`}>
              <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-wrap justify-between items-center gap-2`}>
                <h1 className={`text-lg font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                  Tabla de Parámetros - {plcSeleccionado}
                </h1>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
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
                  <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Dirección</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Hex</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Nombre</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Valor</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Acceso</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Tipo</th>
                      <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Descripción</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {plcActual?.registros ? (
                      Object.entries(plcActual.registros)
                        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                        .map(([dir, reg]) => (
                          <tr key={dir} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                            <td className={`px-4 py-2 text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{dir}</td>
                            <td className={`px-4 py-2 text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{reg.hex}</td>
                            <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{reg.nombre}</td>
                            <td className={`px-4 py-2 text-sm font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{reg.valor}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                reg.acceso === 'R' ? (isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800') :
                                reg.acceso === 'W' ? (isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800') :
                                (isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800')
                              }`}>
                                {reg.acceso}
                              </span>
                            </td>
                            <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{reg.tipo}</td>
                            <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-xs truncate`}>
                              {reg.descripcion || '-'}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="7" className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                          No hay datos disponibles para este PLC
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className={`p-3 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t text-xs ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                Última actualización: {datosEmulador?.timestamp ? new Date(datosEmulador.timestamp).toLocaleString() : '-'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorSCADA;
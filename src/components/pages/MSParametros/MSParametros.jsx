// frontend/src/components/pages/MSParametros/MSParametros.jsx
import React, { useState, useEffect, useRef } from 'react';
import { emuladorService } from '../../../services/emuladorService';
import { configuracionIGService } from '../../../services/configuracionIGService';
import { variableScadaService } from '../../../services/variableScadaService';
import { useDarkMode } from '../../../hooks/useDarkMode';
import ElevadorDetalle from './ElevadorDetalle';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

// SVG Iconos
const IconRefresh = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
  </svg>
);

const MSParametros = () => {
  const [activeTab, setActiveTab] = useState('json');
  const [plcs, setPlcs] = useState([]);
  const [plcSeleccionado, setPlcSeleccionado] = useState('PLC-TorreA-01');
  const [datosEmulador, setDatosEmulador] = useState(null);
  const [variablesScada, setVariablesScada] = useState([]);
  const [parametrosElevador, setParametrosElevador] = useState([]);
  const [parametrosCabina, setParametrosCabina] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [elevadoresExpandidos, setElevadoresExpandidos] = useState({});
  const [jsonRaw, setJsonRaw] = useState('');
  const [registrosTabla, setRegistrosTabla] = useState([]);
  const intervalRef = useRef(null);
  const { isDark } = useDarkMode();
  const pageTitle = useNombreInterfaz('ms_parametros');

  // Mapeo de estados
  const ESTADOS_ELEVADOR = {
    0: { label: 'Falla', color: 'text-red-500 bg-red-500/10' },
    1: { label: 'Contraincendio', color: 'text-orange-500 bg-orange-500/10' },
    2: { label: 'Otro', color: 'text-yellow-500 bg-yellow-500/10' },
    3: { label: 'Normal', color: 'text-green-500 bg-green-500/10' },
    4: { label: 'Sismo', color: 'text-purple-500 bg-purple-500/10' }
  };

  const ESTADOS_CABINA = {
    0: { label: 'Normal', color: 'text-green-500 bg-green-500/10' },
    1: { label: 'Alerta', color: 'text-yellow-500 bg-yellow-500/10' },
    2: { label: 'Falla Crítica', color: 'text-red-500 bg-red-500/10' }
  };

  const SENTIDOS = {
    0: { label: 'Frenado', icon: '⏹️' },
    1: { label: 'Subiendo', icon: '⬆️' },
    2: { label: 'Bajando', icon: '⬇️' }
  };

  useEffect(() => {
    cargarPLCs();
    cargarVariablesScada();
    cargarParametros();

    const interval = setInterval(() => {
      cargarDatosEmulador();
    }, 1000);

    intervalRef.current = interval;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (plcSeleccionado) {
      cargarDatosEmulador();
    }
  }, [plcSeleccionado]);

  const cargarPLCs = async () => {
    try {
      const data = await emuladorService.obtenerPLCs();
      setPlcs(data.plcs || []);
      if (data.plcs && data.plcs.length > 0) {
        setPlcSeleccionado(data.plcs[0].nombre);
      }
    } catch (error) {
      console.error('Error cargando PLCs:', error);
      setPlcs([
        { nombre: 'PLC-TorreA-01', edificio: 'Torre A' },
        { nombre: 'PLC-TorreA-02', edificio: 'Torre A' },
        { nombre: 'PLC-TorreB-01', edificio: 'Torre B' }
      ]);
    }
  };

  const cargarVariablesScada = async () => {
    try {
      const data = await variableScadaService.getAll({ activo: true, limit: 500 });
      setVariablesScada(data);
    } catch (error) {
      console.error('Error cargando variables SCADA:', error);
    }
  };

  const cargarParametros = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5290/api';
      const response = await fetch(`${API_URL}/parametros-elevador/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setParametrosElevador(data);
      }
    } catch (error) {
      console.error('Error cargando parámetros:', error);
    }

    try {
      const response = await fetch(`${API_URL}/parametros-cabina/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setParametrosCabina(data);
      }
    } catch (error) {
      console.error('Error cargando parámetros de cabina:', error);
    }
  };

  const cargarDatosEmulador = async () => {
    try {
      const data = await emuladorService.obtenerDatos(plcSeleccionado);
      setDatosEmulador(data);
      setJsonRaw(JSON.stringify(data, null, 2));
      setLastUpdate(new Date());
      setError(null);
      
      if (data?.plc?.registros) {
        const registrosArray = Object.entries(data.plc.registros).map(([dir, info]) => ({
          direccion: dir,
          hex: info.hex || hex(parseInt(dir)).toUpperCase(),
          nombre: info.nombre || `Registro_${dir}`,
          valor: info.valor,
          acceso: info.acceso || 'R',
          tipo: info.tipo || 'uint16',
          descripcion: info.descripcion || ''
        }));
        registrosArray.sort((a, b) => parseInt(a.direccion) - parseInt(b.direccion));
        setRegistrosTabla(registrosArray);
      }
    } catch (error) {
      console.error('Error cargando datos del emulador:', error);
      setError('Error al cargar datos del emulador');
    } finally {
      setLoading(false);
    }
  };

  const toggleElevadorExpandido = (elevadorId) => {
    setElevadoresExpandidos(prev => ({
      ...prev,
      [elevadorId]: !prev[elevadorId]
    }));
  };

  const getValorVariable = (direccionModbus) => {
    if (!datosEmulador?.plc?.registros) return '--';
    const registro = datosEmulador.plc.registros[direccionModbus];
    return registro ? registro.valor : '--';
  };

  const getRegistroInfo = (direccionModbus) => {
    if (!datosEmulador?.plc?.registros) return null;
    return datosEmulador.plc.registros[direccionModbus] || null;
  };

  const hex = (num) => {
    return '0x' + num.toString(16).toUpperCase();
  };

  // Agrupar variables SCADA por elevador
  const variablesPorElevador = {};
  variablesScada.forEach(v => {
    const match = v.nombre.match(/^([A-Z]+-\d+)/);
    if (match) {
      const codigo = match[1];
      if (!variablesPorElevador[codigo]) {
        variablesPorElevador[codigo] = [];
      }
      variablesPorElevador[codigo].push(v);
    }
  });

  const codigosElevadores = Object.keys(variablesPorElevador).sort();

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`space-y-6 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      {/* Header */}
      <div className={`flex justify-between items-center flex-wrap gap-4 ${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-xl shadow-card p-4`}>
        <div>
          {/* <h1 className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
            📊 MS Parámetros
          </h1> */}
          <h1 className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{pageTitle}</h1>
          <p className={isDark ? 'text-slate-400' : 'text-text-secondary'}>
            Monitoreo en tiempo real de variables SCADA por elevador y cabina
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={plcSeleccionado}
            onChange={(e) => setPlcSeleccionado(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${
              isDark 
                ? 'bg-slate-700 border-slate-600 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            {plcs.map((plc) => (
              <option key={plc.nombre} value={plc.nombre}>
                {plc.nombre} ({plc.edificio || 'Sin edificio'})
              </option>
            ))}
          </select>
          <button
            onClick={cargarDatosEmulador}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
              isDark 
                ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                : 'bg-primary-500 text-white hover:bg-primary-700'
            }`}
          >
            <IconRefresh />
            Actualizar
          </button>
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-text-muted'}`}>
            Última actualización: {lastUpdate ? lastUpdate.toLocaleTimeString() : '--'}
          </span>
        </div>
      </div>

      {/* Estado de conexión */}
      {datosEmulador && (
        <div className={`flex items-center gap-2 ${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-xl shadow-card px-4 py-2`}>
          <div className={`w-3 h-3 rounded-full ${datosEmulador ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-text-secondary'}`}>
            {datosEmulador ? '🟢 Conectado' : '🔴 Desconectado'}
          </span>
          <span className={`text-sm ml-4 ${isDark ? 'text-slate-400' : 'text-text-muted'}`}>
            Registros: {datosEmulador?.plc?.registros ? Object.keys(datosEmulador.plc.registros).length : 0}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('json')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'json'
                ? isDark 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-primary-500 text-primary-500'
                : isDark
                  ? 'border-transparent text-slate-400 hover:text-slate-200'
                  : 'border-transparent text-text-secondary hover:text-primary-500'
            }`}
          >
            📄 JSON
          </button>
          <button
            onClick={() => setActiveTab('tabla_registros')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'tabla_registros'
                ? isDark 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-primary-500 text-primary-500'
                : isDark
                  ? 'border-transparent text-slate-400 hover:text-slate-200'
                  : 'border-transparent text-text-secondary hover:text-primary-500'
            }`}
          >
            📋 Tabla de Registros
          </button>
          <button
            onClick={() => setActiveTab('tabla')}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'tabla'
                ? isDark 
                  ? 'border-cyan-400 text-cyan-400' 
                  : 'border-primary-500 text-primary-500'
                : isDark
                  ? 'border-transparent text-slate-400 hover:text-slate-200'
                  : 'border-transparent text-text-secondary hover:text-primary-500'
            }`}
          >
            📊 Por Elevadores
          </button>
        </nav>
      </div>

      {/* Contenido */}
      <div className="mt-4">
        {/* Pestaña 1: JSON */}
        {activeTab === 'json' && (
          <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-xl shadow-card overflow-hidden`}>
            <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-center flex-wrap gap-2`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                Datos JSON del emulador - {plcSeleccionado}
              </h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(jsonRaw);
                    alert('✅ JSON copiado al portapapeles');
                  }}
                  className="px-3 py-1 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  📋 Copiar JSON
                </button>
                <button
                  onClick={cargarDatosEmulador}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    isDark 
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                      : 'bg-primary-500 text-white hover:bg-primary-700'
                  }`}
                >
                  🔄 Actualizar
                </button>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto bg-slate-900">
              <pre className="p-4 text-sm font-mono text-green-400 whitespace-pre-wrap">
                {jsonRaw || 'Cargando datos...'}
              </pre>
            </div>
            <div className={`p-3 border-t text-xs ${isDark ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-text-muted'}`}>
              Actualización automática cada 1 segundo. Última actualización: {lastUpdate ? lastUpdate.toLocaleString() : '-'}
            </div>
          </div>
        )}

        {/* Pestaña 2: Tabla de Registros */}
        {activeTab === 'tabla_registros' && (
          <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-xl shadow-card overflow-hidden`}>
            <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-center flex-wrap gap-2`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                Registros Modbus - {plcSeleccionado}
              </h3>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-text-muted'}`}>
                {registrosTabla.length} registros
              </span>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className={`${isDark ? 'bg-slate-700' : 'bg-gray-50'} sticky top-0`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-text-secondary'}`}>Dirección</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-text-secondary'}`}>Hex</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-text-secondary'}`}>Nombre</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-text-secondary'}`}>Valor</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-text-secondary'}`}>Acceso</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-text-secondary'}`}>Tipo</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-text-secondary'}`}>Descripción</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {registrosTabla.map((reg) => (
                    <tr key={reg.direccion} className={isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}>
                      <td className={`px-4 py-2 text-sm font-mono ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{reg.direccion}</td>
                      <td className={`px-4 py-2 text-sm font-mono ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{reg.hex}</td>
                      <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{reg.nombre}</td>
                      <td className={`px-4 py-2 text-sm font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{reg.valor}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          reg.acceso === 'R' ? 'bg-blue-100 text-blue-800' :
                          reg.acceso === 'W' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {reg.acceso}
                        </span>
                      </td>
                      <td className={`px-4 py-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{reg.tipo}</td>
                      <td className={`px-4 py-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-400'} max-w-xs truncate`}>
                        {reg.descripcion || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`p-3 border-t text-xs ${isDark ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-text-muted'}`}>
              Mostrando {registrosTabla.length} registros. Actualización automática cada 1 segundo.
            </div>
          </div>
        )}

        {/* Pestaña 3: Por Elevadores */}
        {activeTab === 'tabla' && (
          <div className="grid grid-cols-1 gap-4">
            {codigosElevadores.length === 0 ? (
              <div className={`${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-white text-text-muted'} rounded-xl shadow-card p-8 text-center`}>
                No hay variables SCADA configuradas para este PLC
              </div>
            ) : (
              codigosElevadores.map((codigo) => {
                const variables = variablesPorElevador[codigo] || [];
                const isExpandido = elevadoresExpandidos[codigo] || false;
                
                return (
                  <ElevadorDetalle
                    key={codigo}
                    codigo={codigo}
                    variables={variables}
                    datosEmulador={datosEmulador}
                    isExpandido={isExpandido}
                    onToggle={() => toggleElevadorExpandido(codigo)}
                    ESTADOS_ELEVADOR={ESTADOS_ELEVADOR}
                    ESTADOS_CABINA={ESTADOS_CABINA}
                    SENTIDOS={SENTIDOS}
                    getValorVariable={getValorVariable}
                    getRegistroInfo={getRegistroInfo}
                    isDark={isDark}
                  />
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MSParametros;
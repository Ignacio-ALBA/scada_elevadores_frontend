// frontend/src/components/pages/Catalogo/VinculacionParametros.jsx
import React, { useState, useEffect } from 'react';
import { parametroElevadorService } from '../../../services/parametroElevadorService';
import { parametroCabinaService } from '../../../services/parametroCabinaService';
import { configuracionIGService } from '../../../services/configuracionIGService';
import { useSafeTheme } from '../../../hooks/useSafeTheme';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const VinculacionParametros = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [selectedConfiguracion, setSelectedConfiguracion] = useState(null);
  const [parametrosElevador, setParametrosElevador] = useState([]);
  const [parametrosCabina, setParametrosCabina] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageTitle = useNombreInterfaz('vinculacion_parametros');
  
  // ✅ Obtener tema
  const { temaActual } = useSafeTheme();
  const isDark = temaActual === 'oscuro';

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [configsData] = await Promise.all([
        configuracionIGService.getAll({ activo: true }),
      ]);
      setConfiguraciones(configsData);
      if (configsData.length > 0) {
        setSelectedConfiguracion(configsData[0]);
        await cargarParametros(configsData[0].id_configuracion);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarParametros = async (idConfiguracion) => {
    try {
      const [elevadorData, cabinaData] = await Promise.all([
        parametroElevadorService.getAll({ activo: true }),
        parametroCabinaService.getByConfiguracion(idConfiguracion)
      ]);
      setParametrosElevador(elevadorData || []);
      setParametrosCabina(cabinaData || []);
    } catch (error) {
      console.error('Error cargando parámetros:', error);
      // ✅ Si hay error 404, solo mostrar array vacío
      if (error.response?.status === 404) {
        setParametrosCabina([]);
      } else {
        setError('Error al cargar los parámetros');
      }
    }
  };

  const handleConfigChange = (e) => {
    const id = parseInt(e.target.value);
    const config = configuraciones.find(c => c.id_configuracion === id);
    setSelectedConfiguracion(config);
    if (config) {
      cargarParametros(config.id_configuracion);
    }
  };

  // ✅ Obtener colores del tema para estilos
  const getCardStyles = () => ({
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    textColor: isDark ? '#f3f4f6' : '#1f2937',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    hoverBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
  });

  const styles = getCardStyles();

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${isDark ? 'border-cyan-400' : 'border-primary-500'}`}></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen p-6`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Vincula parámetros de elevadores y cabinas con interfaces gráficas
          </p>
        </div>
      </div>

      {/* Selector de configuración */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
          Seleccionar configuración:
        </label>
        <select
          value={selectedConfiguracion?.id_configuracion || ''}
          onChange={handleConfigChange}
          className={`w-full max-w-md px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-cyan-400' 
              : 'bg-white border-gray-300 text-gray-800 focus:ring-primary-500'
          }`}
        >
          {configuraciones.map((config) => (
            <option key={config.id_configuracion} value={config.id_configuracion}>
              {config.nombre} {config.zona ? `- ${config.zona}` : ''}
            </option>
          ))}
        </select>
        {selectedConfiguracion && (
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
            {selectedConfiguracion.descripcion || 'Sin descripción'}
          </p>
        )}
      </div>

      {/* Parámetros de Elevador */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
          Parámetros de Elevador
        </h2>
        {parametrosElevador.length === 0 ? (
          <p className={isDark ? 'text-gray-400' : 'text-text-muted'}>No hay parámetros de elevador disponibles</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Nombre</th>
                  <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Variable SCADA</th>
                  <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Unidad</th>
                  <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Estado</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {parametrosElevador.slice(0, 10).map((param) => (
                  <tr key={param.id_parametro || param.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{param.nombre}</td>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{param.variable_scada_nombre || '-'}</td>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{param.unidad || '-'}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        param.activo 
                          ? isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                          : isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'
                      }`}>
                        {param.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parametrosElevador.length > 10 && (
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                Mostrando 10 de {parametrosElevador.length} parámetros
              </p>
            )}
          </div>
        )}
      </div>

      {/* Parámetros de Cabina */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
          Parámetros de Cabina
        </h2>
        {parametrosCabina.length === 0 ? (
          <p className={isDark ? 'text-gray-400' : 'text-text-muted'}>
            {parametrosCabina.error ? 'Error al cargar parámetros de cabina' : 'No hay parámetros de cabina para esta configuración'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Nombre</th>
                  <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Variable SCADA</th>
                  <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Unidad</th>
                  <th className={`px-4 py-2 text-left text-xs font-medium uppercase ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Estado</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {parametrosCabina.slice(0, 10).map((param) => (
                  <tr key={param.id_parametro || param.id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{param.nombre}</td>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{param.variable_scada_nombre || '-'}</td>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{param.unidad || '-'}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        param.activo 
                          ? isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                          : isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'
                      }`}>
                        {param.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parametrosCabina.length > 10 && (
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                Mostrando 10 de {parametrosCabina.length} parámetros
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VinculacionParametros;
// frontend/src/components/pages/Catalogo/VinculacionParametros.jsx
import React, { useState, useEffect } from 'react';
import { configuracionIGService } from '../../../services/configuracionIGService';
import { variableScadaService } from '../../../services/variableScadaService';
import { parametroElevadorService } from '../../../services/parametroElevadorService';
import { parametroCabinaService } from '../../../services/parametroCabinaService';
import { usePermisos } from '../../../context/PermisoContext';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const VinculacionParametros = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [configSeleccionada, setConfigSeleccionada] = useState(null);
  const [variablesScada, setVariablesScada] = useState([]);
  const [parametrosElevador, setParametrosElevador] = useState([]);
  const [parametrosCabina, setParametrosCabina] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [editando, setEditando] = useState(null);
  const { puedeEditar } = usePermisos();
  const pageTitle = useNombreInterfaz('vinculacion_parametros');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [configs, variables] = await Promise.all([
        configuracionIGService.getAll({ activo: true }),
        variableScadaService.getAll({ activo: true })
      ]);
      setConfiguraciones(configs);
      setVariablesScada(variables);
      if (configs.length > 0) {
        setConfigSeleccionada(configs[0]);
        await cargarParametros(configs[0].id_configuracion);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos' });
    } finally {
      setLoading(false);
    }
  };

  const cargarParametros = async (configId) => {
    try {
      // Obtener parámetros de elevadores y cabinas de esta configuración
      const [paramsElev, paramsCab] = await Promise.all([
        parametroElevadorService.getByConfiguracion(configId),
        parametroCabinaService.getByConfiguracion(configId)
      ]);
      setParametrosElevador(paramsElev);
      setParametrosCabina(paramsCab);
    } catch (error) {
      console.error('Error cargando parámetros:', error);
    }
  };

  const handleConfigChange = (e) => {
    const configId = parseInt(e.target.value);
    const config = configuraciones.find(c => c.id_configuracion === configId);
    setConfigSeleccionada(config);
    cargarParametros(configId);
  };

  const handleVincular = async (tipo, id, variableId) => {
    try {
      if (tipo === 'elevador') {
        await parametroElevadorService.update(id, { variable_scada_id: variableId || null });
      } else {
        await parametroCabinaService.update(id, { variable_scada_id: variableId || null });
      }
      await cargarParametros(configSeleccionada.id_configuracion);
      setMessage({ type: 'success', text: 'Vinculación actualizada correctamente' });
    } catch (error) {
      console.error('Error vinculando:', error);
      setMessage({ type: 'error', text: 'Error al vincular el parámetro' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  // Obtener variables SCADA disponibles para un parámetro específico
  const getVariablesDisponibles = (parametro) => {
    // Filtrar variables que coincidan con el nombre del parámetro
    const nombreBuscar = parametro.nombre.toLowerCase();
    return variablesScada.filter(v => 
      v.nombre.toLowerCase().includes(nombreBuscar) ||
      v.titulo.toLowerCase().includes(nombreBuscar)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-primary-500">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {/* <h1 className="text-2xl font-bold text-primary-500">Vinculación de Parámetros</h1> */}
        <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
        <p className="text-text-secondary">
          Vincula los parámetros de elevadores y cabinas con las variables SCADA del emulador
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Selector de Configuración IG */}
      <div className="bg-white rounded-xl shadow-card p-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Seleccionar Interfaz Gráfica
        </label>
        <select
          value={configSeleccionada?.id_configuracion || ''}
          onChange={handleConfigChange}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {configuraciones.map(c => (
            <option key={c.id_configuracion} value={c.id_configuracion}>
              {c.nombre} ({c.elevadores?.length || 0} elevadores)
            </option>
          ))}
        </select>
      </div>

      {/* Parámetros de Elevadores */}
      {parametrosElevador.length > 0 && (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-primary-500">
              Parámetros de Elevadores
              <span className="ml-2 text-sm font-normal text-text-muted">
                ({parametrosElevador.length})
              </span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Elevador</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Parámetro</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Variable SCADA</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parametrosElevador.map((p) => {
                  const variablesDisponibles = getVariablesDisponibles(p);
                  const variableActual = variablesScada.find(v => v.id_variable === p.variable_scada_id);
                  
                  return (
                    <tr key={p.id_parametro} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {p.elevador_nombre || `Elevador ${p.id_elevador}`}
                      </td>
                      <td className="px-4 py-3 text-sm">{p.nombre}</td>
                      <td className="px-4 py-3 text-sm">
                        {variableActual ? (
                          <span className="text-cyan-600 font-mono">
                            {variableActual.nombre} ({variableActual.direccion_modbus})
                          </span>
                        ) : (
                          <span className="text-red-400">No vinculado</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={p.variable_scada_id || ''}
                          onChange={(e) => handleVincular('elevador', p.id_parametro, parseInt(e.target.value) || null)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled={!puedeEditar('configuracion_ig')}
                        >
                          <option value="">Seleccionar...</option>
                          {variablesDisponibles.map(v => (
                            <option key={v.id_variable} value={v.id_variable}>
                              {v.nombre} ({v.direccion_modbus})
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Parámetros de Cabinas */}
      {parametrosCabina.length > 0 && (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-primary-500">
              Parámetros de Cabinas
              <span className="ml-2 text-sm font-normal text-text-muted">
                ({parametrosCabina.length})
              </span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Cabina</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Parámetro</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Variable SCADA</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parametrosCabina.map((p) => {
                  const variablesDisponibles = getVariablesDisponibles(p);
                  const variableActual = variablesScada.find(v => v.id_variable === p.variable_scada_id);
                  
                  return (
                    <tr key={p.id_parametro} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {p.cabina_nombre || `Cabina ${p.id_cabina}`}
                      </td>
                      <td className="px-4 py-3 text-sm">{p.nombre}</td>
                      <td className="px-4 py-3 text-sm">
                        {variableActual ? (
                          <span className="text-cyan-600 font-mono">
                            {variableActual.nombre} ({variableActual.direccion_modbus})
                          </span>
                        ) : (
                          <span className="text-red-400">No vinculado</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={p.variable_scada_id || ''}
                          onChange={(e) => handleVincular('cabina', p.id_parametro, parseInt(e.target.value) || null)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled={!puedeEditar('configuracion_ig')}
                        >
                          <option value="">Seleccionar...</option>
                          {variablesDisponibles.map(v => (
                            <option key={v.id_variable} value={v.id_variable}>
                              {v.nombre} ({v.direccion_modbus})
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {parametrosElevador.length === 0 && parametrosCabina.length === 0 && (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <p className="text-text-muted">No hay parámetros para vincular en esta configuración</p>
        </div>
      )}
    </div>
  );
};

export default VinculacionParametros;
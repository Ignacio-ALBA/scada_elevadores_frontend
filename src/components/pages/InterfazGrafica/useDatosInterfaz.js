// frontend/src/components/pages/InterfazGrafica/useDatosInterfaz.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { configuracionIGService } from '../../../services/configuracionIGService';
import { emuladorService } from '../../../services/emuladorService';
import { variableScadaService } from '../../../services/variableScadaService';

export const useDatosInterfaz = (configId) => {
  const [configuracion, setConfiguracion] = useState(null);
  const [variablesScada, setVariablesScada] = useState([]);
  const [datosEmulador, setDatosEmulador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [valoresElevadores, setValoresElevadores] = useState({});
  
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  const cargarDatosRef = useRef(null);

  const ESTADOS_ELEVADOR = {
    0: 'falla',
    1: 'contraincendio',
    2: 'otro',
    3: 'normal',
    4: 'sismo'
  };

  const ESTADOS_CABINA = {
    0: 'normal',
    1: 'alerta',
    2: 'falla_critica'
  };

  const SENTIDOS = {
    0: 'frenado',
    1: 'subiendo',
    2: 'bajando'
  };

  const actualizarValores = useCallback((data) => {
    if (!data?.plc?.registros || !configuracion?.elevadores) {
      return;
    }

    const registros = data.plc.registros;
    const nuevosValores = {};
    
    configuracion.elevadores.forEach((elevador, index) => {
      const baseDir = 40001 + index * 20;
      
      const estadoVal = registros[baseDir]?.valor ?? 0;
      const pisoVal = registros[baseDir + 1]?.valor ?? 0;
      const sentidoVal = registros[baseDir + 2]?.valor ?? 0;
      const destinoVal = registros[baseDir + 3]?.valor ?? 0;
      
      const elevadorData = {
        id: elevador.id,
        nombre: elevador.nombre,
        codigo: elevador.codigo,
        estado: ESTADOS_ELEVADOR[estadoVal] || 'desconocido',
        piso_actual: pisoVal,
        piso_destino: destinoVal,
        sentido: SENTIDOS[sentidoVal] || 'frenado',
        cabinas: []
      };

      for (let j = 0; j < 2; j++) {
        const cabinaBase = baseDir + 4 + j * 4;
        const pisoCabina = registros[cabinaBase]?.valor;
        const destinoCabina = registros[cabinaBase + 1]?.valor;
        const estatusCabina = registros[cabinaBase + 2]?.valor;
        const sentidoCabina = registros[cabinaBase + 3]?.valor;
        
        if (pisoCabina !== undefined) {
          elevadorData.cabinas.push({
            nombre: `Cabina ${j + 1}`,
            piso_actual: pisoCabina || 0,
            piso_destino: destinoCabina || 0,
            estado: ESTADOS_CABINA[estatusCabina || 0] || 'normal',
            sentido: SENTIDOS[sentidoCabina || 0] || 'frenado'
          });
        }
      }

      nuevosValores[elevador.id] = elevadorData;
    });

    setValoresElevadores(nuevosValores);
  }, [configuracion]);

  const cargarDatosEmulador = useCallback(async () => {
    if (!configuracion?.plc_origen || !mountedRef.current) return;
    
    try {
      const data = await emuladorService.obtenerDatos(configuracion.plc_origen);
      if (data && data.plc && data.plc.registros) {
        setDatosEmulador(data);
        actualizarValores(data);
      }
    } catch (err) {
      console.error('❌ Error cargando datos del emulador:', err);
    }
  }, [configuracion, actualizarValores]);

  useEffect(() => {
    cargarDatosRef.current = cargarDatosEmulador;
  }, [cargarDatosEmulador]);

  useEffect(() => {
    if (!configId) {
      setLoading(false);
      return;
    }

    mountedRef.current = true;
    
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        
        const config = await configuracionIGService.getDatosInterfaz(configId);
        setConfiguracion(config);
        
        const variables = await variableScadaService.getAll({ activo: true, limit: 500 });
        setVariablesScada(variables);
        
        const inicial = {};
        if (config?.elevadores) {
          config.elevadores.forEach(e => {
            inicial[e.id] = {
              id: e.id,
              nombre: e.nombre,
              codigo: e.codigo,
              estado: 'desconocido',
              piso_actual: 0,
              piso_destino: 0,
              sentido: 'frenado',
              cabinas: []
            };
          });
        }
        setValoresElevadores(inicial);
        
        if (config?.plc_origen) {
          await cargarDatosEmulador();
        }
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          if (mountedRef.current && cargarDatosRef.current) {
            cargarDatosRef.current();
          }
        }, 1000);
        
      } catch (err) {
        console.error('❌ Error cargando datos iniciales:', err);
        setError(err.message || 'Error al cargar la interfaz');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [configId]);

  return {
    configuracion,
    variablesScada,
    datosEmulador,
    loading,
    error,
    valoresElevadores,
    actualizarDatos: cargarDatosEmulador
  };
};

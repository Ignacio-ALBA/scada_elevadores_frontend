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

  // ============================================
  // FUNCIÓN PARA ACTUALIZAR VALORES
  // ============================================
  const actualizarValores = useCallback((data) => {
    if (!data?.plc?.registros || !configuracion?.elevadores) {
      console.log('⚠️ No hay datos o configuración');
      return;
    }

    const registros = data.plc.registros;
    // console.log('🔄 Procesando registros:', Object.keys(registros).length);
    
    const nuevosValores = {};
    
    configuracion.elevadores.forEach((elevador, index) => {
      // Calcular dirección base usando el índice
      const baseDir = 40001 + index * 20;
      
      // Obtener valores de los registros
      const estadoVal = registros[baseDir]?.valor ?? 0;
      const pisoVal = registros[baseDir + 1]?.valor ?? 0;
      const sentidoVal = registros[baseDir + 2]?.valor ?? 0;
      const destinoVal = registros[baseDir + 3]?.valor ?? 0;
      
      // Crear datos del elevador
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

      // Procesar cabinas
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
      
      // Log para debugging
      // if (index === 0) {
      //   console.log(`📊 ${elevador.codigo}: Estado=${estadoVal}, Piso=${pisoVal}, Sentido=${sentidoVal}, Cabinas=${elevadorData.cabinas.length}`);
      // }
    });

    // console.log('✅ Datos actualizados para', Object.keys(nuevosValores).length, 'elevadores');
    setValoresElevadores(nuevosValores);
  }, [configuracion]);

  // ============================================
  // FUNCIÓN PARA CARGAR DATOS DEL EMULADOR
  // ============================================
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

  // ============================================
  // EFECTO PRINCIPAL
  // ============================================
  useEffect(() => {
    if (!configId) {
      setLoading(false);
      return;
    }

    mountedRef.current = true;
    
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        // console.log('🔍 Cargando interfaz gráfica ID:', configId);
        
        // 1. Obtener configuración
        const config = await configuracionIGService.getDatosInterfaz(configId);
        // console.log('📋 Configuración recibida:', config?.nombre);
        setConfiguracion(config);
        
        // 2. Obtener variables SCADA
        const variables = await variableScadaService.getAll({ activo: true, limit: 500 });
        // console.log('📊 Variables SCADA:', variables.length);
        setVariablesScada(variables);
        
        // 3. Inicializar valores de elevadores
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
        
        // 4. Cargar datos del emulador inmediatamente
        if (config?.plc_origen) {
          // console.log('🔄 Cargando datos del emulador...');
          await cargarDatosEmulador();
        }
        
        // 5. Iniciar polling cada 1 segundo
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          if (mountedRef.current) {
            cargarDatosEmulador();
          }
        }, 1000);
        
        // console.log('✅ Interfaz cargada correctamente');
        
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
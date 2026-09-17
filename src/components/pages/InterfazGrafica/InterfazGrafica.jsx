// frontend/src/components/pages/InterfazGrafica/InterfazGrafica.jsx
import ReactDOM from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDatosInterfaz } from './useDatosInterfaz';
import { VistaClasica, VistaModerna, VistaMejorada, VistaMinimalista } from './vistas';
import PopupElevador from './PopupElevador';
import { configuracionService } from '../../../services/configuracionService';
import { edificioService } from '../../../services/edificioService';
import { vistasConfiguracionService } from '../../../services/vistasConfiguracionService';
import { useSafeTheme } from '../../../hooks/useSafeTheme';
import { preferenciasVistaService } from '../../../services/preferenciasVistaService';
import { useAuth } from '../../../context/AuthContext';

const InterfazGrafica = () => {
  const { id } = useParams();
  const [modoVista, setModoVista] = useState('2d');
  const [elevadoresSeleccionados, setElevadoresSeleccionados] = useState([]);
  const [renderKey, setRenderKey] = useState(0);
  const mountedRef = useRef(true);
  const [pageTitle, setPageTitle] = useState('NombrePorDefecto');
  const { temaConfig } = useSafeTheme();
  const { user } = useAuth();

  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  const {
    configuracion,
    loading,
    error,
    valoresElevadores,
    actualizarDatos
  } = useDatosInterfaz(id);

  const [popupElevador, setPopupElevador] = useState(null);
  const [edificiosMap, setEdificiosMap] = useState({});

  // Estado para la vista seleccionada
  const [vistaSeleccionada, setVistaSeleccionada] = useState(null);
  const [vistasDisponibles, setVistasDisponibles] = useState([]);

  // Cargar edificios
  useEffect(() => {
    const cargarEdificios = async () => {
      try {
        const edificios = await edificioService.getAll({ activo: true });
        const map = {};
        edificios.forEach(e => map[e.id_edificio] = e);
        setEdificiosMap(map);
      } catch (error) {
        console.error('Error cargando edificios:', error);
      }
    };
    cargarEdificios();
  }, []);

  // Cargar vistas disponibles
  useEffect(() => {
    const cargarVistas = async () => {
      try {
        const data = await vistasConfiguracionService.getActivas();
        setVistasDisponibles(data);
        
        if (data.length > 0) {
          let vistaSeleccionada = data[0];
          
          //  INTENTAR CARGAR LA VISTA GUARDADA DEL USUARIO
          if (user?.id_usuario && configuracion?.id_configuracion) {
            try {
              const preferencias = await preferenciasVistaService.getPreferencias(
                user.id_usuario,
                configuracion.id_configuracion
              );
              
              if (preferencias?.vista_seleccionada) {
                const vistaGuardada = data.find(v => 
                  v.nombre === preferencias.vista_seleccionada || 
                  v.id_vista === parseInt(preferencias.vista_seleccionada)
                );
                if (vistaGuardada) {
                  vistaSeleccionada = vistaGuardada;
                  // console.log(' Vista cargada desde BD:', vistaSeleccionada.nombre);
                }
              }
            } catch (error) {
              console.error('Error cargando vista guardada:', error);
            }
          }
          
          setVistaSeleccionada(vistaSeleccionada);
        }
      } catch (error) {
        console.error('Error cargando vistas:', error);
      }
    };
    cargarVistas();
  }, [configuracion?.id_configuracion, user?.id_usuario]);

  const handleViewPopup = (elevador) => {
    // console.log(' [InterfazGrafica] handleViewPopup llamado con elevador:', elevador);
    setPopupElevador(elevador);
  };

  // Función para cambiar de vista
  const handleVistaChange = (vista) => {
    // console.log(' [InterfazGrafica] handleVistaChange llamado con vista:', vista);
    // console.log(' [InterfazGrafica] vista.id_vista:', vista?.id_vista);
    // console.log(' [InterfazGrafica] vista.nombre:', vista?.nombre);
    // console.log(' [InterfazGrafica] handleVistaChange llamado con:', vista);
    // console.log(' [InterfazGrafica] vista.id_vista:', vista?.id_vista);
    // console.log(' [InterfazGrafica] vista.nombre:', vista?.nombre);
    setVistaSeleccionada(vista);
  };

  useEffect(() => {
    if (valoresElevadores && Object.keys(valoresElevadores).length > 0 && renderKey === 0) {
      setRenderKey(1);
    }
  }, [valoresElevadores]);

  // useEffect(() => {
  //   if (!configuracion) return;
    
  //   mountedRef.current = true;
  //   const interval = setInterval(() => {
  //     if (mountedRef.current) {
  //       actualizarDatos();
  //     }
  //   }, 500);
    
  //   return () => {
  //     mountedRef.current = false;
  //     clearInterval(interval);
  //   };
  // }, [configuracion]);

  useEffect(() => {
    const cargarTitulo = async () => {
      try {
        const sistema = await configuracionService.getSistema();
        setPageTitle(sistema.nombre_interfaz_clave || 'NombrePorDefecto');
      } catch (error) {
        console.error('Error cargando título:', error);
      }
    };
    cargarTitulo();
  }, []);

  const handleElevadorSelect = (elevadorId) => {
    if (elevadorId === null) {
      setElevadoresSeleccionados([]);
      return;
    }

    setElevadoresSeleccionados(prev => {
      const isSelected = prev.includes(elevadorId);
      if (isSelected) {
        return prev.filter(id => id !== elevadorId);
      }
      return [...prev, elevadorId];
    });
  };

  const handleClearSelection = () => {
    setElevadoresSeleccionados([]);
  };

  const elevadores = configuracion?.elevadores || [];
  const elevadoresConDatos = elevadores.map(e => ({
    ...e,
    datos: valoresElevadores[e.id] || {}
  }));

  const elevadoresFiltrados = elevadoresSeleccionados.length === 0
    ? elevadoresConDatos
    : elevadoresConDatos.filter(e => elevadoresSeleccionados.includes(e.id));

  const elevadoresActivos = elevadoresConDatos.filter(e => e.datos.estado === 'normal');

  let pisoMin = 0;
  let pisoMax = 15;
  elevadoresFiltrados.forEach(e => {
    (e.datos.cabinas || []).forEach(c => {
      if (c.piso_actual < pisoMin) pisoMin = c.piso_actual;
      if (c.piso_actual > pisoMax) pisoMax = c.piso_actual;
    });
  });

  const totalSeleccionados = elevadoresSeleccionados.length;

  // Renderizar vista según selección
  const renderVista = () => {
    const props = {
      configuracion,
      elevadoresConDatos,
      elevadoresFiltrados,
      elevadoresActivos,
      totalElevadores: elevadores.length,
      totalSeleccionados,
      pisoMin,
      pisoMax,
      modoVista,
      setModoVista,
      actualizarDatos,
      handleElevadorSelect,
      handleClearSelection,
      handleViewPopup,
      isDark,
      renderKey,
      elevadoresSeleccionados,
      vistaActual: vistaSeleccionada,
      onVistaChange: handleVistaChange,
      vistasDisponibles,
    };

    // console.log(' [InterfazGrafica] renderVista - vistaSeleccionada:', vistaSeleccionada);
    // console.log(' [InterfazGrafica] renderVista - vistasDisponibles:', vistasDisponibles);

    if (!vistaSeleccionada) {
      // console.log(' [InterfazGrafica] renderVista - No hay vista seleccionada, usando VistaClasica');
      return <VistaClasica {...props} />;
    }

    const vista = vistasDisponibles.find(v => v.id_vista === vistaSeleccionada.id_vista);
    // console.log(' [InterfazGrafica] renderVista - vista encontrada:', vista);

    if (vista?.nombre === 'Moderna') {
      // console.log(' [InterfazGrafica] renderVista - ✅ Renderizando VistaModerna');
      return <VistaModerna {...props} />;
    }

    if (vista?.nombre === 'Mejorada') {
      return <VistaMejorada {...props} />;
    }

    if (vista?.nombre === 'Minimalista') {
      return <VistaMinimalista {...props} />;
    }
    
    // console.log(' [InterfazGrafica] renderVista - ❌ Usando VistaClasica (fallback)');
    
    return <VistaClasica {...props} />;
  };

  if (loading && !configuracion) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
          <p className={`mt-4 font-mono ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>Cargando interfaz gráfica...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-red-300">
          <h3 className="text-xl font-bold">❌ Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!configuracion || elevadores.length === 0) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 text-yellow-300">
          <h3 className="text-xl font-bold">⚠️ Sin datos</h3>
          <p>No hay elevadores configurados para esta interfaz</p>
        </div>
      </div>
    );
  }
  
  // console.log(' [InterfazGrafica] configuracion (antes del return):', configuracion);
  // console.log(' [InterfazGrafica] configuracion.id_configuracion:', configuracion?.id_configuracion);

  return (
    <>
      {renderVista()}

      {popupElevador && ReactDOM.createPortal(
        <PopupElevador
          elevador={popupElevador}
          edificio={edificiosMap[popupElevador.id_edificio]}
          onClose={() => setPopupElevador(null)}
          isDark={isDark}
        />,
        document.body
      )}
    </>
  );
};

export default InterfazGrafica;

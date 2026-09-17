// frontend/src/components/pages/InterfazGrafica/vistas/VistaMinimalista/VistaMinimalista.jsx
import React, { useState, useEffect, useRef } from 'react';
import HeaderMinimalista from './HeaderMinimalista';
import EstadisticasMinimalista from './EstadisticasMinimalista';
import LeyendaMinimalista from './LeyendaMinimalista';
import CarruselMinimalista from './CarruselMinimalista';
import MatrizMinimalista from './MatrizMinimalista';
import { vistasEstadosService } from '../../../../../services/vistasEstadosService';
import { preferenciasVistaService } from '../../../../../services/preferenciasVistaService';
import { useAuth } from '../../../../../context/AuthContext';
import ControlesAlturaMinimalista from './ControlesAlturaMinimalista';

const POSICIONES_DEFAULT = {
  header: { x: 2, y: 2 },
  estadisticas: { x: 50, y: 2 },
  leyenda: { x: 50, y: 95 },
  controles_altura: { x: 95, y: 2 },
  carrusel: { x: 50, y: 98 }, 
};

const VistaMinimalista = ({
  configuracion,
  elevadoresConDatos,
  elevadoresFiltrados,
  elevadoresActivos,
  totalElevadores,
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
  vistaActual,
  onVistaChange,
  vistasDisponibles
}) => {
  const [estados, setEstados] = useState([]);
  const [iconos, setIconos] = useState({});
  const [matrizHeight, setMatrizHeight] = useState(500);
  const [posiciones, setPosiciones] = useState(POSICIONES_DEFAULT);
  const [carruselExpandido, setCarruselExpandido] = useState(false);
  
  const { user } = useAuth();
  const userId = user?.id_usuario || user?.id;
  
  const matrizContainerRef = useRef(null);

  const pisoMinimoVista = vistaActual?.piso_minimo ?? 0;
  const pisoMaximoVista = vistaActual?.piso_maximo ?? 20;

  //  Cargar preferencias (altura + posiciones) al montar
  useEffect(() => {
    const cargarPreferencias = async () => {
      if (!userId || !vistaActual?.id_vista) return;
      
      try {
        const preferencias = await preferenciasVistaService.getPreferencias(
          userId,
          vistaActual.id_vista
        );
        
        if (preferencias) {
          if (preferencias.altura_matriz) {
            setMatrizHeight(preferencias.altura_matriz);
          }
          if (preferencias.posiciones_minimalista) {
            setPosiciones({
                header: preferencias.posiciones_minimalista.header || POSICIONES_DEFAULT.header,
                estadisticas: preferencias.posiciones_minimalista.estadisticas || POSICIONES_DEFAULT.estadisticas,
                leyenda: preferencias.posiciones_minimalista.leyenda || POSICIONES_DEFAULT.leyenda,
                controles_altura: preferencias.posiciones_minimalista.controles_altura || POSICIONES_DEFAULT.controles_altura,
                carrusel: preferencias.posiciones_minimalista.carrusel || POSICIONES_DEFAULT.carrusel,  // ✅ NUEVO
            });
          }
        }
      } catch (error) {
        console.error('Error cargando preferencias:', error);
      }
    };
    
    cargarPreferencias();
  }, [userId, vistaActual?.id_vista]);

  //  Cargar estados configurables
  useEffect(() => {
    const cargarEstados = async () => {
      try {
        const data = await vistasEstadosService.getEstados(true);
        setEstados(data);
      } catch (error) {
        console.error('Error cargando estados:', error);
      }
    };
    cargarEstados();
  }, []);

  //  Cargar iconos de vista minimalista
  useEffect(() => {
    const cargarIconos = async () => {
      try {
        const data = await vistasEstadosService.getIconos('minimalista');
        const iconosMap = {};
        data.forEach(icono => {
          iconosMap[icono.tipo] = icono;
        });
        setIconos(iconosMap);
      } catch (error) {
        console.error('Error cargando iconos:', error);
      }
    };
    cargarIconos();
  }, []);

  //  Guardar altura cuando cambie
  const guardarAltura = async (nuevaAltura) => {
    if (!userId || !vistaActual?.id_vista) return;
    
    try {
      await preferenciasVistaService.actualizarPreferencias(
        userId,
        vistaActual.id_vista,
        { altura_matriz: nuevaAltura }
      );
    } catch (error) {
      console.error('Error guardando altura:', error);
    }
  };

  //  Guardar posiciones cuando cambien
  const guardarPosiciones = async (nuevasPosiciones) => {
    if (!userId || !vistaActual?.id_vista) return;
    
    try {
      await preferenciasVistaService.actualizarPosiciones(
        userId,
        vistaActual.id_vista,
        nuevasPosiciones
      );
    } catch (error) {
      console.error('Error guardando posiciones:', error);
    }
  };

  //  Handler para cambio de altura
  const handleMatrizHeightChange = (action) => {
    let nuevaAltura = matrizHeight;
    
    switch (action) {
      case 'increase':
        nuevaAltura = Math.min(matrizHeight + 50, 1500);
        break;
      case 'decrease':
        nuevaAltura = Math.max(matrizHeight - 50, 200);
        break;
      case 'fit':
        nuevaAltura = window.innerHeight - 200;
        break;
      case 'reset':
        nuevaAltura = 500;
        break;
      default:
        return;
    }
    
    setMatrizHeight(nuevaAltura);
    guardarAltura(nuevaAltura);
  };

  //  Handler para resetear posiciones
  const handleResetPosiciones = () => {
    setPosiciones(POSICIONES_DEFAULT);
    guardarPosiciones(POSICIONES_DEFAULT);
  };

  const elevadores = configuracion?.elevadores || [];

  if (!configuracion || elevadores.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 text-yellow-300">
          <h3 className="text-xl font-bold">⚠️ Sin datos</h3>
          <p>No hay elevadores configurados para esta interfaz</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
      {/*  CONTENEDOR PRINCIPAL CON LA MATRIZ */}
      <div 
        ref={matrizContainerRef}
        className="flex-1 relative overflow-hidden"
        style={{ minHeight: 0 }}
      >
        {/*  MATRIZ DE FONDO (ocupa todo) */}
        <MatrizMinimalista 
          key={`matriz-${renderKey}`}
          elevadores={elevadoresFiltrados}
          pisoMinimo={pisoMinimoVista}
          pisoMaximo={pisoMaximoVista}
          modoVista={modoVista}
          elevadorSeleccionado={null}
          isDark={isDark}
          vistaActual={vistaActual}
          estados={estados}
          iconos={iconos}
          onMatrizHeightChange={handleMatrizHeightChange}
          matrizHeight={matrizHeight}
        />

        {/*  HEADER FLOTANTE ARRASTRABLE */}
        <HeaderMinimalista
          posicion={posiciones.header}
          onPositionChange={(newPos) => {
            const nuevas = { ...posiciones, header: newPos };
            setPosiciones(nuevas);
            guardarPosiciones(nuevas);
          }}
          containerRef={matrizContainerRef}
          configuracion={configuracion}
          elevadoresActivos={elevadoresActivos}
          totalElevadores={elevadores.length}
          seleccionados={totalSeleccionados}
          onActualizar={actualizarDatos}
          onClearSelection={handleClearSelection}
          isDark={isDark}
          vistaActual={vistaActual}
          onVistaChange={onVistaChange}
          vistasDisponibles={vistasDisponibles}
        />

        {/*  ESTADÍSTICAS FLOTANTES ARRASTRABLES */}
        <EstadisticasMinimalista
          posicion={posiciones.estadisticas}
          onPositionChange={(newPos) => {
            const nuevas = { ...posiciones, estadisticas: newPos };
            setPosiciones(nuevas);
            guardarPosiciones(nuevas);
          }}
          containerRef={matrizContainerRef}
          elevadores={elevadoresFiltrados}
          pisoMinimo={pisoMinimoVista}
          pisoMaximo={pisoMaximoVista}
          isDark={isDark}
        />

        {/*  LEYENDA FLOTANTE ARRASTRABLE */}
        <LeyendaMinimalista
          posicion={posiciones.leyenda}
          onPositionChange={(newPos) => {
            const nuevas = { ...posiciones, leyenda: newPos };
            setPosiciones(nuevas);
            guardarPosiciones(nuevas);
          }}
          containerRef={matrizContainerRef}
          estados={estados}
          isDark={isDark}
        />

        {/*  CONTROLES DE ALTURA FLOTANTES ARRASTRABLES */}
        <ControlesAlturaMinimalista
          posicion={posiciones.controles_altura}
          onPositionChange={(newPos) => {
            const nuevas = { ...posiciones, controles_altura: newPos };
            setPosiciones(nuevas);
            guardarPosiciones(nuevas);
          }}
          containerRef={matrizContainerRef}
          onMatrizHeightChange={handleMatrizHeightChange}
          isDark={isDark}
        />

        {/*  CARRUSEL FLOTANTE ARRASTRABLE */}
        <CarruselMinimalista
            posicion={posiciones.carrusel}
            onPositionChange={(newPos) => {
                const nuevas = { ...posiciones, carrusel: newPos };
                setPosiciones(nuevas);
                guardarPosiciones(nuevas);
            }}
            containerRef={matrizContainerRef}
            elevadores={elevadoresConDatos}
            onElevadorSelect={handleElevadorSelect}
            elevadoresSeleccionados={elevadoresSeleccionados}
            isDark={isDark}
            onViewPopup={handleViewPopup}
            iconos={iconos}
            vistaActual={vistaActual}
            expandido={carruselExpandido}
            onToggleExpand={() => setCarruselExpandido(!carruselExpandido)}
        />

        {/*  BOTÓN RESET POSICIONES (esquina inferior derecha) */}
        <button
          onClick={handleResetPosiciones}
          className={`absolute bottom-2 right-2 z-30 p-2 rounded-lg backdrop-blur-md border shadow-lg transition-all hover:scale-110 ${
            isDark ? 'bg-slate-800/80 border-slate-600/50 text-slate-300 hover:text-white' : 'bg-white/80 border-gray-300/50 text-gray-600 hover:text-gray-900'
          }`}
          title="Resetear posiciones de elementos flotantes"
        >
          🔄
        </button>
      </div>
    </div>
  );
};

export default VistaMinimalista;
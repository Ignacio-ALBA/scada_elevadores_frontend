// frontend/src/components/pages/InterfazGrafica/vistas/VistaMejorada/VistaMejorada.jsx
import React, { useState, useEffect } from 'react';
import HeaderMejorado from './HeaderMejorado';
import CarruselMejorado from './CarruselMejorado';
import MatrizMejorada from './MatrizMejorada';
import EstadisticasMejorado from './EstadisticasMejorado';
import { vistasEstadosService } from '../../../../../services/vistasEstadosService';
import { preferenciasVistaService } from '../../../../../services/preferenciasVistaService';
import { useAuth } from '../../../../../context/AuthContext';

const VistaMejorada = ({
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
  const [estadisticasExpandidas, setEstadisticasExpandidas] = useState(false);
  const [estados, setEstados] = useState([]);
  const [iconos, setIconos] = useState({});
  const [matrizHeight, setMatrizHeight] = useState(400);
  
  //  Obtener usuario del contexto
  const { user } = useAuth();
  const userId = user?.id_usuario || user?.id;
  
  const porcentajeMatriz = vistaActual?.porcentaje_matriz ?? 70;
  const porcentajeEstadisticas = 100 - porcentajeMatriz;

  const pisoMinimoVista = vistaActual?.piso_minimo ?? 0;
  const pisoMaximoVista = vistaActual?.piso_maximo ?? 20;

  //  Cargar altura guardada al montar
  useEffect(() => {
    const cargarAlturaGuardada = async () => {
      if (!userId || !vistaActual?.id_vista) return;
      
      try {
        const preferencias = await preferenciasVistaService.getPreferencias(
          userId,
          vistaActual.id_vista
        );
        
        if (preferencias?.altura_matriz) {
          setMatrizHeight(preferencias.altura_matriz);
          // console.log(' [VistaMejorada] Altura cargada desde BD:', preferencias.altura_matriz);
        }
      } catch (error) {
        console.error('Error cargando altura guardada:', error);
      }
    };
    
    cargarAlturaGuardada();
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

  //  Cargar iconos de vista mejorada
  useEffect(() => {
    const cargarIconos = async () => {
      try {
        const data = await vistasEstadosService.getIconos();
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
      // console.log(' [VistaMejorada] Altura guardada en BD:', nuevaAltura);
    } catch (error) {
      console.error('Error guardando altura:', error);
    }
  };

  //  Handler para cambio de altura de matriz
  const handleMatrizHeightChange = (action) => {
    let nuevaAltura = matrizHeight;
    
    switch (action) {
      case 'increase':
        nuevaAltura = Math.min(matrizHeight + 50, 1200);
        break;
      case 'decrease':
        nuevaAltura = Math.max(matrizHeight - 50, 200);
        break;
      case 'fit':
        nuevaAltura = window.innerHeight - 250;
        break;
      case 'reset':
        nuevaAltura = 400;
        break;
      default:
        return;
    }
    
    setMatrizHeight(nuevaAltura);
    guardarAltura(nuevaAltura);  //  Guardar en BD
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
      {/* HEADER + ESTADÍSTICAS (compacto) */}
      <div className="flex-shrink-0 w-full">
        <HeaderMejorado
          configuracion={configuracion}
          elevadoresActivos={elevadoresActivos}
          totalElevadores={elevadores.length}
          seleccionados={totalSeleccionados}
          modoVista={modoVista}
          onModoVistaChange={setModoVista}
          onActualizar={actualizarDatos}
          onClearSelection={handleClearSelection}
          isDark={isDark}
          vistaActual={vistaActual}
          onVistaChange={onVistaChange}
          vistasDisponibles={vistasDisponibles}
          estadisticasExpandidas={estadisticasExpandidas}
          onToggleEstadisticas={() => setEstadisticasExpandidas(!estadisticasExpandidas)}
          elevadoresFiltrados={elevadoresFiltrados}
          pisoMinimo={pisoMinimoVista}
          pisoMaximo={pisoMaximoVista}
        />
      </div>

      {/* CARRUSEL */}
      <div className="flex-shrink-0 w-full">
        <CarruselMejorado
          elevadores={elevadoresConDatos}
          onElevadorSelect={handleElevadorSelect}
          elevadoresSeleccionados={elevadoresSeleccionados}
          isDark={isDark}
          onViewPopup={handleViewPopup}
          iconos={iconos}
          vistaActual={vistaActual}
        />
      </div>

      {/* MATRIZ + ESTADÍSTICAS */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div 
          className="overflow-hidden"
          style={{ 
            width: estadisticasExpandidas ? `${porcentajeMatriz}%` : '100%',
            transition: 'width 0.3s ease-in-out',
            flexShrink: 0,
            minWidth: 0  // ✅ Importante para flex
          }}
        >
          <MatrizMejorada
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
        </div>

        {estadisticasExpandidas && (
          <div 
            className="overflow-hidden"
            style={{ 
              width: `${porcentajeEstadisticas}%`,
              transition: 'width 0.3s ease-in-out',
              flexShrink: 0,
              minWidth: 0
            }}
          >
            <EstadisticasMejorado
              elevadores={elevadoresFiltrados}
              pisoMinimo={pisoMinimoVista}
              pisoMaximo={pisoMaximoVista}
              isDark={isDark}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaMejorada;
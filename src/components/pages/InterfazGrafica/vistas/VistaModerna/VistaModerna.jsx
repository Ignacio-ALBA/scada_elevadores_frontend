// frontend/src/components/pages/InterfazGrafica/vistas/VistaModerna/VistaModerna.jsx
import React, { useState, useEffect } from 'react';
import HeaderModerno from './HeaderModerno';
import CarruselModerno from './CarruselModerno';
import EstadisticasModerno from './EstadisticasModerno';
import MatrizModerno from './MatrizModerno';
import { preferenciasVistaService } from '../../../../../services/preferenciasVistaService';

const VistaModerna = ({
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
  // ============================================
  // ESTADOS PARA COLAPSOS
  // ============================================
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [carruselCollapsed, setCarruselCollapsed] = useState(false);
  const [estadisticasExpandidas, setEstadisticasExpandidas] = useState(false);
  
  // ============================================
  // ESTADOS PARA ALTURA Y ANCHO DE MATRIZ
  // ============================================
  const [matrizHeight, setMatrizHeight] = useState(400);
  const [matrizWidth, setMatrizWidth] = useState(70);
  
  // ============================================
  // CARGAR PREFERENCIAS DEL USUARIO
  // ============================================
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id_usuario || user.id;

  useEffect(() => {
    const cargarPreferencias = async () => {
      if (!userId || !vistaActual?.id_vista) return;
      
      try {
        const preferencias = await preferenciasVistaService.getPreferencias(
          userId,
          vistaActual.id_vista
        );
        
        if (preferencias) {
          // Cargar altura y ancho de matriz
          if (preferencias.altura_matriz) {
            setMatrizHeight(preferencias.altura_matriz);
          }
          if (preferencias.ancho_matriz) {
            setMatrizWidth(preferencias.ancho_matriz);
          }
          // Cargar estado de estadísticas
          if (preferencias.vista_seleccionada === 'Moderna') {
            // Las estadísticas comienzan contraídas por defecto
          }
        }
      } catch (error) {
        console.error('Error cargando preferencias:', error);
      }
    };
    
    cargarPreferencias();
  }, [userId, vistaActual]);

  // ============================================
  // GUARDAR PREFERENCIAS AL CAMBIAR
  // ============================================
  const guardarPreferencias = async (altura, ancho) => {
    if (!userId || !vistaActual?.id_vista) return;
    
    try {
      await preferenciasVistaService.guardarPreferencias(userId, vistaActual.id_vista, {
        vista_seleccionada: 'Moderna',
        altura_matriz: altura || matrizHeight,
        ancho_matriz: ancho || matrizWidth
      });
    } catch (error) {
      console.error('Error guardando preferencias:', error);
    }
  };

  // ============================================
  // MANEJADORES DE MATRIZ
  // ============================================
  const handleMatrizHeightChange = (action) => {
    let newHeight = matrizHeight;
    
    switch (action) {
      case 'increase':
        newHeight = Math.min(matrizHeight + 50, 800);
        break;
      case 'decrease':
        newHeight = Math.max(matrizHeight - 50, 200);
        break;
      case 'fit':
        newHeight = window.innerHeight - 300; // Restar header + carrusel + leyenda
        break;
      case 'reset':
        newHeight = 400;
        break;
      default:
        break;
    }
    
    setMatrizHeight(newHeight);
    guardarPreferencias(newHeight, matrizWidth);
  };

  const handleMatrizWidthChange = (newWidth) => {
    setMatrizWidth(newWidth);
    guardarPreferencias(matrizHeight, newWidth);
  };

  const pisoMinimoVista = vistaActual?.piso_minimo ?? 0;
  const pisoMaximoVista = vistaActual?.piso_maximo ?? 20;
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
      {/* ========================================== */}
      {/* FILA 1: HEADER */}
      {/* ========================================== */}
      <div className="flex-shrink-0 w-full">
        <HeaderModerno
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
          onCollapseChange={setHeaderCollapsed}
          isCollapsed={headerCollapsed}
        />
      </div>

      {/* ========================================== */}
      {/* FILA 2: CARRUSEL */}
      {/* ========================================== */}
      <div className="flex-shrink-0 w-full">
        <CarruselModerno
          elevadores={elevadoresConDatos}
          onElevadorSelect={handleElevadorSelect}
          elevadoresSeleccionados={elevadoresSeleccionados}
          isDark={isDark}
          onViewPopup={handleViewPopup}
          onCollapseChange={setCarruselCollapsed}
          isCollapsed={carruselCollapsed}
        />
      </div>

      {/* ========================================== */}
      {/* FILA 3: ESTADÍSTICAS */}
      {/* ========================================== */}
      <div className="flex-shrink-0 w-full">
        <EstadisticasModerno
            key={`estadisticas-${renderKey}`}
            elevadores={elevadoresFiltrados}
            pisoMinimo={pisoMinimoVista}
            pisoMaximo={pisoMaximoVista}
            isDark={isDark}
        />
      </div>

      {/* ========================================== */}
      {/* FILA 4: MATRIZ DE PISOS */}
      {/* ========================================== */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="overflow-hidden w-full h-full">
            <MatrizModerno
                key={`matriz-${renderKey}`}
                elevadores={elevadoresFiltrados}
                pisoMinimo={pisoMinimoVista}
                pisoMaximo={pisoMaximoVista}
                modoVista={modoVista}
                elevadorSeleccionado={null}
                isDark={isDark}
                colorNormal={vistaActual?.color_normal}
                colorMantenimiento={vistaActual?.color_mantenimiento}
                colorFalla={vistaActual?.color_falla}
                colorSismo={vistaActual?.color_sismo}
                colorSubiendo={vistaActual?.color_subiendo}
                colorBajando={vistaActual?.color_bajando}
                colorCabinaCerrada={vistaActual?.color_cabina_cerrada}
                colorCabinaAbierta={vistaActual?.color_cabina_abierta}
                colorCabinaMantenimiento={vistaActual?.color_cabina_mantenimiento}
                colorCabinaMitad={vistaActual?.color_cabina_mitad}
                tamanoIcono={vistaActual?.tamano_icono}
                onMatrizHeightChange={handleMatrizHeightChange}
                matrizHeight={matrizHeight}
            />
        </div>
      </div>

      {/* ========================================== */}
      {/* FILA 5: LEYENDA (dentro de MatrizModerno) */}
      {/* ========================================== */}
    </div>
  );
};

export default VistaModerna;
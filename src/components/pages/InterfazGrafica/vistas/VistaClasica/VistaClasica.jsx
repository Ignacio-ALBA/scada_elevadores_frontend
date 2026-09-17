// frontend/src/components/pages/InterfazGrafica/vistas/VistaClasica/VistaClasica.jsx
import React, { useState, useEffect, useRef } from 'react';
import HeaderInterfaz from './HeaderInterfaz';
import CarruselElevadores from './CarruselElevadores';
import MatrizPisos from './MatrizPisos';
import EstadisticasLateral from './EstadisticasLateral';

const VistaClasica = ({
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
  //  ELIMINAR este useEffect - el intervalo ya está en useDatosInterfaz
  // useEffect(() => {
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

//   console.log('🔍 [VistaClasica] 🚀 RENDERIZANDO VISTA CLASICA');

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
    <div className={`flex-1 flex flex-col overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
      <HeaderInterfaz
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
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <CarruselElevadores
          elevadores={elevadoresConDatos}
          onElevadorSelect={handleElevadorSelect}
          elevadoresSeleccionados={elevadoresSeleccionados}
          isDark={isDark}
          onViewPopup={handleViewPopup}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <MatrizPisos
              key={`matriz-${renderKey}`}
              elevadores={elevadoresFiltrados}
              pisoMinimo={pisoMin}
              pisoMaximo={pisoMax}
              modoVista={modoVista}
              elevadorSeleccionado={null}
              isDark={isDark}
            />
          </div>

          <div className={`w-72 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-200/50 border-gray-300'} border-l overflow-y-auto flex-shrink-0`}>
            <EstadisticasLateral
              key={`estadisticas-${renderKey}`}
              elevadores={elevadoresFiltrados}
              pisoMinimo={pisoMin}
              pisoMaximo={pisoMax}
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaClasica;
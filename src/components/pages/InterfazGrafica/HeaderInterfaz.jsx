// frontend/src/components/pages/InterfazGrafica/HeaderInterfaz.jsx
import React, { useState } from 'react';

const HeaderInterfaz = ({
  configuracion,
  elevadoresActivos,
  totalElevadores,
  seleccionados = 0,
  modoVista,
  onModoVistaChange,
  onActualizar,
  onClearSelection
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const ahora = new Date();
  const fechaHora = ahora.toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const estadoGeneral = elevadoresActivos.length === totalElevadores 
    ? '✅ Todos operativos'
    : elevadoresActivos.length === 0 
      ? '⚠️ Sin elevadores operativos'
      : `🟡 ${elevadoresActivos.length}/${totalElevadores} operativos`;

  const handleActualizar = () => {
    onActualizar();
    setTimeout(() => onActualizar(), 100);
  };

  return (
    <>
      {/* Header completo */}
      <div 
        className={`
          bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm 
          border-b border-slate-700 transition-all duration-500 ease-in-out 
          ${collapsed ? 'h-0 opacity-0 py-0 border-0 overflow-hidden' : 'h-auto opacity-100 py-3 px-4 md:px-6'}
        `}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Información de la interfaz (izquierda) */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-2xl md:text-3xl">🏢</div>
            <div>
              <h1 className="text-base md:text-xl font-bold text-white truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                {configuracion?.nombre || 'Interfaz Gráfica'}
              </h1>
              <p className="text-[10px] md:text-xs text-slate-400 truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                {configuracion?.descripcion || ''}
              </p>
            </div>
          </div>

          {/* ✅ Mostrar selección y botón limpiar */}
          <div className="flex items-center gap-3">
            {seleccionados > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyan-400">
                  {seleccionados} seleccionados
                </span>
                <button
                  onClick={() => {
                    console.log('🧹 Botón "Limpiar" clickeado en Header');
                    if (onClearSelection) {
                      onClearSelection();
                    } else {
                      console.warn('⚠️ onClearSelection no está definido');
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-white hover:bg-slate-700 px-2 py-1 rounded-lg transition-colors"
                >
                  ✕ Limpiar
                </button>
              </div>
            )}
          </div>

          {/* ✅ Controles (derecha) */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex bg-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => onModoVistaChange('2d')}
                className={`px-2 md:px-3 py-1 text-[10px] md:text-sm transition-colors ${
                  modoVista === '2d' 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-slate-300 hover:bg-slate-600'
                }`}
              >
                2D
              </button>
              <button
                onClick={() => onModoVistaChange('3d')}
                className={`px-2 md:px-3 py-1 text-[10px] md:text-sm transition-colors ${
                  modoVista === '3d' 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-slate-300 hover:bg-slate-600'
                }`}
              >
                3D
              </button>
            </div>
            <button
              onClick={handleActualizar}
              className="px-2 md:px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors text-[10px] md:text-sm font-mono"
            >
              🔄
            </button>
            <button
              onClick={() => setCollapsed(true)}
              className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-xs"
              title="Ocultar header"
            >
              ▲
            </button>
          </div>
        </div>

        {/* ✅ Fila de estadísticas (abajo, alineada a la derecha) */}
        <div className="flex justify-end mt-1 md:mt-0">
          <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm flex-wrap">
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-slate-400">Elevadores:</span>
              <span className="text-white font-mono font-bold">
                {elevadoresActivos.length}/{totalElevadores}
              </span>
            </div>
            <div className={`text-xs md:text-sm ${elevadoresActivos.length === totalElevadores ? 'text-green-400' : 'text-yellow-400'}`}>
              {estadoGeneral}
            </div>
            <div className="text-[10px] md:text-xs text-slate-400 font-mono hidden lg:block">
              {fechaHora}
            </div>
          </div>
        </div>
      </div>

      {/* Header colapsado (barra delgada) */}
      <div 
        className={`
          bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 transition-all duration-500 ease-in-out 
          ${collapsed ? 'h-10 opacity-100 py-1 px-3 md:px-4' : 'h-0 opacity-0 py-0 border-0 overflow-hidden'}
        `}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-base md:text-lg">🏢</span>
            <span className="text-xs md:text-sm text-white font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
              {configuracion?.nombre_corto || configuracion?.nombre || 'Interfaz'}
            </span>
          </div>
          
          {/* ✅ Estadísticas alineadas a la derecha en modo colapsado */}
          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
            <span className="text-slate-400 hidden sm:inline">
              {elevadoresActivos.length}/{totalElevadores}
            </span>
            <span className={`${elevadoresActivos.length === totalElevadores ? 'text-green-400' : 'text-yellow-400'}`}>
              {elevadoresActivos.length === totalElevadores ? '✅' : '🟡'}
            </span>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="flex bg-slate-700 rounded-lg overflow-hidden text-[10px] md:text-xs">
                <button
                  onClick={() => onModoVistaChange('2d')}
                  className={`px-1.5 md:px-2 py-0.5 transition-colors ${
                    modoVista === '2d' 
                      ? 'bg-cyan-500 text-white' 
                      : 'text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  2D
                </button>
                <button
                  onClick={() => onModoVistaChange('3d')}
                  className={`px-1.5 md:px-2 py-0.5 transition-colors ${
                    modoVista === '3d' 
                      ? 'bg-cyan-500 text-white' 
                      : 'text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  3D
                </button>
              </div>
              <button
                onClick={handleActualizar}
                className="px-1.5 md:px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors text-[10px] md:text-xs font-mono"
              >
                🔄
              </button>
              <button
                onClick={() => setCollapsed(false)}
                className="px-1.5 md:px-2 py-0.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-[10px] md:text-xs"
                title="Expandir header"
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderInterfaz;
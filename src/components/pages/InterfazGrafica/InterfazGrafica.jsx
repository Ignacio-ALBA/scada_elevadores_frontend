// frontend/src/components/pages/InterfazGrafica/InterfazGrafica.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDatosInterfaz } from './useDatosInterfaz';
import HeaderInterfaz from './HeaderInterfaz';
import CarruselElevadores from './CarruselElevadores';
import MatrizPisos from './MatrizPisos';
import EstadisticasLateral from './EstadisticasLateral';
import { configuracionService } from '../../../services/configuracionService';

const InterfazGrafica = () => {
  const { id } = useParams();
  const [modoVista, setModoVista] = useState('2d');
  const [elevadoresSeleccionados, setElevadoresSeleccionados] = useState([]); // ✅ Array de IDs
  const [renderKey, setRenderKey] = useState(0);
  const mountedRef = useRef(true);
  const [pageTitle, setPageTitle] = useState('NombrePorDefecto');

  const {
    configuracion,
    loading,
    error,
    valoresElevadores,
    actualizarDatos
  } = useDatosInterfaz(id);

  //  Forzar renderizado cuando hay datos iniciales
  useEffect(() => {
    if (valoresElevadores && Object.keys(valoresElevadores).length > 0 && renderKey === 0) {
      setRenderKey(1);
    }
  }, [valoresElevadores]);

  //  Actualizar datos cada 500ms
  useEffect(() => {
    if (!configuracion) return;
    
    mountedRef.current = true;
    const interval = setInterval(() => {
      if (mountedRef.current) {
        actualizarDatos();
      }
    }, 500);
    
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [configuracion]);

  
  useEffect(() => {
    // console.log('📊 elevadoresSeleccionados actualizado:', elevadoresSeleccionados);
  }, [elevadoresSeleccionados]);

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

  
  //  Manejar selección de elevadores
  const handleElevadorSelect = (elevadorId) => {
    // console.log('🔍 handleElevadorSelect - ID recibido:', elevadorId);
    // console.log('🔍 handleElevadorSelect - Selección actual:', elevadoresSeleccionados);
    
    if (elevadorId === null) {
      //  Si es null, limpiar todas las selecciones
      // console.log('🔍 Limpiando todas las selecciones');
      setElevadoresSeleccionados([]);
      return;
    }


    // setElevadoresSeleccionados(prev => {
    //   // Si ya está seleccionado, lo deseleccionamos
    //   if (prev.includes(elevadorId)) {
    //     return prev.filter(id => id !== elevadorId);
    //   }
    //   // Si no está seleccionado, lo agregamos
    //   return [...prev, elevadorId];
    // });

    setElevadoresSeleccionados(prev => {
      const isSelected = prev.includes(elevadorId);
      // console.log('🔍 Toggle - Elevador', elevadorId, 'seleccionado?', isSelected);
      
      if (isSelected) {
        const nuevo = prev.filter(id => id !== elevadorId);
        // console.log('🔍 Deseleccionado - Nuevo estado:', nuevo);
        return nuevo;
      }
      const nuevo = [...prev, elevadorId];
      // console.log('🔍 Seleccionado - Nuevo estado:', nuevo);
      return nuevo;
    });  
  };

  //  Limpiar selección
  const handleClearSelection = () => {
    // console.log('🧹 handleClearSelection - Limpiando selección');
    setElevadoresSeleccionados([]);
  };

  // Obtener lista de elevadores
  const elevadores = configuracion?.elevadores || [];
  const elevadoresConDatos = elevadores.map(e => ({
    ...e,
    datos: valoresElevadores[e.id] || {}
  }));

  // ✅ Filtrar elevadores según selección
  const elevadoresFiltrados = elevadoresSeleccionados.length === 0
    ? elevadoresConDatos
    : elevadoresConDatos.filter(e => elevadoresSeleccionados.includes(e.id));

  const elevadoresActivos = elevadoresConDatos.filter(e => e.datos.estado === 'normal');

  // Calcular pisos mínimo y máximo (usando elevadores filtrados)
  let pisoMin = 0;
  let pisoMax = 15;
  elevadoresFiltrados.forEach(e => {
    (e.datos.cabinas || []).forEach(c => {
      if (c.piso_actual < pisoMin) pisoMin = c.piso_actual;
      if (c.piso_actual > pisoMax) pisoMax = c.piso_actual;
    });
  });

  // Contar seleccionados
  const totalSeleccionados = elevadoresSeleccionados.length;

  if (loading && !configuracion) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-cyan-400 mt-4 font-mono">Cargando interfaz gráfica...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-red-300">
          <h3 className="text-xl font-bold">❌ Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!configuracion || elevadores.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 text-yellow-300">
          <h3 className="text-xl font-bold">⚠️ Sin datos</h3>
          <p>No hay elevadores configurados para esta interfaz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 overflow-hidden flex flex-col">
      {/* Área 1: Header */}
      <HeaderInterfaz
        configuracion={configuracion}
        elevadoresActivos={elevadoresActivos}
        totalElevadores={elevadores.length}
        seleccionados={totalSeleccionados}
        modoVista={modoVista}
        onModoVistaChange={setModoVista}
        onActualizar={actualizarDatos}
        onClearSelection={handleClearSelection} 
      />

      {/* Áreas 2, 3 y 4 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Área 2: Carrusel de elevadores - con selección múltiple */}
        <CarruselElevadores
          elevadores={elevadoresConDatos}
          onElevadorSelect={handleElevadorSelect}
          elevadoresSeleccionados={elevadoresSeleccionados}
        />

        {/* Áreas 3 y 4: Matriz + Estadísticas */}
        <div className="flex-1 flex overflow-hidden">
          {/* Área 3: Matriz de pisos - usando elevadores filtrados */}
          <div className="flex-1 overflow-hidden">
            <MatrizPisos
              key={`matriz-${renderKey}`}
              elevadores={elevadoresFiltrados}
              pisoMinimo={pisoMin}
              pisoMaximo={pisoMax}
              modoVista={modoVista}
              elevadorSeleccionado={null} // Ya no usamos selección única
            />
          </div>

          {/* Área 4: Estadísticas lateral */}
          <div className="w-72 bg-slate-800/50 border-l border-slate-700 overflow-y-auto flex-shrink-0">
            <EstadisticasLateral
              key={`estadisticas-${renderKey}`}
              elevadores={elevadoresFiltrados}
              pisoMinimo={pisoMin}
              pisoMaximo={pisoMax}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfazGrafica;
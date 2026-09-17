// frontend/src/components/pages/ElevadoresGraficos/ElevadoresGraficos.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { configuracionIGService } from '../../../services/configuracionIGService';
import InterfaceCard from './InterfaceCard';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import { useSafeTheme } from '../../../hooks/useSafeTheme'; // ✅ IMPORTAR

// SVG Iconos
const IconElevator = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
  </svg>
);

const ElevadoresGraficos = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('activos');
  const navigate = useNavigate();
  const pageTitle = useNombreInterfaz('elevadores_graficos');
  
  // ✅ OBTENER TEMA
  const { temaActual } = useSafeTheme();
  const isDark = temaActual === 'oscuro';

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await configuracionIGService.getAll({});
      const sortedData = data.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      setConfiguraciones(sortedData);
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
      setError('Error al cargar las interfaces gráficas');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (configuracion) => {
    navigate(`/interfaz-grafica/${configuracion.id_configuracion}`);
  };

  const configuracionesActivas = configuraciones.filter(
    c => c.estado === 'activo' && c.activo === true
  );
  
  const configuracionesInactivas = configuraciones.filter(
    c => c.estado === 'inactivo' && c.activo === false
  );

  const configuracionesMostrar = activeTab === 'activos' 
    ? configuracionesActivas 
    : configuracionesInactivas;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${isDark ? 'border-cyan-400' : 'border-primary-500'}`}></div>
          <p className={isDark ? 'text-gray-400 mt-4' : 'text-text-secondary mt-4'}>Cargando interfaces gráficas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={isDark ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} 
           style={{ borderWidth: '1px', borderRadius: '0.5rem', padding: '1rem' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>{pageTitle}</h1>
        <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
          Visualiza las interfaces gráficas configuradas para los elevadores
        </p>
      </div>

      <div className={`flex gap-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => setActiveTab('activos')}
          className={`py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'activos'
              ? isDark ? 'border-cyan-400 text-cyan-400' : 'border-primary-500 text-primary-500'
              : isDark ? 'border-transparent text-gray-400 hover:text-cyan-400' : 'border-transparent text-text-secondary hover:text-primary-500'
          }`}
        >
          ✅ Activas ({configuracionesActivas.length})
        </button>
        <button
          onClick={() => setActiveTab('inactivos')}
          className={`py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'inactivos'
              ? isDark ? 'border-cyan-400 text-cyan-400' : 'border-primary-500 text-primary-500'
              : isDark ? 'border-transparent text-gray-400 hover:text-cyan-400' : 'border-transparent text-text-secondary hover:text-primary-500'
          }`}
        >
          ❌ Inactivas ({configuracionesInactivas.length})
        </button>
      </div>

      {configuracionesMostrar.length === 0 ? (
        <div className={`${isDark ? 'bg-gray-800 shadow-lg shadow-black/50' : 'bg-white shadow-card'} rounded-xl p-12 text-center`}>
          <div className="text-6xl mb-4">📋</div>
          <p className={isDark ? 'text-gray-300 text-lg' : 'text-text-secondary text-lg'}>
            {activeTab === 'activos' 
              ? 'No hay interfaces gráficas activas configuradas' 
              : 'No hay interfaces gráficas inactivas'}
          </p>
          <p className={isDark ? 'text-gray-500 text-sm mt-2' : 'text-text-muted text-sm mt-2'}>
            {activeTab === 'activos'
              ? 'Ve a "Catálogo ALBA → Configuración IG" para crear una nueva interfaz'
              : 'Las interfaces inactivas pueden reactivarse desde "Catálogo ALBA → Configuración IG"'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configuracionesMostrar.map((config) => (
            <InterfaceCard
              key={config.id_configuracion}
              configuracion={config}
              onClick={handleCardClick}
              isDark={isDark} // ✅ PASAR isDark AL COMPONENTE HIJO
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ElevadoresGraficos;
// frontend/src/components/pages/Configuraciones/Configuraciones.jsx
import React, { useState } from 'react';
import { useSafeTheme } from '../../../hooks/useSafeTheme';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
import { usePermisos } from '../../../context/PermisoContext';
import ConfiguracionesGenerales from './ConfiguracionesGenerales';
import ConfiguracionesSistema from './ConfiguracionesSistema';
import ConfiguracionesColores from './ConfiguracionesColores';
import IconosConfig from './IconosConfig';

const Configuraciones = () => {
  const [activeTab, setActiveTab] = useState('generales');
  const { temaActual } = useSafeTheme();
  const isDark = temaActual === 'oscuro';
  const pageTitle = useNombreInterfaz('configuraciones');
  const { puedeVer, loading: permisosLoading } = usePermisos();

  //  Verificar permisos para cada pestaña
  const tabs = [
    { id: 'generales', label: 'Generales', component: ConfiguracionesGenerales, permiso: null },
    { id: 'sistema', label: 'Sistema', component: ConfiguracionesSistema, permiso: null },
    // { id: 'colores', label: 'Colores', component: ConfiguracionesColores, permiso: null },
    { id: 'iconos', label: 'Íconos', component: IconosConfig, permiso: 'iconos' },
  ];

  //  Filtrar pestañas según permisos (cuando los permisos ya estén cargados)
  const tabsFiltrados = permisosLoading 
    ? tabs.filter(t => t.id === 'generales') // Mostrar solo generales mientras carga
    : tabs.filter(tab => {
        if (!tab.permiso) return true;
        return puedeVer(tab.permiso);
      });

  const renderContent = () => {
    const tab = tabsFiltrados.find(t => t.id === activeTab);
    if (!tab) {
      // Si la pestaña activa no está en los filtrados, ir a la primera disponible
      if (tabsFiltrados.length > 0) {
        setActiveTab(tabsFiltrados[0].id);
      }
      return null;
    }
    const Component = tab.component;
    return <Component />;
  };

  //  Mostrar loading mientras se cargan permisos
  if (permisosLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>
            Gestiona la configuración del sistema
          </p>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-text-secondary">Cargando permisos...</span>
        </div>
      </div>
    );
  }

  //  Si no hay pestañas disponibles (sin permisos)
  if (tabsFiltrados.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>
            Gestiona la configuración del sistema
          </p>
        </div>
        <div className="p-8 text-center bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="text-yellow-800">No tienes permisos para ver ninguna configuración.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
          {pageTitle}
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>
          Gestiona la configuración del sistema
        </p>
      </div>

      {/* Tabs */}
      <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="flex gap-6 overflow-x-auto">
          {tabsFiltrados.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? isDark 
                    ? 'border-cyan-400 text-cyan-400' 
                    : 'border-primary-500 text-primary-500'
                  : isDark
                    ? 'border-transparent text-gray-400 hover:text-cyan-400 hover:border-gray-600'
                    : 'border-transparent text-text-secondary hover:text-primary-500 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Configuraciones;
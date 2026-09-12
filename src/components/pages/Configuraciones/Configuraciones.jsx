import React, { useState } from 'react';
import ConfiguracionesGenerales from './ConfiguracionesGenerales';
import ConfiguracionesColores from './ConfiguracionesColores';
import ConfiguracionesSistema from './ConfiguracionesSistema';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const Configuraciones = () => {
  const [activeTab, setActiveTab] = useState('generales');
  const pageTitle = useNombreInterfaz('configuraciones');

  const tabs = [
    { id: 'generales', label: 'Generales' },
    { id: 'colores', label: 'Colores' },
    { id: 'sistema', label: 'Sistema' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'generales':
        return <ConfiguracionesGenerales />;
      case 'colores':
        return <ConfiguracionesColores />;
      case 'sistema':
        return <ConfiguracionesSistema />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {/* <h1 className="text-2xl font-bold text-primary-500">Configuraciones</h1> */}
        <h1 className="text-2xl font-bold text-primary-500">{pageTitle}</h1>
        <p className="text-text-secondary">
          Gestiona la configuración del sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-text-secondary hover:text-primary-500'
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
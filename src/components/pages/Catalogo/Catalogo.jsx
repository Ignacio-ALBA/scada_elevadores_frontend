// frontend/src/components/pages/Catalogo/Catalogo.jsx
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { usePermisos } from '../../../context/PermisoContext';
import CatalogoElevadores from './CatalogoElevadores';
import CatalogoControladores from './CatalogoControladores';
import CatalogoUsuarios from './CatalogoUsuarios';
import CatalogoRoles from './CatalogoRoles';
import CatalogoPermisos from './CatalogoPermisos';
import CatalogoVariablesScada from './CatalogoVariablesScada';

const Catalogo = () => {
  const { seccion } = useParams();  // ✅ Obtener la sección de la URL
  const location = useLocation();
  const path = location.pathname;
  const { puedeEditar } = usePermisos();

  console.log('🔍 Catalogo - seccion:', seccion);
  console.log('🔍 Catalogo - path:', path);
  console.log('🔍 Catalogo - puedeEditar("roles"):', puedeEditar('roles'));
  console.log('🔍 Catalogo - puedeEditar("permisos"):', puedeEditar('permisos'));

  // Determinar qué componente mostrar
  const getComponent = () => {
    // Si hay sección en params, usarla
    if (seccion === 'elevadores') return <CatalogoElevadores />;
    if (seccion === 'controladores') return <CatalogoControladores />;
    if (seccion === 'usuarios') return <CatalogoUsuarios />;
    if (seccion === 'roles') return <CatalogoRoles canEdit={puedeEditar('roles')} />;
    if (seccion === 'permisos') return <CatalogoPermisos canEdit={puedeEditar('permisos')} />;
    if (seccion === 'variables-scada') return <CatalogoVariablesScada />;
    
    // Fallback con path
    if (path.includes('/catalogo/elevadores')) return <CatalogoElevadores />;
    if (path.includes('/catalogo/controladores')) return <CatalogoControladores />;
    if (path.includes('/catalogo/usuarios')) return <CatalogoUsuarios />;
    if (path.includes('/catalogo/roles')) return <CatalogoRoles canEdit={puedeEditar('roles')} />;
    if (path.includes('/catalogo/permisos')) return <CatalogoPermisos canEdit={puedeEditar('permisos')} />;
    if (path.includes('/catalogo/variables-scada')) return <CatalogoVariablesScada />;
    
    // Vista general del catálogo
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary-500">Catálogo</h1>
        <p className="text-text-secondary">Selecciona una opción del menú para gestionar el catálogo</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg">Elevadores</h3>
            <p className="text-text-secondary text-sm">Gestionar elevadores</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg">Controladores</h3>
            <p className="text-text-secondary text-sm">Gestionar controladores</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg">Usuarios</h3>
            <p className="text-text-secondary text-sm">Gestionar usuarios</p>
          </div>
        </div>
      </div>
    );
  };

  return getComponent();
};

export default Catalogo;
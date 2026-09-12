import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermisos } from '../../context/PermisoContext';

const PermisoGuard = ({ 
  children, 
  modulo, 
  accion = 'ver',
  redirectTo = '/dashboard'
}) => {
  const { tienePermiso, loading } = usePermisos();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-primary-500">Cargando permisos...</span>
      </div>
    );
  }

  if (!tienePermiso(modulo, accion)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PermisoGuard;
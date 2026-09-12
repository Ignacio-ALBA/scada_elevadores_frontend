import React from 'react';
import { usePermisos } from '../../context/PermisoContext';

const PermisoButton = ({ 
  modulo, 
  accion = 'ver', 
  children,
  fallback = null,
  ...props 
}) => {
  const { tienePermiso } = usePermisos();

  if (!tienePermiso(modulo, accion)) {
    return fallback;
  }

  return (
    <button {...props}>
      {children}
    </button>
  );
};

export default PermisoButton;
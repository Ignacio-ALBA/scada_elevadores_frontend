// frontend/src/components/common/PermisoGuard.jsx
import React from 'react';
import { usePermisos } from '../../context/PermisoContext';

const PermisoGuard = ({ modulo, accion = 'ver', children, fallback = null }) => {
  const { loading, puedeVer, puedeCrear, puedeEditar, puedeEliminar } = usePermisos();

  // ✅ Mientras carga, mostrar null o un spinner
  if (loading) {
    return <div className="flex justify-center py-4"><span className="text-gray-400">Cargando permisos...</span></div>;
  }

  const acciones = {
    ver: puedeVer,
    crear: puedeCrear,
    editar: puedeEditar,
    eliminar: puedeEliminar,
  };

  const tienePermiso = acciones[accion] ? acciones[accion](modulo) : false;

  if (!tienePermiso) {
    return fallback || null;
  }

  return children;
};

export default PermisoGuard;
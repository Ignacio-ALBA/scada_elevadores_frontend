// Temporal: retorna menú fijo
export const getMenuItems = async (rol) => {
  // Aquí se conectará con la API
  return [
    { clave: 'dashboard', nombre: 'Dashboard', ruta: '/dashboard', icono: 'FaChartPie' },
    { clave: 'elevadores', nombre: 'Elevadores', ruta: '/elevadores', icono: 'FaElevator' },
    { clave: 'alarmas', nombre: 'Alarmas', ruta: '/alarmas', icono: 'FaBell' },
    { clave: 'eventos', nombre: 'Eventos', ruta: '/eventos', icono: 'FaClock' },
    { clave: 'mantenimiento', nombre: 'Mantenimiento', ruta: '/mantenimiento', icono: 'FaTools' },
    { clave: 'reportes', nombre: 'Reportes', ruta: '/reportes', icono: 'FaFileAlt' },
    { clave: 'usuarios', nombre: 'Usuarios', ruta: '/usuarios', icono: 'FaUsers' },
    { clave: 'configuraciones', nombre: 'Configuraciones', ruta: '/configuraciones', icono: 'FaCog' },
    { clave: 'integraciones', nombre: 'Integraciones', ruta: '/integraciones', icono: 'FaPlug' },
    { clave: 'catalogo', nombre: 'Catálogo', ruta: '/catalogo', icono: 'FaBook' },
  ];
};
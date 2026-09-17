// frontend/src/config/index.js
// Configuración centralizada para toda la aplicación

// Configuración centralizada - Usa VITE_API_URL del .env (no hardcodes)
export const APP_CONFIG = {
  name: 'SmartLift',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_URL,
  dashboardInterval: import.meta.env.VITE_DASHBOARD_INTERVAL || 15000,
};

// Validar que la URL está configurada
if (!APP_CONFIG.apiBaseUrl) {
  throw new Error('VITE_API_URL no está configurado en .env');
}

// Configuración de columnas para tablas (dinámicas)
export const TABLE_CONFIG = {
  elevadores: {
    columns: [
      { key: 'codigo', label: 'Código', sortable: true },
      { key: 'nombre', label: 'Nombre', sortable: true },
      { key: 'tipo', label: 'Tipo', sortable: true },
      { key: 'capacidad_personas', label: 'Capacidad', sortable: true },
      { key: 'estado_operativo', label: 'Estado', sortable: true },
      // 🔧 Aquí se pueden agregar nuevas columnas fácilmente
    ],
    filters: [
      { key: 'estado_operativo', label: 'Estado', type: 'select', options: ['operativo', 'mantenimiento', 'falla', 'desconectado'] },
      { key: 'tipo', label: 'Tipo', type: 'select', options: ['hidráulico', 'eléctrico', 'neumático'] },
    ],
  },
  edificios: {
    columns: [
      { key: 'nombre', label: 'Nombre', sortable: true },
      { key: 'direccion', label: 'Dirección', sortable: true },
      { key: 'numero_pisos', label: 'Pisos', sortable: true },
      { key: 'activo', label: 'Activo', sortable: true },
    ],
  },
  // 🔧 Agregar nuevas tablas aquí
};

// Configuración de colores por estado
export const STATUS_CONFIG = {
  operativo: { label: 'Operativo', color: 'bg-green-100 text-green-800' },
  mantenimiento: { label: 'Mantenimiento', color: 'bg-orange-100 text-orange-800' },
  falla: { label: 'Falla', color: 'bg-red-100 text-red-800' },
  desconectado: { label: 'Desconectado', color: 'bg-gray-100 text-gray-800' },
  espera: { label: 'Espera', color: 'bg-blue-100 text-blue-800' },
  // 🔧 Agregar nuevos estados aquí
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  positions: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
  duration: 5000,
  types: {
    success: { icon: '✅', color: 'bg-green-50 border-green-500' },
    error: { icon: '❌', color: 'bg-red-50 border-red-500' },
    warning: { icon: '⚠️', color: 'bg-yellow-50 border-yellow-500' },
    info: { icon: 'ℹ️', color: 'bg-blue-50 border-blue-500' },
  },
};
// frontend/src/utils/consoleFilter.js

// Solo ejecutar en desarrollo
if (import.meta.env.DEV) {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  const FILTERED_MESSAGES = [
    'listener indicated an asynchronous response',
    'message channel closed before a response was received',
    'Extension context invalidated',
    'Could not establish connection',
    'Receiving end does not exist'
  ];

  const shouldFilter = (message) => {
    if (!message) return false;
    return FILTERED_MESSAGES.some(filter => message.includes(filter));
  };

  // Silenciar errores de ventana (adicional)
  window.addEventListener('error', (e) => {
    if (shouldFilter(e.message)) {
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
  }, true);

  // Silenciar promesas rechazadas
  window.addEventListener('unhandledrejection', (e) => {
    const msg = e.reason?.message || e.reason || '';
    if (shouldFilter(msg)) {
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
  }, true);

  console.error = function(...args) {
    const message = args[0]?.toString() || '';
    if (shouldFilter(message)) return;
    originalConsoleError.apply(console, args);
  };

  console.warn = function(...args) {
    const message = args[0]?.toString() || '';
    if (shouldFilter(message)) return;
    originalConsoleWarn.apply(console, args);
  };

  console.log('🔇 Filtro de errores de extensiones activado (desde consoleFilter.js)');
}
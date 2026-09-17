// frontend/src/styles/consoleFilter.js
//  Filtrar errores de React DevTools
const originalError = console.error;

console.error = function(...args) {
  //  Ignorar errores específicos de React DevTools
  const errorString = args.join(' ');
  if (errorString.includes('startTime') || 
      errorString.includes('Cannot read properties of undefined') ||
      errorString.includes('React DevTools')) {
    return;
  }
  originalError.apply(console, args);
};

//  También filtrar logs de extensiones
const originalWarn = console.warn;
console.warn = function(...args) {
  const warnString = args.join(' ');
  if (warnString.includes('startTime') || 
      warnString.includes('React DevTools') ||
      warnString.includes('extension')) {
    return;
  }
  originalWarn.apply(console, args);
};
// frontend/src/config.js
// Usar la configuración centralizada de src/config/index.js
import { APP_CONFIG } from './config/index.js';
export const API_BASE_URL = APP_CONFIG.apiBaseUrl;
export const API_URL = `${API_BASE_URL}/api`;
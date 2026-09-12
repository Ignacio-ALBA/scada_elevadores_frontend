// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PermisoProvider } from './context/PermisoContext';
import { router } from './router';
import './index.css';
// ✅ Asegurar que NO hay import de consoleFilter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PermisoProvider>
        <RouterProvider router={router} />
      </PermisoProvider>
    </AuthProvider>
  </React.StrictMode>
);
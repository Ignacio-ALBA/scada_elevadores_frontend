// frontend/src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { PermisoProvider } from './context/PermisoContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PermisoProvider>
          <RouterProvider router={router} />
        </PermisoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
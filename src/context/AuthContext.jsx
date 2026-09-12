import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      // 🧪 MODO PRUEBA: Usuario mock sin autenticación
      // Para habilitar autenticación real, descomentar el bloque de abajo
      setUser({
        id: 1,
        username: 'admin',
        rol_id: 1,
        nombre: 'Admin Test',
      });
      setLoading(false);
      
      /* COMENTADO PARA PRUEBAS - DESCOMENTAR DESPUÉS PARA AUTENTICACIÓN REAL
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Parsear el usuario guardado
          const parsedUser = JSON.parse(savedUser);
          // console.log('🔍 AuthContext - Usuario desde localStorage:', parsedUser);
          
          // Asegurar que el rol esté disponible
          const userWithRol = {
            ...parsedUser,
            rol_id: parsedUser.rol || parsedUser.rol_id || 1,
          };
          
          // console.log('🔍 AuthContext - Usuario con rol:', userWithRol);
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          setUser({
            ...response.data,
            rol_id: response.data.rol || response.data.rol_id || parsedUser.rol || 1,
          });
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
      */
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      
      // Mapear la respuesta del backend .NET
      const { token, user } = response.data.data;
      
      // Asegurar que el objeto user tenga idRol
      const userWithRol = {
        ...user,
        idRol: user.idRol || 1,
        rol_id: user.idRol || 1, // Para compatibilidad con código existente
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithRol));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userWithRol);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';
      // Manejar errores del backend .NET
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 415) {
        errorMessage = 'Error de configuración del servidor (415)';
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
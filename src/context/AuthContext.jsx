// frontend/src/context/AuthContext.jsx
// Reemplazar TODO el archivo

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import LoadingScreen from '../components/common/LoadingScreen';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // ✅ NO establecer globalmente el header - el interceptor lo maneja automáticamente
          const response = await api.get('/auth/me');
          
          // console.log(' [AuthContext] /auth/me response:', response.data);
          
          const userData = {
            ...response.data.data,
            rol_id: response.data.data.rol || response.data.data.rol_id || 1
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setToken(token);
          
          // console.log(' [AuthContext] Usuario cargado desde backend');
          
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('auth:login', { 
              detail: { user: userData } 
            }));
            // console.log(' [AuthContext] Evento auth:login disparado (con delay)');
          }, 100);
          
        } catch (error) {
          console.error('❌ [AuthContext] Error cargando usuario:', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('permisos');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    // ✅ NO usar setLoading aquí para evitar re-renderizar Login
    // ✅ Usar un estado local para el loading del login
    
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      // console.log(' [AuthContext] login response:', response.data);
      
      // La respuesta viene envuelta en ResponseDto<LoginResponseDto>
      // Estructura (con camelCase): { success, data: { token, tokenType, expiresIn, user }, message, errors }
      const { token: access_token, user: userData } = response.data.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // ✅ NO establecer globalmente el header - el interceptor lo maneja automáticamente
      
      const userResponse = await api.get('/auth/me');
      // console.log(' [AuthContext] /auth/me después de login:', userResponse.data);
      
      const fullUserData = {
        ...userResponse.data.data,
        rol_id: userResponse.data.data.rol || userResponse.data.data.rol_id || 1
      };
      
      localStorage.setItem('user', JSON.stringify(fullUserData));
      
      setUser(fullUserData);
      setToken(access_token);
      
      localStorage.removeItem('permisos');
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('auth:login', { 
          detail: { user: fullUserData } 
        }));
        // console.log(' [AuthContext] Evento auth:login disparado (con delay)');
      }, 100);
      
      return { success: true };
    } catch (error) {
      console.error('❌ [AuthContext] Error en login:', error);
      
      let errorMsg = 'Usuario o contraseña incorrectos';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.detail) {
          if (typeof data.detail === 'string') {
            errorMsg = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMsg = data.detail.map(e => e.msg || e).join(', ');
          }
        } else if (data.message) {
          errorMsg = data.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      // console.log(' [AuthContext] Error final para Login:', errorMsg);
      
      //  IMPORTANTE: NO modificar el estado global loading aquí
      return { 
        success: false, 
        error: errorMsg 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permisos');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    
    window.dispatchEvent(new CustomEvent('auth:logout'));
  };

  const updateUser = async (updatedData) => {
    try {
      const userId = user.id_usuario || user.id;
      const response = await api.put(`/usuarios/${userId}`, updatedData);
      
      if (response.data) {
        const userResponse = await api.get('/auth/me');
        const fullUserData = {
          ...userResponse.data.data,
          rol_id: userResponse.data.data.rol || userResponse.data.data.rol_id || 1
        };
        setUser(fullUserData);
        localStorage.setItem('user', JSON.stringify(fullUserData));
        
        window.dispatchEvent(new CustomEvent('auth:login', { 
          detail: { user: fullUserData } 
        }));
        
        return fullUserData;
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error actualizando usuario:', error);
      throw error;
    }
  };

  if (loading) {
    return <LoadingScreen isDark={false} />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      loading, 
      login, 
      logout,
      updateUser,
      isAuthenticated: !!token 
    }}>
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

export default AuthContext;
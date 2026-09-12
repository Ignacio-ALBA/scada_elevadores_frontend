// frontend/src/components/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { configuracionService } from '../../../services/configuracionService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    nombre_sistema: 'SmartLift',
    nombre_corto_sistema: 'SmartLift',
    nombre_pestana: 'SmartLift - SCADA Elevadores',
    logotipo_pestana: '',  
    logotipo_principal: '',
    logotipo_sidebar: '',
    version_sistema: 'v0.0.0',
    imagen_fondo_login: '',
  });
  const [loadingConfig, setLoadingConfig] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Cargar configuración del sistema (público, sin token)
  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const data = await configuracionService.getSistemaPublic();
        // console.log('🔍 Login - Config recibida:', data);
        
        //  Actualizar título y favicon con los datos de configuración
        if (data.nombre_pestana) {
          document.title = data.nombre_pestana;
        }
        if (data.logotipo_pestana) {
          let link = document.querySelector("link[rel*='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.logotipo_pestana;
        }
        
        setConfig({
          nombre_sistema: data.nombre_sistema || 'SmartLift',
          nombre_corto_sistema: data.nombre_corto_sistema || 'SmartLift',
          nombre_pestana: data.nombre_pestana || 'SmartLift - SCADA Elevadores',
          logotipo_pestana: data.logotipo_pestana || '',
          logotipo_principal: data.logotipo_principal || '',
          logotipo_sidebar: data.logotipo_sidebar || '',
          version_sistema: data.version_sistema || 'v1.0.0',
          imagen_fondo_login: data.imagen_fondo_login || '',
        });
      } catch (error) {
        console.error('Error cargando configuración:', error);
        setConfig({
          nombre_sistema: 'SmartLift',
          nombre_corto_sistema: 'SmartLift',
          nombre_pestana: 'SmartLift - SCADA Elevadores',
          logotipo_pestana: '',
          logotipo_principal: '',
          logotipo_sidebar: '',
          version_sistema: 'v1.0.0',
          imagen_fondo_login: '',
        });
      } finally {
        setLoadingConfig(false);
      }
    };
    cargarConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        const errorMsg = result.error || 'Usuario o contraseña incorrectos';
        setError(errorMsg);
        
        // ⏱️ Esperar 1.5 segundos antes de desactivar loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoading(false);
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intente nuevamente.');
      console.error('Login error:', err);
      
      // ⏱️ Esperar 1.5 segundos antes de desactivar loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
    }
  };

  // Limpiar error después de 4 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Si está cargando configuración, mostrar skeleton
  if (loadingConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Fondo con imagen dinámica */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: config.imagen_fondo_login 
            ? `url(${config.imagen_fondo_login})` 
            : 'url(https://images.unsplash.com/photo-1542051841857-5f9006f4faf5?w=1920&h=1080&fit=crop)',
        }}
      >
        {/* Overlay oscuro para legibilidad */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 animate-fadeInUp">
          {/* Logo y título */}
          <div className="text-center mb-8">
            {config.logotipo_principal ? (
              <img 
                src={config.logotipo_principal} 
                alt={config.nombre_sistema}
                className="h-20 mx-auto mb-4 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="text-6xl mb-4">🏢</div>
            )}
            <h1 className="text-3xl font-bold text-white">
              {config.nombre_sistema}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Sistema SCADA de Elevadores
            </p>
            <p className="text-white/40 text-xs mt-2">
              {config.version_sistema}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 ${
                  loading ? 'border-white/10 opacity-50 cursor-not-allowed' : 'border-white/20'
                }`}
                placeholder="Ingresa tu usuario"
                required
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 ${
                  loading ? 'border-white/10 opacity-50 cursor-not-allowed' : 'border-white/20'
                }`}
                placeholder="Ingresa tu contraseña"
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {/* Mensaje de error con animación */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm animate-fadeIn">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 ${
                loading 
                  ? 'opacity-70 cursor-not-allowed scale-[0.98]' 
                  : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando credenciales...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Footer del formulario */}
          <div className="mt-6 text-center">
            <p className="text-white/40 text-xs">
              {config.nombre_corto_sistema} © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
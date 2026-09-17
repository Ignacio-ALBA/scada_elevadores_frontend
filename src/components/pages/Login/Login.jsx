// frontend/src/components/pages/Login/Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { configuracionService } from '../../../services/configuracionService';
import { useSafeTheme } from '../../../hooks/useSafeTheme';

// ============================================
//  FUNCIONES DE UTILIDAD
// ============================================

const getRealValue = (val) => {
  if (!val) return null;
  
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object' && parsed.value) {
        return parsed.value;
      }
      return val;
    } catch (e) {
      return val;
    }
  }
  
  if (typeof val === 'object' && val !== null) {
    if (val.value) {
      return val.value;
    }
    return null;
  }
  return val;
};

const getBackgroundValue = (val) => {
  if (!val) return null;
  
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object') {
        if (parsed.value) {
          return parsed.value;
        }
        if (parsed.type === 'gradient' && parsed.gradient) {
          const dir = parsed.gradient.direction || 'to right';
          const colors = parsed.gradient.colors || ['#3b82f6', '#8b5cf6'];
          return `linear-gradient(${dir}, ${colors.join(', ')})`;
        }
        if (parsed.type === 'rgba' && parsed.value) {
          return `rgba(${parsed.value}, ${parsed.opacity || 1})`;
        }
      }
      return val;
    } catch (e) {
      return val;
    }
  }
  
  if (typeof val === 'object' && val !== null) {
    if (val.value) {
      return val.value;
    }
    return null;
  }
  return val;
};

// ============================================
//  COMPONENTE LOGIN
// ============================================

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentBgImage, setCurrentBgImage] = useState('');
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

  const errorTimeoutRef = useRef(null);
  
  const { TEMAS, temaActual, cambiarTema, recargarTemas } = useSafeTheme();

  const temaLocal = temaActual || 'default';
  const temaConfig = TEMAS?.[temaLocal] || TEMAS?.default || {};
  const isDark = temaLocal === 'oscuro';

  const loginBgColor = getBackgroundValue(temaConfig.loginBg) || '#0f172a';
  const cardBgColor = getBackgroundValue(temaConfig.card) || 'rgba(255,255,255,0.05)';
  const cardShadow = getRealValue(temaConfig.cardShadow) || '0 20px 60px rgba(0,0,0,0.3)';
  const primaryColor = getRealValue(temaConfig.buttonPrimaryBg) || '#3b82f6';
  const textColor = getRealValue(temaConfig.text) || '#ffffff';
  const textSecondaryColor = getRealValue(temaConfig.textSecondary) || '#94a3b8';
  const textMutedColor = getRealValue(temaConfig.textMuted) || '#64748b';
  const borderColor = getRealValue(temaConfig.border) || 'rgba(255,255,255,0.1)';

  //  ESTILOS DE INPUTS SEGÚN TEMA (sin placeholderTextColor)
  const inputBgColor = isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.9)';
  const inputTextColor = isDark ? '#f1f5f9' : '#1e293b';
  const inputBorderColor = isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.8)';
  const errorBgColor = isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(254, 202, 202, 0.8)';
  const errorTextColor = isDark ? '#fca5a5' : '#dc2626';
  const errorBorderColor = isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.3)';

  //  Cargar configuración
  useEffect(() => {
    const cargarConfig = async () => {
      try {
        const data = await configuracionService.getSistemaPublic();
        if (data.nombre_pestana) document.title = data.nombre_pestana;
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

  //  Cargar imágenes de fondo
  useEffect(() => {
    const cargarImagenesFondo = async () => {
      if (config.imagen_fondo_login) {
        setBackgroundImages([config.imagen_fondo_login]);
        setCurrentBgImage(config.imagen_fondo_login);
        return;
      }
      try {
        const imagenes = await configuracionService.getFondoLoginImages?.();
        if (imagenes && imagenes.length > 0) {
          setBackgroundImages(imagenes);
          const randomIndex = Math.floor(Math.random() * imagenes.length);
          setCurrentBgImage(imagenes[randomIndex]);
        }
      } catch (error) {
        console.error('Error cargando imágenes de fondo:', error);
        if (config.imagen_fondo_login) {
          setBackgroundImages([config.imagen_fondo_login]);
          setCurrentBgImage(config.imagen_fondo_login);
        }
      }
    };
    if (config && config.imagen_fondo_login !== undefined) {
      cargarImagenesFondo();
    }
  }, [config]);

  // ✅ Cambiar imagen aleatoria
  const cambiarImagenAleatoria = () => {
    if (backgroundImages.length === 0) return;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * backgroundImages.length);
    } while (backgroundImages[newIndex] === currentBgImage && backgroundImages.length > 1);
    setCurrentBgImage(backgroundImages[newIndex]);
  };

  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    const interval = setInterval(cambiarImagenAleatoria, 30000);
    return () => clearInterval(interval);
  }, [backgroundImages, currentBgImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      // console.log(' [Login] result:', result);
      
      if (result.success) {
        await recargarTemas();
        navigate('/dashboard');
      } else {
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : 'Usuario o contraseña incorrectos';
        
        // console.log(' [Login] errorMsg FINAL:', errorMsg);
        setError(errorMsg);
        // CUIDADO: NO setear loading a false aquí si se va a desmontar
        // setLoading(false);
      }
    } catch (err) {
      // console.error(' [Login] Catch inesperado:', err);
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      //  Solo setear loading a false al final
      setLoading(false);
    }
  };

  //  Agregar useEffect para monitorear cambios en error
  // useEffect(() => {
  //   console.log(' [Login] useEffect - error cambió a:', error);
  // }, [error]);

  // Limpiar error después de 5 segundos
  // useEffect(() => {
  //   if (error) {
  //     const timer = setTimeout(() => {
  //       setError('');
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [error]);

  if (loadingConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: loginBgColor }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: primaryColor }}></div>
          <p className="mt-4" style={{ color: textSecondaryColor }}>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  // console.log(' [Login] Estado error actual:', error);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: loginBgColor }}
    >
      {/* Fondo con imagen */}
      {currentBgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${currentBgImage})`,
            transform: `scale(1.05)`,
            animation: 'kenBurns 30s ease-in-out infinite alternate'
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: `${loginBgColor}CC` }}></div>
        </div>
      )}

      {/* Puntos de imagen */}
      {backgroundImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentBgImage === img 
                  ? 'w-6 bg-white' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => setCurrentBgImage(img)}
            />
          ))}
        </div>
      )}

      {/* Card de Login */}
      <div 
        className="relative w-full max-w-md rounded-3xl p-8 backdrop-blur-sm transition-all duration-500 z-10"
        style={{
          backgroundColor: cardBgColor,
          boxShadow: cardShadow,
          border: `1px solid ${borderColor}`,
          transform: isHovering ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Borde superior */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)` }}
        />

        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div 
              className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl relative overflow-hidden transition-transform duration-500 hover:scale-110"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}10)`,
                border: `2px solid ${primaryColor}20`
              }}
            >
              <div className="absolute inset-0 animate-spin-slow opacity-20" 
                style={{ 
                  background: `conic-gradient(from 0deg, transparent, ${primaryColor}40, transparent 60%)`,
                  animation: 'spin 10s linear infinite'
                }}
              />
              {config.logotipo_principal ? (
                <img 
                  src={config.logotipo_principal} 
                  alt={config.nombre_sistema}
                  className="w-14 h-14 object-contain relative z-10"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-4xl relative z-10">🏢</span>';
                  }}
                />
              ) : (
                <span className="text-4xl relative z-10">🏢</span>
              )}
            </div>
            <span 
              className="absolute -top-1 -right-1 text-[10px] font-medium px-2 py-0.5 rounded-full shadow-lg"
              style={{ backgroundColor: primaryColor, color: '#ffffff' }}
            >
              {config.version_sistema}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight" style={{ color: textColor }}>
            {config.nombre_sistema}
          </h1>
          <p className="text-sm mt-1" style={{ color: textSecondaryColor }}>
            Sistema SCADA de Elevadores
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mensaje de error */}
          {error && (
            <div 
              className="p-3 rounded-xl text-sm flex items-center gap-2 animate-shake"
              style={{
                backgroundColor: errorBgColor,
                color: errorTextColor,
                border: `1px solid ${errorBorderColor}`
              }}
            >
              {/* {console.log(' [Login] Renderizando error:', error)} */}
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondaryColor }}>
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                </svg>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: inputBgColor,
                  border: `1px solid ${inputBorderColor}`,
                  color: inputTextColor,
                }}
                placeholder="Ingresa tu usuario"
                required
                autoFocus
                disabled={loading}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: textSecondaryColor }}>
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm0 2a2 2 0 012 2v2H8V6a2 2 0 012-2z"/>
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:outline-none"
                style={{
                  backgroundColor: inputBgColor,
                  border: `1px solid ${inputBorderColor}`,
                  color: inputTextColor,
                }}
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: textSecondaryColor }}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Botón Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-medium text-white transition-all duration-300 relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
              boxShadow: `0 4px 15px ${primaryColor}40`,
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(90deg, transparent, ${primaryColor}40, transparent)`,
                transform: 'translateX(-100%)',
                animation: 'shimmer 2s infinite'
              }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Verificando credenciales...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 010-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </>
              )}
            </span>
          </button>

          {/* Selector de tema */}
          <div className="flex justify-center mt-4 gap-2">
            {Object.keys(TEMAS || {}).map((key) => {
              const previewColor = getBackgroundValue(TEMAS[key]?.sidebar) || '#3b82f6';
              return (
                <button
                  key={key}
                  onClick={() => cambiarTema(key)}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                    temaActual === key ? 'border-current scale-110 shadow-lg' : 'border-gray-300/50 opacity-60 hover:opacity-100'
                  }`}
                  style={{ 
                    backgroundColor: previewColor,
                    borderColor: temaActual === key ? previewColor : 'rgba(255,255,255,0.3)',
                    boxShadow: temaActual === key ? `0 0 20px ${previewColor}50` : 'none'
                  }}
                  title={TEMAS[key]?.nombre || key}
                />
              );
            })}
          </div>
        </form>

        <div className="mt-6 text-center text-xs" style={{ color: textMutedColor }}>
          {config.nombre_sistema} {config.version_sistema}
        </div>
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes kenBurns {
          0% { transform: scale(1.05) rotate(0deg); }
          50% { transform: scale(1.1) rotate(1deg); }
          100% { transform: scale(1.05) rotate(0deg); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-pulse { animation: pulse 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Login;
// frontend/src/components/pages/Estilos/Estilos.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSafeTheme } from '../../../hooks/useSafeTheme';
import { usePermisos } from '../../../context/PermisoContext';
import api from '../../../services/api';
import ColorPickerAdvanced from '../../../components/common/ColorPickerAdvanced';

// ============================================
// FUNCIONES DE UTILIDAD - CORREGIDAS
// ============================================
const getCardColorsConfig = async () => {
  try {
    const response = await api.get('/preferencias/card-colors');
    return response.data;
  } catch (error) {
    console.warn('Error cargando configuración de colores de cards:', error);
    return null;
  }
};

const saveCardColorsConfig = async (config) => {
  try {
    const response = await api.put('/preferencias/card-colors', config);
    return response.data;
  } catch (error) {
    console.error('Error guardando configuración de colores de cards:', error);
    throw error;
  }
};

const getColorValue = (colorObj) => {
  if (!colorObj) return null;
  
  if (typeof colorObj === 'string') {
    try {
      const parsed = JSON.parse(colorObj);
      if (parsed && typeof parsed === 'object' && parsed.value) {
        return parsed.value;
      }
      return colorObj;
    } catch (e) {
      return colorObj;
    }
  }
  
  if (typeof colorObj === 'object' && colorObj !== null) {
    if (colorObj.value) {
      return colorObj.value;
    }
    return null;
  }
  return colorObj;
};

const getRealValue = (val) => {
  if (!val) return null;
  
  // ✅ Si es un string, intentar parsear JSON
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object') {
        if (parsed.value) {
          return parsed.value;
        }
        if (parsed.type === 'gradient' && parsed.gradient) {
          const colors = parsed.gradient.colors || ['#3b82f6', '#8b5cf6'];
          return colors[0] || '#888888';
        }
      }
      return val;
    } catch (e) {
      return val;
    }
  }
  
  // ✅ Si es un objeto directamente
  if (typeof val === 'object' && val !== null) {
    if (val.value) {
      return val.value;
    }
    if (val.type === 'gradient' && val.gradient) {
      const colors = val.gradient.colors || ['#3b82f6', '#8b5cf6'];
      return colors[0] || '#888888';
    }
    return null;
  }
  
  return val;
};

const getColorPreview = (colorValue) => {
  if (!colorValue) return '#cccccc';
  
  // ✅ Si es un string JSON
  if (typeof colorValue === 'string') {
    try {
      const parsed = JSON.parse(colorValue);
      if (parsed && typeof parsed === 'object') {
        if (parsed.value) {
          // Si es un gradiente, tomar el primer color
          if (parsed.type === 'gradient' && parsed.gradient) {
            const colors = parsed.gradient.colors || ['#3b82f6', '#8b5cf6'];
            return colors[0] || '#888888';
          }
          return parsed.value;
        }
        if (parsed.gradient) {
          const colors = parsed.gradient.colors || ['#3b82f6', '#8b5cf6'];
          return colors[0] || '#888888';
        }
      }
      return colorValue;
    } catch (e) {
      // Si no es JSON, continuar
    }
  }
  
  // ✅ Si es un objeto JSON
  if (typeof colorValue === 'object' && colorValue !== null) {
    if (colorValue.value) {
      if (colorValue.type === 'gradient' && colorValue.gradient) {
        const colors = colorValue.gradient.colors || ['#3b82f6', '#8b5cf6'];
        return colors[0] || '#888888';
      }
      return colorValue.value;
    }
    if (colorValue.gradient) {
      const colors = colorValue.gradient.colors || ['#3b82f6', '#8b5cf6'];
      return colors[0] || '#888888';
    }
    return '#cccccc';
  }
  
  // ✅ Si es un string (HEX o clase CSS)
  if (typeof colorValue === 'string') {
    if (colorValue.startsWith('#')) return colorValue;
    if (colorValue.startsWith('rgba')) return colorValue;
    
    const colorMap = {
      'primary-500': '#3b82f6',
      'gray-900': '#111827',
      'gray-800': '#1f2937',
      'gray-700': '#374151',
      'gray-600': '#4b5563',
      'gray-500': '#6b7280',
      'gray-400': '#9ca3af',
      'gray-300': '#d1d5db',
      'gray-200': '#e5e7eb',
      'gray-100': '#f3f4f6',
      'gray-50': '#f9fafb',
      'white': '#ffffff',
      'slate-800': '#1e293b',
      'slate-900': '#0f172a',
      'slate-950': '#020617',
      'cyan-400': '#22d3ee',
      'cyan-500': '#06b6d4',
      'cyan-600': '#0891b2',
      'cyan-700': '#0e7490',
      'pink-300': '#f9a8d4',
      'pink-400': '#f472b6',
      'pink-600': '#db2777',
      'purple-700': '#7e22ce',
    };
    
    for (const [key, value] of Object.entries(colorMap)) {
      if (colorValue.includes(key)) return value;
    }
    
    const hexMatch = colorValue.match(/bg-\[#([0-9a-fA-F]{6})\]/);
    if (hexMatch) return `#${hexMatch[1]}`;
  }
  
  return '#cccccc';
};

// ✅ COMPONENTE DE PREVISUALIZACIÓN - CORREGIDO
const EstilosPreviewModal = ({ tema, isOpen, onClose }) => {
  if (!isOpen || !tema) return null;

  // ✅ Función para obtener valor real (parsea JSON)
  const getRealValue = (val) => {
    if (!val) return null;
    
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (parsed && typeof parsed === 'object' && parsed.value) {
          return parsed.value;
        }
        if (parsed && typeof parsed === 'object' && parsed.gradient) {
          const colors = parsed.gradient.colors || ['#3b82f6', '#8b5cf6'];
          return colors[0] || '#888888';
        }
        return val;
      } catch (e) {
        return val;
      }
    }
    
    if (typeof val === 'object' && val !== null) {
      if (val.value) return val.value;
      if (val.type === 'gradient' && val.gradient) {
        const colors = val.gradient.colors || ['#3b82f6', '#8b5cf6'];
        return colors[0] || '#888888';
      }
      return null;
    }
    return val;
  };

  // ✅ Obtener todos los colores reales
  const colors = {
    // Fondo principal
    background: getRealValue(tema.background) || '#f9fafb',
    
    // Sidebar
    sidebar: getRealValue(tema.sidebar) || '#3b82f6',
    sidebarText: getRealValue(tema.sidebar_text) || '#d1d5db',
    sidebarLogoText: getRealValue(tema.sidebar_logo_text) || '#ffffff',
    sidebarMenuText: getRealValue(tema.sidebar_menu_text) || '#d1d5db',
    sidebarMenuActiveBg: getRealValue(tema.sidebar_menu_active_bg) || 'transparent',
    sidebarMenuActiveText: getRealValue(tema.sidebar_menu_active_text) || '#ffffff',
    sidebarMenuActiveBorder: getRealValue(tema.sidebar_menu_active_border) || 'transparent',
    
    // Topbar
    topbar: getRealValue(tema.topbar) || '#3b82f6',
    topbarText: getRealValue(tema.topbar_text) || '#ffffff',
    
    // Cards
    card: getRealValue(tema.card) || '#ffffff',
    cardShadow: getRealValue(tema.card_shadow) || '0 1px 3px rgba(0,0,0,0.1)',
    
    // Textos
    text: getRealValue(tema.text) || '#1f2937',
    textSecondary: getRealValue(tema.text_secondary) || '#4b5563',
    textMuted: getRealValue(tema.text_muted) || '#9ca3af',
    
    // Bordes
    border: getRealValue(tema.border) || '#e5e7eb',
    
    // Inputs
    input: getRealValue(tema.input) || '#ffffff',
    inputPlaceholder: getRealValue(tema.input_placeholder) || '#9ca3af',
    
    // Login
    loginBg: getRealValue(tema.login_bg) || '#0f172a',
    
    // Botones
    buttonPrimaryBg: getRealValue(tema.button_primary_bg) || '#3b82f6',
    buttonPrimaryText: getRealValue(tema.button_primary_text) || '#ffffff',
    buttonPrimaryHover: getRealValue(tema.button_primary_hover) || '#2563eb',
    buttonSecondaryBg: getRealValue(tema.button_secondary_bg) || '#f3f4f6',
    buttonSecondaryText: getRealValue(tema.button_secondary_text) || '#374151',
    buttonSecondaryHover: getRealValue(tema.button_secondary_hover) || '#e5e7eb',
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h3 className="text-lg font-semibold text-primary-500">
              Previsualización: {tema.nombre}
            </h3>
            <p className="text-sm text-text-muted">Vista previa de los estilos aplicados</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ============================================
               VISTA PREVIA DE LA INTERFAZ
               ============================================ */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-medium text-text-muted">🏠 Vista previa de la interfaz</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
              </div>
            </div>

            <div 
              className="p-4"
              style={{ backgroundColor: colors.background }}
            >
              {/* Topbar */}
              <div 
                className="rounded-t-lg flex items-center px-4 h-12 gap-3"
                style={{ 
                  backgroundColor: colors.topbar,
                  color: colors.topbarText,
                }}
              >
                <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-xs">☰</div>
                <div className="flex-1">
                  <span className="text-sm font-semibold">{tema.nombre} SCADA</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20"></div>
                  <div className="w-6 h-6 rounded-full bg-white/20"></div>
                </div>
              </div>

              <div className="flex min-h-[220px]">
                {/* Sidebar */}
                <div 
                  className="w-36 flex-shrink-0 p-2 rounded-bl-lg"
                  style={{ backgroundColor: colors.sidebar }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">🏢</div>
                    <span 
                      className="text-xs font-semibold"
                      style={{ color: colors.sidebarLogoText }}
                    >
                      {tema.nombre}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div 
                      className="text-xs px-2 py-1.5 rounded"
                      style={{ 
                        backgroundColor: colors.sidebarMenuActiveBg,
                        color: colors.sidebarMenuActiveText,
                        borderRight: `2px solid ${colors.sidebarMenuActiveBorder}`
                      }}
                    >
                      📊 Dashboard
                    </div>
                    <div 
                      className="text-xs px-2 py-1.5 rounded"
                      style={{ color: colors.sidebarMenuText }}
                    >
                      🏢 Elevadores
                    </div>
                    <div 
                      className="text-xs px-2 py-1.5 rounded"
                      style={{ color: colors.sidebarMenuText }}
                    >
                      🔔 Alarmas
                    </div>
                    <div 
                      className="text-xs px-2 py-1.5 rounded"
                      style={{ color: colors.sidebarMenuText }}
                    >
                      📋 Reportes
                    </div>
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 p-3">
                  <div 
                    className="rounded-lg p-3"
                    style={{ 
                      backgroundColor: colors.card,
                      boxShadow: colors.cardShadow,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <h4 className="text-sm font-semibold" style={{ color: colors.text }}>
                      Contenido principal
                    </h4>
                    <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                      Esta es una previsualización de cómo se verán los estilos.
                    </p>
                    
                    {/* Cards de ejemplo */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div 
                        className="rounded-lg p-2 border"
                        style={{ 
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        }}
                      >
                        <div className="text-xs font-medium" style={{ color: colors.text }}>Card 1</div>
                        <div className="text-[10px] mt-0.5" style={{ color: colors.textMuted }}>Contenido</div>
                      </div>
                      <div 
                        className="rounded-lg p-2 border"
                        style={{ 
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        }}
                      >
                        <div className="text-xs font-medium" style={{ color: colors.text }}>Card 2</div>
                        <div className="text-[10px] mt-0.5" style={{ color: colors.textMuted }}>Contenido</div>
                      </div>
                    </div>

                    {/* Botones de ejemplo */}
                    <div className="flex gap-2 mt-3">
                      <button 
                        className="px-3 py-1 text-xs rounded-lg font-medium"
                        style={{ 
                          backgroundColor: colors.buttonPrimaryBg,
                          color: colors.buttonPrimaryText,
                        }}
                      >
                        Primario
                      </button>
                      <button 
                        className="px-3 py-1 text-xs rounded-lg font-medium border"
                        style={{ 
                          backgroundColor: colors.buttonSecondaryBg,
                          color: colors.buttonSecondaryText,
                          borderColor: colors.border,
                        }}
                      >
                        Secundario
                      </button>
                      <button 
                        className="px-3 py-1 text-xs rounded-lg font-medium"
                        style={{ 
                          backgroundColor: 'transparent',
                          color: colors.buttonPrimaryBg,
                          border: `1px solid ${colors.buttonPrimaryBg}`,
                        }}
                      >
                        Outline
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div 
                className="h-8 flex items-center justify-center text-xs opacity-50 rounded-b-lg"
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.textMuted,
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                {tema.nombre} SCADA v1.0
              </div>
            </div>
          </div>

          {/* ============================================
               VISTA PREVIA DEL LOGIN
               ============================================ */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-medium text-text-muted">🔐 Vista previa del Login</span>
            </div>
            <div 
              className="p-6 flex justify-center"
              style={{ backgroundColor: colors.loginBg }}
            >
              <div 
                className="w-64 rounded-xl p-6 text-center"
                style={{ 
                  backgroundColor: colors.card,
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.cardShadow,
                }}
              >
                <div className="text-3xl mb-3">🏢</div>
                <div 
                  className="text-base font-semibold"
                  style={{ color: colors.text }}
                >
                  {tema.nombre}
                </div>
                <div 
                  className="text-xs mt-1 opacity-60"
                  style={{ color: colors.textSecondary }}
                >
                  Sistema SCADA
                </div>
                <div className="mt-4 space-y-2">
                  <input 
                    type="text" 
                    placeholder="Usuario"
                    className="w-full px-3 py-2 text-sm rounded-lg border"
                    style={{ 
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  />
                  <input 
                    type="password" 
                    placeholder="Contraseña"
                    className="w-full px-3 py-2 text-sm rounded-lg border"
                    style={{ 
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  />
                  <button 
                    className="w-full py-2 text-sm rounded-lg font-medium"
                    style={{ 
                      backgroundColor: colors.buttonPrimaryBg,
                      color: colors.buttonPrimaryText,
                    }}
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL ESTILOS
// ============================================
const Estilos = () => {
  const theme = useSafeTheme();
  const { permisos, puedeEditar, puedeCrear, puedeEliminar, puedeVer } = usePermisos();
  
  // ✅ DESESTRUCTURAR theme
  const { 
    temaActual, 
    TEMAS, 
    cambiarTema, 
    recargarTemas, 
    usarTemasBD 
  } = theme;

  // ✅ isDark
  const isDark = temaActual === 'oscuro';

  // ✅ COLORES DEL TEMA
  const temaConfig = TEMAS?.[temaActual] || TEMAS?.default || {};
  
  const getColorFromTheme = (colorObj) => {
    if (!colorObj) return null;
    if (typeof colorObj === 'object' && colorObj.value) {
      return colorObj.value;
    }
    return colorObj;
  };

  const themePrimary = getColorFromTheme(temaConfig.buttonPrimaryBg) || '#3b82f6';
  const themeTextColor = getColorFromTheme(temaConfig.text) || (isDark ? '#f3f4f6' : '#1f2937');
  const themeTextSecondary = getColorFromTheme(temaConfig.textSecondary) || (isDark ? '#9ca3af' : '#4b5563');
  const themeTextMuted = getColorFromTheme(temaConfig.textMuted) || (isDark ? '#6b7280' : '#9ca3af');
  const themeBgColor = getColorFromTheme(temaConfig.background) || (isDark ? '#111827' : '#f9fafb');
  const themeCardBg = getColorFromTheme(temaConfig.card) || (isDark ? '#1f2937' : '#ffffff');
  const themeBorderColor = getColorFromTheme(temaConfig.border) || (isDark ? '#374151' : '#e5e7eb');

  //  ESTADOS
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [editandoTema, setEditandoTema] = useState(null);
  const [temasBD, setTemasBD] = useState([]);
  const [cargandoTemas, setCargandoTemas] = useState(false);
  
  //  ESTADOS CARD COLORS
  const [cardColors, setCardColors] = useState({
    cardBg: '#ffffff',
    cardText: '#1f2937',
    cardBorder: '#e5e7eb',
    cardShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cardHover: '0 10px 40px rgba(0,0,0,0.15)',
  });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTema, setPreviewTema] = useState(null);
  const [savingCardColors, setSavingCardColors] = useState(false);

  //  Cargar configuración de colores de cards
  useEffect(() => {
    const loadCardColors = async () => {
      try {
        const config = await getCardColorsConfig();
        if (config) {
          setCardColors({
            cardBg: config.cardBg || '#ffffff',
            cardText: config.cardText || '#1f2937',
            cardBorder: config.cardBorder || '#e5e7eb',
          });
        }
      } catch (error) {
        console.error('Error loading card colors:', error);
      }
    };
    loadCardColors();
  }, []);

  //  Guardar configuración de colores de cards
  const handleSaveCardColors = async () => {
    setSavingCardColors(true);
    try {
      await saveCardColorsConfig(cardColors);
      setMessage({ type: 'success', text: 'Configuración de colores guardada correctamente' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSavingCardColors(false);
    }
  };

  //  Cargar temas desde BD
  useEffect(() => {
    if (usarTemasBD) {
      cargarTemasDesdeBD();
    }
  }, [usarTemasBD]);

  const cargarTemasDesdeBD = async () => {
    setCargandoTemas(true);
    try {
      const response = await api.get('/temas/');
      setTemasBD(response.data);
    } catch (error) {
      console.error('Error cargando temas desde BD:', error);
    } finally {
      setCargandoTemas(false);
    }
  };

  //  HANDLERS
  const handleCambiarTema = async (key) => {
    setLoading(true);
    setMessage(null);
    try {
      await cambiarTema(key);
      await recargarTemas();
      await cargarTemasDesdeBD();
      setMessage({ type: 'success', text: `Tema cambiado a "${TEMAS[key]?.nombre || key}"` });
    } catch (error) {
      console.error('Error cambiando tema:', error);
      setMessage({ type: 'error', text: 'Error al cambiar el tema' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCrearNuevoTema = () => {
    setEditandoTema({
      clave: '',
      nombre: '',
      activo: true,
      // ... atributos ...
    });
  };

  const handleEditarTema = (tema) => {
    setEditandoTema({ ...tema });
  };

  const handleEliminarTema = async (id_tema) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este tema?')) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.delete(`/temas/${id_tema}`);
      setMessage({ type: 'success', text: 'Tema eliminado correctamente' });
      await cargarTemasDesdeBD();
      await recargarTemas();
    } catch (error) {
      console.error('Error eliminando tema:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el tema' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleGuardarTema = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const dataToSend = { ...editandoTema };
      delete dataToSend.id_tema;
      delete dataToSend.created_at;
      delete dataToSend.updated_at;
      dataToSend.activo = true;

      let response;
      if (editandoTema.id_tema) {
        response = await api.put(`/temas/${editandoTema.id_tema}`, dataToSend);
      } else {
        response = await api.post('/temas/', dataToSend);
      }
      
      if (response.status === 200 || response.status === 201) {
        setMessage({ 
          type: 'success', 
          text: editandoTema.id_tema 
            ? `Tema "${editandoTema.nombre}" actualizado correctamente` 
            : `Tema "${editandoTema.nombre}" creado correctamente`
        });
        await cargarTemasDesdeBD();
        await recargarTemas();
        setEditandoTema(null);
      }
    } catch (error) {
      console.error('Error guardando tema:', error);
      setMessage({ type: 'error', text: 'Error al guardar el tema' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditandoTema(prev => ({ ...prev, [name]: value }));
  };

  const getTemaNombre = () => {
    return TEMAS[temaActual]?.nombre || 'Default';
  };

  //  getTemasList - ahora usa temasBD del estado
  const getTemasList = () => {
    if (usarTemasBD && temasBD.length > 0) {
      // console.log(' temasBD raw:', temasBD);
      return temasBD.map(tema => {
        // console.log(' tema.sidebar:', tema.sidebar);
        // console.log(' tema.sidebar type:', typeof tema.sidebar);
        // console.log(' tema.sidebar parsed:', getRealValue(tema.sidebar));
        
        return {
          key: tema.clave,
          label: tema.nombre,
          id_tema: tema.id_tema,
          activo: tema.activo,
          colores: {
            sidebar: getRealValue(tema.sidebar) || '#1e293b',
            topbar: getRealValue(tema.topbar) || '#1e293b',
            fondo: getRealValue(tema.background) || '#f1f5f9',
            texto: getRealValue(tema.text) || '#1e293b'
          }
        };
      });
    }
    return Object.keys(TEMAS).map(key => ({
      key: key,
      label: TEMAS[key]?.nombre || key,
      colores: {
        sidebar: TEMAS[key]?.sidebar?.replace('bg-', '') || '#1e293b',
        topbar: TEMAS[key]?.topbar?.replace('bg-', '') || '#1e293b',
        fondo: TEMAS[key]?.background?.replace('bg-', '') || '#f1f5f9',
        texto: TEMAS[key]?.text?.replace('text-', '') || '#1e293b'
      }
    }));
  };

  const temasList = getTemasList();

  // ============================================
  // RENDER ATRIBUTOS - ORGANIZADO POR SECCIONES
  // ============================================
  const renderAtributos = () => {
    if (!editandoTema) return null;

    //  Función para obtener valor real (parsea JSON)
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
        return val.value || null;
      }
      return val;
    };

    //  Función para obtener color de fondo (para rgba)
    const getBgValue = (val) => {
      if (!val) return 'transparent';
      const real = getRealValue(val);
      return real || 'transparent';
    };

    const getColorValue = (val) => {
      if (!val) return '#3b82f6';
      const real = getRealValue(val);
      return real || '#3b82f6';
    };
    
    //  Secciones organizadas
    const secciones = [
      {
        titulo: ' Sidebar',
        icono: '📐',
        preview: (tema) => {
          const sidebarBg = getBgValue(tema.sidebar);
          const sidebarText = getRealValue(tema.sidebar_text) || '#d1d5db';
          const sidebarLogoText = getRealValue(tema.sidebar_logo_text) || '#ffffff';
          const sidebarMenuText = getRealValue(tema.sidebar_menu_text) || '#d1d5db';
          const sidebarMenuActiveBg = getBgValue(tema.sidebar_menu_active_bg);
          const sidebarMenuActiveText = getRealValue(tema.sidebar_menu_active_text) || '#ffffff';
          const sidebarMenuActiveBorder = getRealValue(tema.sidebar_menu_active_border) || 'transparent';
          const sidebarHover = getBgValue(tema.sidebar_hover);

          return (
            <div 
              className="mt-2 p-3 rounded-lg border transition-all duration-300"
              style={{ 
                backgroundColor: sidebarBg,
                borderColor: sidebarBg,
              }}
            >
              {/* Logo */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{ borderColor: sidebarText + '30' }}>
                <span className="text-lg" style={{ color: sidebarLogoText }}>🏢</span>
                <span className="text-sm font-semibold" style={{ color: sidebarLogoText }}>
                  {tema.nombre || 'Tema'}
                </span>
                <span className="text-[10px] ml-auto opacity-50" style={{ color: sidebarLogoText }}>
                  v1.0
                </span>
              </div>

              {/* Menús */}
              <div className="space-y-0.5">
                {/* Menú activo */}
                <div 
                  className="text-xs px-2 py-1.5 rounded flex items-center gap-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: sidebarMenuActiveBg,
                    color: sidebarMenuActiveText,
                    borderRight: `2px solid ${sidebarMenuActiveBorder}`,
                    boxShadow: sidebarMenuActiveBg !== 'transparent' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <span>📊</span>
                  <span className="font-medium">Dashboard</span>
                  <span className="ml-auto text-[10px] opacity-50">✓</span>
                </div>

                {/* Menú normal con hover */}
                <div 
                  className="text-xs px-2 py-1.5 rounded flex items-center gap-2 transition-all duration-300 hover-effect"
                  style={{ 
                    color: sidebarMenuText,
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = sidebarHover;
                    e.currentTarget.style.color = sidebarLogoText;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = sidebarMenuText;
                  }}
                >
                  <span>🏢</span>
                  <span>Elevadores</span>
                </div>

                {/* Menú normal */}
                <div 
                  className="text-xs px-2 py-1.5 rounded flex items-center gap-2"
                  style={{ 
                    color: sidebarMenuText,
                    backgroundColor: 'transparent',
                  }}
                >
                  <span>🔔</span>
                  <span>Alarmas</span>
                </div>

                {/* Menú normal */}
                <div 
                  className="text-xs px-2 py-1.5 rounded flex items-center gap-2"
                  style={{ 
                    color: sidebarMenuText,
                    backgroundColor: 'transparent',
                  }}
                >
                  <span>📋</span>
                  <span>Reportes</span>
                </div>
              </div>

              {/* Footer del sidebar preview */}
              <div className="mt-2 pt-2 border-t flex justify-between" style={{ borderColor: sidebarText + '30' }}>
                <span className="text-[10px] opacity-50" style={{ color: sidebarMenuText }}>
                  {tema.nombre || 'Tema'} v1.0
                </span>
                <span className="text-[10px] opacity-30" style={{ color: sidebarMenuText }}>
                  🔒 Cerrar sesión
                </span>
              </div>

              {/* Indicador de hover */}
              <div className="mt-1 text-[8px] opacity-40 text-center" style={{ color: sidebarMenuText }}>
                Pasa el mouse sobre "Elevadores" para ver el efecto hover
              </div>
            </div>
          );
        },
        atributos: [
          { key: 'sidebar', label: 'Fondo del Sidebar' },
          { key: 'sidebar_text', label: 'Texto del Sidebar' },
          { key: 'sidebar_active', label: 'Sidebar Activo (hover)' },
          { key: 'sidebar_hover', label: 'Sidebar Hover' },
          { key: 'sidebar_logo_text', label: 'Logo Texto' },
          { key: 'sidebar_menu_text', label: 'Menú Texto' },
          { key: 'sidebar_menu_active_bg', label: 'Menú Activo Fondo' },
          { key: 'sidebar_menu_active_text', label: 'Menú Activo Texto' },
          { key: 'sidebar_menu_active_border', label: 'Menú Activo Borde' },
        ]
      },
      {
        titulo: ' Topbar',
        icono: '🔝',
        preview: (tema) => {
          const topbarBg = getBgValue(tema.topbar);
          const topbarText = getRealValue(tema.topbar_text) || '#ffffff';
          const borderColor = getRealValue(tema.border) || '#e5e7eb';

          return (
            <div 
              className="mt-2 p-2 rounded-lg border transition-all duration-300"
              style={{ 
                backgroundColor: topbarBg,
                borderColor: borderColor,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: topbarText }}>☰</span>
                <span className="text-sm font-semibold" style={{ color: topbarText }}>
                  {tema.nombre || 'Tema'} SCADA
                </span>
                <div className="flex-1"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: topbarText + '80' }}>⏰ 12:30</span>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ 
                    backgroundColor: topbarText + '20',
                    color: topbarText 
                  }}>
                    👤
                  </span>
                </div>
              </div>
            </div>
          );
        },
        atributos: [
          { key: 'topbar', label: 'Fondo del Topbar' },
          { key: 'topbar_text', label: 'Texto del Topbar' },
        ]
      },
      {
        titulo: ' Área Principal',
        icono: '🎨',
        preview: (tema) => {
          const bg = getBgValue(tema.background);
          const cardBg = getBgValue(tema.card);
          const cardShadow = getRealValue(tema.card_shadow) || '0 1px 3px rgba(0,0,0,0.1)';
          const textColor = getColorValue(tema.text);
          const textSecondary = getColorValue(tema.text_secondary);
          const textMuted = getColorValue(tema.text_muted);
          const borderColor = getColorValue(tema.border) || '#e5e7eb';
          const inputBg = getBgValue(tema.input);
          const inputPlaceholder = getColorValue(tema.input_placeholder);

          return (
            <div 
              className="mt-2 p-3 rounded-lg border transition-all duration-300"
              style={{ 
                backgroundColor: bg,
                borderColor: borderColor,
                minHeight: '120px',
              }}
            >
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: cardBg,
                  boxShadow: cardShadow,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <h4 className="text-sm font-semibold" style={{ color: textColor }}>
                  Contenido principal
                </h4>
                <p className="text-xs mt-1" style={{ color: textSecondary }}>
                  Este es el área de contenido principal
                </p>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="rounded-lg p-2 border" style={{ borderColor: borderColor }}>
                    <div className="text-xs font-medium" style={{ color: textColor }}>Card 1</div>
                    <div className="text-[10px] mt-0.5" style={{ color: textMuted }}>Contenido</div>
                  </div>
                  <div className="rounded-lg p-2 border" style={{ borderColor: borderColor }}>
                    <div className="text-xs font-medium" style={{ color: textColor }}>Card 2</div>
                    <div className="text-[10px] mt-0.5" style={{ color: textMuted }}>Contenido</div>
                  </div>
                </div>

                <div className="mt-2">
                  <input 
                    type="text" 
                    placeholder="Input de ejemplo"
                    className="w-full px-2 py-1 text-xs rounded border"
                    style={{ 
                      backgroundColor: inputBg,
                      borderColor: borderColor,
                      color: textColor,
                    }}
                  />
                  <div className="text-[10px] mt-0.5" style={{ color: inputPlaceholder }}>
                    Placeholder color
                  </div>
                </div>
              </div>
            </div>
          );
        },
        atributos: [
          { key: 'background', label: 'Fondo Principal' },
          { key: 'card', label: 'Card Fondo' },
          { key: 'card_shadow', label: 'Card Sombra (CSS)' },
          { key: 'text', label: 'Texto Principal' },
          { key: 'text_secondary', label: 'Texto Secundario' },
          { key: 'text_muted', label: 'Texto Muted' },
          { key: 'border', label: 'Bordes' },
          { key: 'input', label: 'Input Fondo' },
          { key: 'input_placeholder', label: 'Input Placeholder' },
        ]
      },
      {
        titulo: ' Login',
        icono: '🔐',
        preview: (tema) => {
          const loginBg = getBgValue(tema.login_bg);
          const cardBg = getBgValue(tema.card);
          const textColor = getRealValue(tema.text) || '#1f2937';
          const textSecondary = getRealValue(tema.text_secondary) || '#4b5563';
          const borderColor = getRealValue(tema.border) || '#e5e7eb';
          const inputBg = getBgValue(tema.input);
          const buttonBg = getBgValue(tema.button_primary_bg);
          const buttonText = getRealValue(tema.button_primary_text) || '#ffffff';

          return (
            <div 
              className="mt-2 p-3 rounded-lg border transition-all duration-300"
              style={{ 
                backgroundColor: loginBg,
                borderColor: borderColor,
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div 
                className="w-48 p-3 rounded-lg text-center"
                style={{ 
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="text-sm font-semibold" style={{ color: textColor }}>
                  {tema.nombre || 'Tema'}
                </div>
                <div className="text-xs opacity-60" style={{ color: textSecondary }}>
                  Sistema SCADA
                </div>
                <div className="mt-2 space-y-1.5">
                  <input 
                    type="text" 
                    placeholder="Usuario"
                    className="w-full px-2 py-1 text-xs rounded border"
                    style={{ 
                      backgroundColor: inputBg,
                      borderColor: borderColor,
                      color: textColor,
                    }}
                  />
                  <input 
                    type="password" 
                    placeholder="Contraseña"
                    className="w-full px-2 py-1 text-xs rounded border"
                    style={{ 
                      backgroundColor: inputBg,
                      borderColor: borderColor,
                      color: textColor,
                    }}
                  />
                  <button 
                    className="w-full py-1 text-xs rounded font-medium"
                    style={{ 
                      backgroundColor: buttonBg,
                      color: buttonText,
                    }}
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            </div>
          );
        },
        atributos: [
          { key: 'login_bg', label: 'Login Fondo' },
          { key: 'card', label: 'Card Fondo (login)' },
          { key: 'input', label: 'Input Fondo' },
          { key: 'input_placeholder', label: 'Input Placeholder' },
        ]
      },
      {
        titulo: ' Botones',
        icono: '🔘',
        preview: (tema) => {
          const primaryBg = getBgValue(tema.button_primary_bg);
          const primaryText = getRealValue(tema.button_primary_text) || '#ffffff';
          const primaryHover = getBgValue(tema.button_primary_hover);
          const secondaryBg = getBgValue(tema.button_secondary_bg);
          const secondaryText = getRealValue(tema.button_secondary_text) || '#374151';
          const secondaryHover = getBgValue(tema.button_secondary_hover);
          const borderColor = getRealValue(tema.border) || '#e5e7eb';

          return (
            <div className="mt-2 p-3 rounded-lg border flex flex-wrap items-center gap-3" style={{
              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
              borderColor: borderColor,
            }}>
              <button 
                className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: primaryBg,
                  color: primaryText,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryHover;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = primaryBg;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Primario
              </button>
              <button 
                className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: secondaryBg,
                  color: secondaryText,
                  border: `1px solid ${borderColor}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = secondaryHover;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = secondaryBg;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Secundario
              </button>
              <button 
                className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: 'transparent',
                  color: primaryBg,
                  border: `1px solid ${primaryBg}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryBg + '20';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Outline
              </button>
              <span className="text-[10px] opacity-50" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                Pasa el mouse para ver hover
              </span>
            </div>
          );
        },
        atributos: [
          { key: 'button_primary_bg', label: 'Primario Fondo' },
          { key: 'button_primary_text', label: 'Primario Texto' },
          { key: 'button_primary_hover', label: 'Primario Hover' },
          { key: 'button_secondary_bg', label: 'Secundario Fondo' },
          { key: 'button_secondary_text', label: 'Secundario Texto' },
          { key: 'button_secondary_hover', label: 'Secundario Hover' },
          { key: 'button', label: 'Botón Principal (legacy)' },
          { key: 'button_outline', label: 'Botón Outline (legacy)' },
          { key: 'button_active', label: 'Botón Activo (legacy)' },
          { key: 'button_inactive', label: 'Botón Inactivo (legacy)' },
        ]
      },
      {
        titulo: ' Tabs y Estados',
        icono: '📊',
        preview: (tema) => {
          const tabActive = getColorValue(tema.tab_active);
          const tabInactive = getColorValue(tema.tab_inactive) || 'transparent';
          const estadoNormal = getColorValue(tema.estado_normal);
          const estadoAlerta = getColorValue(tema.estado_alerta);
          const estadoFalla = getColorValue(tema.estado_falla);
          const estadoMantenimiento = getColorValue(tema.estado_mantenimiento);
          const borderColor = getColorValue(tema.border) || '#e5e7eb';
          const textColor = getColorValue(tema.text) || '#1f2937';

          return (
            <div className="mt-2 p-3 rounded-lg border" style={{
              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
              borderColor: borderColor,
            }}>
              <div className="flex gap-2 border-b" style={{ borderColor: borderColor }}>
                <div className="px-3 py-1 text-xs font-medium border-b-2" style={{ 
                  color: tabActive,
                  borderColor: tabActive,
                }}>
                  Activa
                </div>
                <div className="px-3 py-1 text-xs font-medium" style={{ 
                  color: tabInactive,
                  borderBottom: '2px solid transparent',
                }}>
                  Inactiva
                </div>
                <div className="px-3 py-1 text-xs font-medium" style={{ 
                  color: tabInactive,
                  borderBottom: '2px solid transparent',
                }}>
                  Otra
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-0.5 text-xs rounded-full" style={{ 
                  backgroundColor: estadoNormal + '20',
                  color: estadoNormal,
                  border: `1px solid ${estadoNormal}`,
                }}>
                  ✅ Normal
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full" style={{ 
                  backgroundColor: estadoAlerta + '20',
                  color: estadoAlerta,
                  border: `1px solid ${estadoAlerta}`,
                }}>
                  ⚠️ Alerta
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full" style={{ 
                  backgroundColor: estadoFalla + '20',
                  color: estadoFalla,
                  border: `1px solid ${estadoFalla}`,
                }}>
                  ❌ Falla
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full" style={{ 
                  backgroundColor: estadoMantenimiento + '20',
                  color: estadoMantenimiento,
                  border: `1px solid ${estadoMantenimiento}`,
                }}>
                  🔧 Mantenimiento
                </span>
              </div>
            </div>
          );
        },
        atributos: [
          { key: 'tab_active', label: 'Tab Activa' },
          { key: 'tab_inactive', label: 'Tab Inactiva' },
          { key: 'estado_normal', label: 'Estado Normal' },
          { key: 'estado_alerta', label: 'Estado Alerta' },
          { key: 'estado_falla', label: 'Estado Falla' },
          { key: 'estado_mantenimiento', label: 'Estado Mantenimiento' },
        ]
      },
      {
        titulo: ' Gráficas',
        icono: '📈',
        preview: (tema) => {
          const grid = getColorValue(tema.chart_grid);
          const text = getColorValue(tema.chart_text);
          const axis = getColorValue(tema.chart_axis);
          const tooltipBg = getBgValue(tema.chart_tooltip_bg);
          const tooltipText = getColorValue(tema.chart_tooltip_text);
          const tooltipBorder = getColorValue(tema.chart_tooltip_border);
          const borderColor = getColorValue(tema.border) || '#e5e7eb';

          return (
            <div className="mt-2 p-3 rounded-lg border" style={{
              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
              borderColor: borderColor,
            }}>
              <div className="h-16 rounded-lg relative" style={{ 
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: `1px solid ${grid}`,
              }}>
                {/* Barras de gráfica simuladas */}
                <div className="absolute bottom-0 left-2 w-6 h-8 rounded-sm" style={{ backgroundColor: axis }}></div>
                <div className="absolute bottom-0 left-10 w-6 h-12 rounded-sm" style={{ backgroundColor: axis }}></div>
                <div className="absolute bottom-0 left-18 w-6 h-6 rounded-sm" style={{ backgroundColor: axis }}></div>
                <div className="absolute bottom-0 left-26 w-6 h-14 rounded-sm" style={{ backgroundColor: axis }}></div>
                <div className="absolute bottom-0 left-34 w-6 h-10 rounded-sm" style={{ backgroundColor: axis }}></div>
                
                {/* Línea de tendencia */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline points="0,70 20,50 40,80 60,30 80,60 100,40" fill="none" stroke={axis} strokeWidth="2"/>
                </svg>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px]" style={{ color: text }}>Eje X</span>
                <div className="flex-1 h-px" style={{ backgroundColor: axis }}></div>
                <span className="text-[10px]" style={{ color: text }}>Eje Y</span>
              </div>
              <div className="mt-2 p-1 rounded border text-[10px]" style={{
                backgroundColor: tooltipBg,
                color: tooltipText,
                borderColor: tooltipBorder,
              }}>
                📊 Tooltip de ejemplo
              </div>
            </div>
          );
        },
        atributos: [
          { key: 'chart_grid', label: 'Chart Grid' },
          { key: 'chart_text', label: 'Chart Texto' },
          { key: 'chart_axis', label: 'Chart Ejes' },
          { key: 'chart_tooltip_bg', label: 'Chart Tooltip Fondo' },
          { key: 'chart_tooltip_text', label: 'Chart Tooltip Texto' },
          { key: 'chart_tooltip_border', label: 'Chart Tooltip Borde' },
        ]

      },
      {
        titulo: ' Tablas',
        icono: '📋',
        preview: (tema) => {
          const header = getBgValue(tema.table_header);
          const rowHover = getBgValue(tema.table_row_hover);
          const border = getColorValue(tema.table_border) || '#e5e7eb';
          const textColor = getColorValue(tema.text) || '#1f2937';
          const textSecondary = getColorValue(tema.text_secondary) || '#4b5563';

          return (
            <div className="mt-2 p-3 rounded-lg border" style={{
              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
              borderColor: border,
            }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: header }}>
                    <th className="px-2 py-1 text-left font-medium" style={{ color: textColor }}>Columna 1</th>
                    <th className="px-2 py-1 text-left font-medium" style={{ color: textColor }}>Columna 2</th>
                    <th className="px-2 py-1 text-left font-medium" style={{ color: textColor }}>Columna 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover-row" style={{ borderTop: `1px solid ${border}` }}>
                    <td className="px-2 py-1" style={{ color: textSecondary }}>Dato 1</td>
                    <td className="px-2 py-1" style={{ color: textSecondary }}>Dato 2</td>
                    <td className="px-2 py-1" style={{ color: textSecondary }}>Dato 3</td>
                  </tr>
                  <tr className="hover-row" style={{ borderTop: `1px solid ${border}` }}>
                    <td className="px-2 py-1" style={{ color: textSecondary }}>Dato 4</td>
                    <td className="px-2 py-1" style={{ color: textSecondary }}>Dato 5</td>
                    <td className="px-2 py-1" style={{ color: textSecondary }}>Dato 6</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-1 text-[10px] opacity-50" style={{ color: textSecondary }}>
                Pasa el mouse sobre una fila para ver el hover
              </div>
              <style>{`
                .hover-row:hover {
                  background-color: ${rowHover};
                }
              `}</style>
            </div>
          );
        },
        atributos: [
          { key: 'table_header', label: 'Tabla Header' },
          { key: 'table_row_hover', label: 'Tabla Row Hover' },
          { key: 'table_border', label: 'Tabla Borde' },
        ]
      },
      {
        titulo: ' Modales',
        icono: '🔄',
        preview: (tema) => {
          const modalBg = getBgValue(tema.modal_bg);
          const modalBorder = getColorValue(tema.modal_border) || '#e5e7eb';
          const modalHeader = getColorValue(tema.modal_header);
          const textColor = getColorValue(tema.text) || '#1f2937';
          const borderColor = getColorValue(tema.border) || '#e5e7eb';

          return (
            <div className="mt-2 p-3 rounded-lg border" style={{
              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
              borderColor: borderColor,
            }}>
              <div className="rounded-lg border overflow-hidden" style={{
                backgroundColor: modalBg,
                borderColor: modalBorder,
              }}>
                <div className="px-3 py-2 border-b" style={{
                  borderColor: modalBorder,
                }}>
                  <h5 className="text-xs font-semibold" style={{ color: modalHeader }}>
                    Título del Modal
                  </h5>
                </div>
                <div className="p-3">
                  <p className="text-xs" style={{ color: textColor }}>
                    Contenido del modal con los estilos seleccionados
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="px-2 py-0.5 text-[10px] rounded" style={{
                      backgroundColor: getBgValue(tema.button_primary_bg) || '#3b82f6',
                      color: getColorValue(tema.button_primary_text) || '#ffffff',
                    }}>
                      Aceptar
                    </button>
                    <button className="px-2 py-0.5 text-[10px] rounded border" style={{
                      borderColor: modalBorder,
                      color: textColor,
                    }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        },
        atributos: [
          { key: 'modal_bg', label: 'Modal Fondo' },
          { key: 'modal_border', label: 'Modal Borde' },
          { key: 'modal_header', label: 'Modal Header' },
        ]

      },
      {
        titulo: ' Filtros',
        icono: '🔍',
        preview: (tema) => {
          const filterBg = getBgValue(tema.filter_bg);
          const filterShadow = getRealValue(tema.filter_shadow) || '0 1px 3px rgba(0,0,0,0.1)';
          const textColor = getColorValue(tema.text) || '#1f2937';
          const borderColor = getColorValue(tema.border) || '#e5e7eb';
          const inputBg = getBgValue(tema.input);

          return (
            <div className="mt-2 p-3 rounded-lg border" style={{
              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
              borderColor: borderColor,
            }}>
              <div className="p-2 rounded-lg" style={{
                backgroundColor: filterBg,
                boxShadow: filterShadow,
              }}>
                <div className="flex flex-wrap items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Buscar..."
                    className="px-2 py-1 text-xs rounded border flex-1 min-w-[80px]"
                    style={{ 
                      backgroundColor: inputBg,
                      borderColor: borderColor,
                      color: textColor,
                    }}
                  />
                  <select className="px-2 py-1 text-xs rounded border" style={{
                    backgroundColor: inputBg,
                    borderColor: borderColor,
                    color: textColor,
                  }}>
                    <option>Filtro 1</option>
                    <option>Filtro 2</option>
                  </select>
                  <button className="px-2 py-1 text-xs rounded" style={{
                    backgroundColor: getBgValue(tema.button_primary_bg) || '#3b82f6',
                    color: getColorValue(tema.button_primary_text) || '#ffffff',
                  }}>
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          );
        },
        atributos: [
          { key: 'filter_bg', label: 'Filter Fondo' },
          { key: 'filter_shadow', label: 'Filter Sombra (CSS)' },
        ]
      },
      {
        titulo: ' Estadísticas',
        icono: '📊',
        preview: (tema) => {
          const statCard = getBgValue(tema.stat_card);
          const statBorder = getColorValue(tema.stat_border) || '#e5e7eb';
          const statTotal = getColorValue(tema.stat_total);
          const textColor = getColorValue(tema.text) || '#1f2937';
          const textSecondary = getColorValue(tema.text_secondary) || '#4b5563';

          return (
            <div className="mt-2 p-3 rounded-lg border" style={{
              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
              borderColor: statBorder,
            }}>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg border text-center" style={{
                  backgroundColor: statCard,
                  borderColor: statBorder,
                }}>
                  <div className="text-lg font-bold" style={{ color: statTotal }}>150</div>
                  <div className="text-[10px]" style={{ color: textSecondary }}>Total</div>
                </div>
                <div className="p-2 rounded-lg border text-center" style={{
                  backgroundColor: statCard,
                  borderColor: statBorder,
                }}>
                  <div className="text-lg font-bold" style={{ color: statTotal }}>85</div>
                  <div className="text-[10px]" style={{ color: textSecondary }}>Activos</div>
                </div>
                <div className="p-2 rounded-lg border text-center" style={{
                  backgroundColor: statCard,
                  borderColor: statBorder,
                }}>
                  <div className="text-lg font-bold" style={{ color: statTotal }}>65</div>
                  <div className="text-[10px]" style={{ color: textSecondary }}>Inactivos</div>
                </div>
              </div>
            </div>
          );
        },
        atributos: [
          { key: 'stat_card', label: 'Stat Card Fondo' },
          { key: 'stat_border', label: 'Stat Borde' },
          { key: 'stat_total', label: 'Stat Total Texto' },
        ]
      },
    ];

    return (
      <div className="space-y-6">
        {secciones.map((seccion) => (
          <div key={seccion.titulo} className="border rounded-lg p-4" style={{
            borderColor: isDark ? '#334155' : '#e5e7eb',
          }}>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
              {seccion.icono} {seccion.titulo}
              <span className="text-xs font-normal opacity-50" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                (preview interactivo)
              </span>
            </h4>
            
            {/* Preview de la sección */}
            {seccion.preview && (
              <div className="mb-4">
                {seccion.preview(editandoTema)}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {seccion.atributos.map((atributo) => (
                <div key={atributo.key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                    {atributo.label}
                  </label>
                  <ColorPickerAdvanced
                    value={editandoTema[atributo.key] || '#3b82f6'}
                    onChange={(value) => {
                      setEditandoTema(prev => ({ ...prev, [atributo.key]: value }));
                    }}
                    isDark={isDark}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Agregar este useEffect para cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && editandoTema) {
        if (window.confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
          setEditandoTema(null);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [editandoTema]);

  // ============================================
  // RETURN
  // ============================================
  return (
    <div className="space-y-6" style={{ color: themeTextColor }}>
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: themePrimary }}>Estilos</h1>
          <p style={{ color: themeTextSecondary }}>Personaliza la apariencia del sistema</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span 
            className="px-4 py-2 rounded-lg text-sm"
            style={{ 
              backgroundColor: isDark ? '#374151' : '#f3f4f6',
              color: themeTextSecondary
            }}
          >
            <span style={{ color: themeTextMuted }}>Tema actual: </span>
            <span className="font-medium" style={{ color: themePrimary }}>{getTemaNombre()}</span>
          </span>
          <span className="text-xs" style={{ color: themeTextMuted }}>
            {usarTemasBD ? '📡 Usando temas de BD' : '📦 Usando temas locales'}
          </span>
          {puedeCrear('estilos') && usarTemasBD && (
            <button
              onClick={handleCrearNuevoTema}
              className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-white"
              style={{ 
                backgroundColor: themePrimary,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <span className="text-lg">+</span> Nuevo Tema
            </button>
          )}
        </div>
      </div>

      {/* MENSAJES */}
      {message && (
        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: message.type === 'success' 
              ? (isDark ? 'rgba(34,197,94,0.15)' : '#f0fdf4')
              : (isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2'),
            color: message.type === 'success' 
              ? (isDark ? '#4ade80' : '#166534')
              : (isDark ? '#f87171' : '#991b1b'),
            borderColor: message.type === 'success'
              ? (isDark ? 'rgba(34,197,94,0.3)' : '#bbf7d0')
              : (isDark ? 'rgba(239,68,68,0.3)' : '#fecaca')
          }}
        >
          {message.text}
        </div>
      )}

      {/*  CONFIGURACIÓN DE COLORES DE CARDS - CON FONDO PROPIO Y ALTO CONTRASTE */}
      <div 
        className="p-4 rounded-xl border-2 shadow-lg"
        style={{
          backgroundColor: isDark ? '#1e293b' : '#f1f5f9',  // ✅ Fondo propio (no usa el tema)
          borderColor: isDark ? '#475569' : '#cbd5e1',
          boxShadow: isDark 
            ? '0 4px 20px rgba(0,0,0,0.4)' 
            : '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" 
            style={{ 
              color: isDark ? '#e2e8f0' : '#1e293b',  // ✅ Color fijo, no del tema
            }}
        >
          <span className="text-lg">🎨</span>
          Configuración de colores de cards
          <span className="text-xs font-normal opacity-60 ml-2" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            (personaliza la apariencia de las cards)
          </span>
        </h3>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
              Fondo:
            </label>
            <input
              type="color"
              value={cardColors.cardBg}
              onChange={(e) => setCardColors({ ...cardColors, cardBg: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 shadow-sm"
              style={{ 
                borderColor: isDark ? '#475569' : '#cbd5e1',
                backgroundColor: cardColors.cardBg,
              }}
            />
            <span className="text-xs font-mono opacity-60" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              {cardColors.cardBg}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
              Texto:
            </label>
            <input
              type="color"
              value={cardColors.cardText}
              onChange={(e) => setCardColors({ ...cardColors, cardText: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 shadow-sm"
              style={{ 
                borderColor: isDark ? '#475569' : '#cbd5e1',
                backgroundColor: cardColors.cardText,
              }}
            />
            <span className="text-xs font-mono opacity-60" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              {cardColors.cardText}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
              Borde:
            </label>
            <input
              type="color"
              value={cardColors.cardBorder}
              onChange={(e) => setCardColors({ ...cardColors, cardBorder: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 shadow-sm"
              style={{ 
                borderColor: isDark ? '#475569' : '#cbd5e1',
                backgroundColor: cardColors.cardBorder,
              }}
            />
            <span className="text-xs font-mono opacity-60" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              {cardColors.cardBorder}
            </span>
          </div>

          <button
            onClick={handleSaveCardColors}
            disabled={savingCardColors}
            className="px-4 py-2 rounded-lg transition-all font-medium shadow-md disabled:opacity-50 flex items-center gap-2"
            style={{ 
              backgroundColor: isDark ? '#0ea5e9' : '#3b82f6',
              color: '#ffffff',
              boxShadow: isDark 
                ? '0 2px 12px rgba(14,165,233,0.4)' 
                : '0 2px 12px rgba(59,130,246,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = isDark 
                ? '0 4px 20px rgba(14,165,233,0.5)' 
                : '0 4px 20px rgba(59,130,246,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = isDark 
                ? '0 2px 12px rgba(14,165,233,0.4)' 
                : '0 2px 12px rgba(59,130,246,0.3)';
            }}
          >
            {savingCardColors ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                Guardar Colores
              </>
            )}
          </button>
        </div>

        {/* Vista previa de la card - con los colores seleccionados y relieve */}
        <div 
          className="mt-4 p-4 rounded-xl border-2 shadow-inner transition-all duration-300"
          style={{
            backgroundColor: cardColors.cardBg,
            color: cardColors.cardText,
            borderColor: cardColors.cardBorder,
            boxShadow: isDark 
              ? 'inset 0 2px 8px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)' 
              : 'inset 0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold">Vista previa de card</h4>
              <p className="text-xs mt-0.5 opacity-70">Los colores seleccionados se aplicarán a todas las cards</p>
            </div>
            <div className="flex gap-1">
              <span 
                className="w-3 h-3 rounded-full border" 
                style={{ 
                  backgroundColor: cardColors.cardBg,
                  borderColor: cardColors.cardBorder 
                }}
              />
              <span 
                className="w-3 h-3 rounded-full border" 
                style={{ 
                  backgroundColor: cardColors.cardText,
                  borderColor: cardColors.cardBorder 
                }}
              />
              <span 
                className="w-3 h-3 rounded-full border" 
                style={{ 
                  backgroundColor: cardColors.cardBorder,
                  borderColor: cardColors.cardBorder 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* LISTA DE TEMAS (CARDS) */}
      {cargandoTemas ? (
        <div className="flex justify-center py-12">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: themePrimary }}
          ></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {temasList.map((tema) => {
            const isActive = temaActual === tema.key;
            const temaBD = usarTemasBD ? temasBD.find(t => t.clave === tema.key) : null;
            const puedeEditarTema = puedeEditar('estilos') && usarTemasBD && temaBD;
            const puedeEliminarTema = puedeEliminar('estilos') && usarTemasBD && temaBD && !isActive;
            
            return (
              <div
                key={tema.key}
                className="rounded-xl overflow-hidden transition-all hover:shadow-lg"
                style={{
                  backgroundColor: cardColors.cardBg || (isDark ? '#1f2937' : '#ffffff'),
                  boxShadow: isActive 
                    ? `0 0 0 2px ${themePrimary}, ${cardColors.cardHover || '0 10px 40px rgba(0,0,0,0.15)'}`
                    : cardColors.cardShadow || '0 1px 3px rgba(0,0,0,0.1)',
                  border: `1px solid ${cardColors.cardBorder || (isDark ? '#374151' : '#e5e7eb')}`,
                  color: cardColors.cardText || (isDark ? '#f3f4f6' : '#1f2937'),
                  opacity: temaBD && !temaBD.activo ? 0.6 : 1,
                }}
              >
                {/* Preview de la card */}
                <div className="h-32 relative overflow-hidden" onClick={() => handleCambiarTema(tema.key)}>
                  <div 
                    className="absolute left-0 top-0 h-full w-1/3"
                    style={{ backgroundColor: tema.colores.sidebar }}
                  />
                  <div 
                    className="absolute top-0 left-0 right-0 h-8"
                    style={{ backgroundColor: tema.colores.topbar }}
                  />
                  <div 
                    className="absolute left-1/3 top-8 right-0 bottom-0"
                    style={{ backgroundColor: tema.colores.fondo }}
                  >
                    <div className="p-3">
                      <div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: tema.colores.texto + '40' }}></div>
                      <div className="h-2 w-1/2 rounded" style={{ backgroundColor: tema.colores.texto + '30' }}></div>
                      <div className="mt-2 flex gap-1">
                        <div className="h-8 w-8 rounded" style={{ backgroundColor: tema.colores.texto + '20' }}></div>
                        <div className="h-8 w-8 rounded" style={{ backgroundColor: tema.colores.texto + '20' }}></div>
                        <div className="h-8 w-8 rounded" style={{ backgroundColor: tema.colores.texto + '20' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: isActive ? themePrimary : 'rgba(0,0,0,0.5)',
                        color: '#ffffff'
                      }}
                    >
                      {isActive ? '✅ Activo' : 'Seleccionar'}
                    </span>
                  </div>
                </div>
                
                {/* Cuerpo de la card */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div onClick={() => handleCambiarTema(tema.key)} className="flex-1 cursor-pointer">
                      <h3 className="font-semibold" style={{ color: cardColors.cardText || (isDark ? '#f3f4f6' : '#1f2937') }}>
                        {tema.label}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: cardColors.cardText ? cardColors.cardText + '80' : (isDark ? '#9ca3af' : '#6b7280') }}>
                        {isActive ? 'Tema actual' : 'Haz clic para aplicar'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {puedeVer('estilos') && temaBD && (
                        <button
                          onClick={() => {
                            setPreviewTema(temaBD);
                            setShowPreviewModal(true);
                          }}
                          className="px-2 py-1 text-xs rounded transition-colors"
                          style={{
                            backgroundColor: isDark ? 'rgba(168,85,247,0.2)' : '#f3e8ff',
                            color: isDark ? '#c084fc' : '#7e22ce'
                          }}
                          title="Previsualizar"
                        >
                          👁️
                        </button>
                      )}
                      {puedeEditarTema && (
                        <button
                          onClick={() => handleEditarTema(temaBD)}
                          className="px-2 py-1 text-xs rounded transition-colors"
                          style={{
                            backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : '#dbeafe',
                            color: isDark ? '#60a5fa' : '#1d4ed8'
                          }}
                        >
                          ✏️ Editar
                        </button>
                      )}
                      {puedeEliminarTema && (
                        <button
                          onClick={() => handleEliminarTema(temaBD.id_tema)}
                          className="px-2 py-1 text-xs rounded transition-colors"
                          style={{
                            backgroundColor: isDark ? 'rgba(239,68,68,0.2)' : '#fee2e2',
                            color: isDark ? '#f87171' : '#dc2626'
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  {usarTemasBD && temaBD && (
                    <div className="mt-1 text-xs" style={{ color: themeTextMuted }}>
                      ID: {temaBD.id_tema} {!temaBD.activo && ' ⚠️ Inactivo'}
                    </div>
                  )}
                  <div className="flex gap-1 mt-2">
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ 
                        backgroundColor: tema.colores.sidebar,
                        borderColor: themeBorderColor 
                      }} 
                    />
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ 
                        backgroundColor: tema.colores.topbar,
                        borderColor: themeBorderColor 
                      }} 
                    />
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ 
                        backgroundColor: tema.colores.fondo,
                        borderColor: themeBorderColor 
                      }} 
                    />
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ 
                        backgroundColor: tema.colores.texto,
                        borderColor: themeBorderColor 
                      }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/*  MODAL DE EDICIÓN - COMPLETO Y ORGANIZADO */}
      {editandoTema && createPortal(
        <div 
          className="fixed top-0 right-0 z-[9999] h-full overflow-hidden"
          style={{
            position: 'fixed',
            top: 0,
            right: '0px',
            bottom: 0,
            width: '900px',
            height: '100vh',
            zIndex: 9999,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderLeft: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
            boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            flexGrow: 0,
            maxWidth: '900px',
            minWidth: '900px',
            // ✅ Forzar que no tenga transform
            transform: 'none',
            willChange: 'auto',
          }}
          ref={(el) => {
            if (el) {
              const rect = el.getBoundingClientRect();
              // console.log(' [Modal] 📐 POSICIÓN (PORTAL):', {
              //   left: rect.left,
              //   right: rect.right,
              //   width: rect.width,
              //   height: rect.height,
              // });
            }
          }}
        >
          {/* Header del modal */}
          <div 
            className="p-4 md:p-6 border-b flex justify-between items-center flex-shrink-0"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#e5e7eb',
            }}
          >
            <div>
              <h2 
                className="text-xl font-semibold"
                style={{ color: isDark ? '#38bdf8' : '#3b82f6' }}
              >
                {editandoTema.id_tema ? `✏️ Editar Tema: ${editandoTema.nombre}` : '➕ Crear Nuevo Tema'}
              </h2>
              <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {editandoTema.id_tema 
                  ? `Clave: ${editandoTema.clave} | ID: ${editandoTema.id_tema}`
                  : 'Completa los campos para crear un nuevo tema'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
                    setEditandoTema(null);
                  }
                }}
                className="p-2 rounded-lg transition-colors hover:bg-black/5"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                title="Cerrar (ESC)"
              >
                ✕
              </button>
              <span 
                className="text-xs opacity-40 hidden sm:inline"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              >
                ESC
              </span>
            </div>
          </div>

          {/* Cuerpo del modal */}
          <div 
            className="p-4 md:p-6 overflow-y-auto flex-1"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: isDark ? '#475569 transparent' : '#cbd5e1 transparent',
            }}
          >
            <style>{`
              .drawer-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .drawer-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .drawer-scroll::-webkit-scrollbar-thumb {
                background: ${isDark ? '#475569' : '#cbd5e1'};
                border-radius: 3px;
              }
              .drawer-scroll::-webkit-scrollbar-thumb:hover {
                background: ${isDark ? '#64748b' : '#94a3b8'};
              }
            `}</style>

            <form onSubmit={handleGuardarTema} className="drawer-scroll">
              {/* Datos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label 
                    className="block text-sm font-medium mb-1"
                    style={{ color: isDark ? '#94a3b8' : '#475569' }}
                  >
                    Clave *
                  </label>
                  <input
                    type="text"
                    name="clave"
                    value={editandoTema.clave || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#d1d5db',
                      color: isDark ? '#f1f5f9' : '#1f2937',
                    }}
                    placeholder="ej. mi_tema"
                    required={!editandoTema.id_tema}
                    disabled={!!editandoTema.id_tema}
                  />
                </div>
                <div>
                  <label 
                    className="block text-sm font-medium mb-1"
                    style={{ color: isDark ? '#94a3b8' : '#475569' }}
                  >
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={editandoTema.nombre || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#d1d5db',
                      color: isDark ? '#f1f5f9' : '#1f2937',
                    }}
                    placeholder="ej. Mi Tema"
                    required
                  />
                </div>
              </div>

              {/* Atributos de estilo */}
              <div className="mb-6">
                <h3 
                  className="text-sm font-semibold mb-4 flex items-center gap-2"
                  style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                >
                  🎨 Atributos de estilo
                  <span className="text-xs font-normal opacity-60" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                    (organizados por secciones)
                  </span>
                </h3>
                {renderAtributos()}
              </div>

              {/* Botones de acción */}
              <div 
                className="flex justify-end gap-3 pt-4 border-t sticky bottom-0"
                style={{ 
                  borderColor: isDark ? '#334155' : '#e5e7eb',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  paddingBottom: '1rem',
                  marginBottom: '-1rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.')) {
                      setEditandoTema(null);
                    }
                  }}
                  className="px-6 py-2 rounded-lg transition-colors border"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: isDark ? '#334155' : '#d1d5db',
                    color: isDark ? '#94a3b8' : '#64748b',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg transition-all font-medium text-white shadow-md disabled:opacity-50 flex items-center gap-2"
                  style={{
                    backgroundColor: isDark ? '#0ea5e9' : '#3b82f6',
                    boxShadow: isDark 
                      ? '0 2px 12px rgba(14,165,233,0.4)' 
                      : '0 2px 12px rgba(59,130,246,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      {editandoTema.id_tema ? 'Guardar Cambios' : 'Crear Tema'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body 
      )}

      {/* MODAL DE PREVISUALIZACIÓN */}
      {showPreviewModal && previewTema && (
        <EstilosPreviewModal
          tema={previewTema}
          isOpen={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewTema(null);
          }}
        />
      )}
    </div>
  );
};

export default Estilos;
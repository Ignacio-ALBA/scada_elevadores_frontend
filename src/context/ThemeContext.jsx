// frontend/src/context/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

export const ThemeContext = createContext(null);

//  FUNCIÓN PARA PARSEAR JSON SEGURO
const safeJSONParse = (str) => {
  if (!str) return null;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};

//  FUNCIÓN CORREGIDA - SIEMPRE extrae el value, incluso de strings JSON
const getBackgroundValue = (bgObj) => {
  if (!bgObj) return null;
  
  //  Si es un string, intentar parsear JSON
  let parsed = bgObj;
  if (typeof bgObj === 'string') {
    try {
      parsed = JSON.parse(bgObj);
    } catch (e) {
      // Si no es JSON válido, devolver el string
      return bgObj;
    }
  }
  
  //  Si es un objeto
  if (typeof parsed === 'object' && parsed !== null) {
    //  Si tiene value, devolverlo
    if (parsed.value) {
      return parsed.value;
    }
    //  Si es un gradiente
    if (parsed.type === 'gradient' && parsed.gradient) {
      const dir = parsed.gradient.direction || 'to right';
      const colors = parsed.gradient.colors || ['#3b82f6', '#8b5cf6'];
      return `linear-gradient(${dir}, ${colors.join(', ')})`;
    }
    //  Si es rgba
    if (parsed.type === 'rgba' && parsed.value) {
      return `rgba(${parsed.value}, ${parsed.opacity || 1})`;
    }
    return null;
  }
  
  //  Si es un string (no JSON), devolverlo
  return parsed;
};

//  FUNCIÓN CORREGIDA PARA COLORES
const getColorValue = (colorObj) => {
  if (!colorObj) return null;
  
  //  Si es un string, intentar parsear JSON
  let parsed = colorObj;
  if (typeof colorObj === 'string') {
    try {
      parsed = JSON.parse(colorObj);
    } catch (e) {
      return colorObj;
    }
  }
  
  //  Si es un objeto
  if (typeof parsed === 'object' && parsed !== null) {
    return parsed.value || null;
  }
  
  //  Si es un string (no JSON), devolverlo
  return parsed;
};

//  En cargarTemasDesdeBD, convertir los valores JSON a objetos útiles
const cargarTemasDesdeBD = async () => {
  try {
    if (!tieneToken()) {
      // console.log(' [ThemeContext] Sin token, usando temas hardcodeados');
      return TEMAS_HARDCODEADOS;
    }
    
    // console.log(' [ThemeContext] Cargando temas desde BD...');
    const response = await api.get('/temas/');
    const temasBD = response.data;
    // console.log(' [ThemeContext] Temas recibidos:', temasBD.map(t => t.clave));
    
    if (temasBD && temasBD.length > 0) {
      const temasConvertidos = {};
      temasBD.forEach(tema => {
        temasConvertidos[tema.clave] = {
          nombre: tema.nombre,
          
          // ============================================
          // TODOS LOS ATRIBUTOS - USANDO getColorValue/getBackgroundValue
          // ============================================
          
          // Sidebar
          sidebar: getBackgroundValue(tema.sidebar) || '#3b82f6',
          sidebarText: getColorValue(tema.sidebar_text) || '#d1d5db',
          sidebarActive: getBackgroundValue(tema.sidebar_active) || '#1d4ed8',
          sidebarHover: getBackgroundValue(tema.sidebar_hover) || 'rgba(255,255,255,0.1)',
          
          // Topbar
          topbar: getBackgroundValue(tema.topbar) || '#3b82f6',
          topbarText: getColorValue(tema.topbar_text) || '#ffffff',
          
          // Fondos
          background: getBackgroundValue(tema.background) || '#f9fafb',
          card: getBackgroundValue(tema.card) || '#ffffff',
          cardShadow: getColorValue(tema.card_shadow) || '0 1px 3px rgba(0,0,0,0.1)',
          loginBg: getBackgroundValue(tema.login_bg) || '#f9fafb',
          
          // Textos
          text: getColorValue(tema.text) || '#1f2937',
          textSecondary: getColorValue(tema.text_secondary) || '#4b5563',
          textMuted: getColorValue(tema.text_muted) || '#9ca3af',
          
          // Bordes e inputs
          border: getColorValue(tema.border) || '#e5e7eb',
          input: getBackgroundValue(tema.input) || '#ffffff',
          inputPlaceholder: getColorValue(tema.input_placeholder) || '#9ca3af',
          
          // Botones
          button: getBackgroundValue(tema.button) || '#3b82f6',
          buttonOutline: getBackgroundValue(tema.button_outline) || 'transparent',
          buttonActive: getBackgroundValue(tema.button_active) || '#1d4ed8',
          buttonInactive: getBackgroundValue(tema.button_inactive) || '#f3f4f6',
          
          // Tabs
          tabActive: getColorValue(tema.tab_active) || '#3b82f6',
          tabInactive: getColorValue(tema.tab_inactive) || 'transparent',
          
          // Estados
          estadoNormal: getColorValue(tema.estado_normal) || '#22c55e',
          estadoAlerta: getColorValue(tema.estado_alerta) || '#eab308',
          estadoFalla: getColorValue(tema.estado_falla) || '#ef4444',
          estadoMantenimiento: getColorValue(tema.estado_mantenimiento) || '#f97316',
          
          // Gráficas
          chartGrid: getColorValue(tema.chart_grid) || '#e5e7eb',
          chartText: getColorValue(tema.chart_text) || '#6b7280',
          chartAxis: getColorValue(tema.chart_axis) || '#d1d5db',
          chartTooltipBg: getBackgroundValue(tema.chart_tooltip_bg) || '#ffffff',
          chartTooltipText: getColorValue(tema.chart_tooltip_text) || '#000000',
          chartTooltipBorder: getColorValue(tema.chart_tooltip_border) || '#e5e7eb',
          
          // Tablas
          tableHeader: getBackgroundValue(tema.table_header) || '#f9fafb',
          tableRowHover: getBackgroundValue(tema.table_row_hover) || 'rgba(0,0,0,0.02)',
          tableBorder: getColorValue(tema.table_border) || '#e5e7eb',
          
          // Modales
          modalBg: getBackgroundValue(tema.modal_bg) || '#ffffff',
          modalBorder: getColorValue(tema.modal_border) || '#e5e7eb',
          modalHeader: getColorValue(tema.modal_header) || '#3b82f6',
          
          // Filtros
          filterBg: getBackgroundValue(tema.filter_bg) || '#ffffff',
          filterShadow: getColorValue(tema.filter_shadow) || '0 1px 3px rgba(0,0,0,0.1)',
          
          // Estadísticas
          statCard: getBackgroundValue(tema.stat_card) || '#ffffff',
          statBorder: getColorValue(tema.stat_border) || '#e5e7eb',
          statTotal: getColorValue(tema.stat_total) || '#3b82f6',
          
          // ✅ NUEVOS - SIDEBAR
          sidebarLogoText: getColorValue(tema.sidebar_logo_text) || '#ffffff',
          sidebarMenuText: getColorValue(tema.sidebar_menu_text) || '#d1d5db',
          sidebarMenuActiveBg: getBackgroundValue(tema.sidebar_menu_active_bg) || 'transparent',
          sidebarMenuActiveText: getColorValue(tema.sidebar_menu_active_text) || '#ffffff',
          sidebarMenuActiveBorder: getColorValue(tema.sidebar_menu_active_border) || 'transparent',
          
          // ✅ NUEVOS - BOTONES
          buttonPrimaryBg: getBackgroundValue(tema.button_primary_bg) || '#3b82f6',
          buttonPrimaryText: getColorValue(tema.button_primary_text) || '#ffffff',
          buttonPrimaryHover: getBackgroundValue(tema.button_primary_hover) || '#2563eb',
          buttonSecondaryBg: getBackgroundValue(tema.button_secondary_bg) || '#f3f4f6',
          buttonSecondaryText: getColorValue(tema.button_secondary_text) || '#374151',
          buttonSecondaryHover: getBackgroundValue(tema.button_secondary_hover) || '#e5e7eb',
        };
      });
      
      setTemasFromBD(temasConvertidos);
      setTemasDisponibles(temasConvertidos);
      // console.log(' [ThemeContext] Temas convertidos:', Object.keys(temasConvertidos));
      // console.log(' [ThemeContext] Ejemplo sidebar:', temasConvertidos['tecnologico']?.sidebar);
      return temasConvertidos;
    }
    
    return TEMAS_HARDCODEADOS;
  } catch (error) {
    console.error('❌ [ThemeContext] Error cargando temas desde BD:', error);
    return TEMAS_HARDCODEADOS;
  }
};

// ============================================
// TEMAS HARDCODEADOS (fallback)
// ============================================
export const TEMAS_HARDCODEADOS = {
  // ============================================
  // TEMA DEFAULT
  // ============================================
  default: {
    nombre: 'Default',
    
    // Sidebar
    sidebar: '#3b82f6',
    sidebarText: '#d1d5db',
    sidebarActive: '#1d4ed8',
    sidebarHover: 'rgba(255,255,255,0.1)',
    
    // Topbar
    topbar: '#3b82f6',
    topbarText: '#ffffff',
    
    // Fondos
    background: '#f9fafb',
    card: '#ffffff',
    cardShadow: '0 1px 3px rgba(0,0,0,0.1)',
    loginBg: '#f9fafb',
    
    // Textos
    text: '#1f2937',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
    
    // Bordes e inputs
    border: '#e5e7eb',
    input: '#ffffff',
    inputPlaceholder: '#9ca3af',
    
    // Botones
    button: '#3b82f6',
    buttonOutline: 'transparent',
    buttonActive: '#1d4ed8',
    buttonInactive: '#f3f4f6',
    
    // Tabs
    tabActive: '#3b82f6',
    tabInactive: 'transparent',
    
    // Estados
    estadoNormal: '#22c55e',
    estadoAlerta: '#eab308',
    estadoFalla: '#ef4444',
    estadoMantenimiento: '#f97316',
    
    // Gráficas
    chartGrid: '#e5e7eb',
    chartText: '#6b7280',
    chartAxis: '#d1d5db',
    chartTooltipBg: '#ffffff',
    chartTooltipText: '#000000',
    chartTooltipBorder: '#e5e7eb',
    
    // Tablas
    tableHeader: '#f9fafb',
    tableRowHover: 'rgba(0,0,0,0.02)',
    tableBorder: '#e5e7eb',
    
    // Modales
    modalBg: '#ffffff',
    modalBorder: '#e5e7eb',
    modalHeader: '#3b82f6',
    
    // Filtros
    filterBg: '#ffffff',
    filterShadow: '0 1px 3px rgba(0,0,0,0.1)',
    
    // Estadísticas
    statCard: '#ffffff',
    statBorder: '#e5e7eb',
    statTotal: '#3b82f6',
    
    // NUEVOS - SIDEBAR
    sidebarLogoText: '#ffffff',
    sidebarMenuText: '#d1d5db',
    sidebarMenuActiveBg: 'transparent',
    sidebarMenuActiveText: '#ffffff',
    sidebarMenuActiveBorder: 'transparent',
    
    // NUEVOS - BOTONES
    buttonPrimaryBg: '#3b82f6',
    buttonPrimaryText: '#ffffff',
    buttonPrimaryHover: '#2563eb',
    buttonSecondaryBg: '#f3f4f6',
    buttonSecondaryText: '#374151',
    buttonSecondaryHover: '#e5e7eb',
  },

  // ============================================
  // TEMA OSCURO
  // ============================================
  oscuro: {
    nombre: 'Oscuro',
    
    // Sidebar
    sidebar: '#111827',
    sidebarText: '#9ca3af',
    sidebarActive: '#374151',
    sidebarHover: 'rgba(255,255,255,0.05)',
    
    // Topbar
    topbar: '#111827',
    topbarText: '#e5e7eb',
    
    // Fondos
    background: '#020617',
    card: '#1f2937',
    cardShadow: '0 4px 6px rgba(0,0,0,0.5)',
    loginBg: '#020617',
    
    // Textos
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    textMuted: '#6b7280',
    
    // Bordes e inputs
    border: '#374151',
    input: '#1f2937',
    inputPlaceholder: '#6b7280',
    
    // Botones
    button: '#0891b2',
    buttonOutline: 'transparent',
    buttonActive: '#0e7490',
    buttonInactive: '#374151',
    
    // Tabs
    tabActive: '#22d3ee',
    tabInactive: 'transparent',
    
    // Estados
    estadoNormal: '#22c55e',
    estadoAlerta: '#eab308',
    estadoFalla: '#ef4444',
    estadoMantenimiento: '#f97316',
    
    // Gráficas
    chartGrid: '#374151',
    chartText: '#94a3b8',
    chartAxis: '#4b5563',
    chartTooltipBg: '#1f2937',
    chartTooltipText: '#ffffff',
    chartTooltipBorder: '#374151',
    
    // Tablas
    tableHeader: '#1f2937',
    tableRowHover: 'rgba(255,255,255,0.03)',
    tableBorder: '#374151',
    
    // Modales
    modalBg: '#1f2937',
    modalBorder: '#374151',
    modalHeader: '#22d3ee',
    
    // Filtros
    filterBg: '#1f2937',
    filterShadow: '0 4px 6px rgba(0,0,0,0.5)',
    
    // Estadísticas
    statCard: '#1f2937',
    statBorder: '#374151',
    statTotal: '#22d3ee',
    
    // NUEVOS - SIDEBAR
    sidebarLogoText: '#ffffff',
    sidebarMenuText: '#9ca3af',
    sidebarMenuActiveBg: '#374151',
    sidebarMenuActiveText: '#ffffff',
    sidebarMenuActiveBorder: '#22d3ee',
    
    // NUEVOS - BOTONES
    buttonPrimaryBg: '#0891b2',
    buttonPrimaryText: '#ffffff',
    buttonPrimaryHover: '#0e7490',
    buttonSecondaryBg: '#374151',
    buttonSecondaryText: '#d1d5db',
    buttonSecondaryHover: '#4b5563',
  },

  // ============================================
  // TEMA CLARO
  // ============================================
  claro: {
    nombre: 'Claro',
    
    // Sidebar
    sidebar: '#ffffff',
    sidebarText: '#4b5563',
    sidebarActive: '#dbeafe',
    sidebarHover: 'rgba(0,0,0,0.02)',
    
    // Topbar
    topbar: '#ffffff',
    topbarText: '#374151',
    
    // Fondos
    background: '#f3f4f6',
    card: '#ffffff',
    cardShadow: '0 1px 2px rgba(0,0,0,0.05)',
    loginBg: '#f3f4f6',
    
    // Textos
    text: '#1f2937',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
    
    // Bordes e inputs
    border: '#e5e7eb',
    input: '#ffffff',
    inputPlaceholder: '#9ca3af',
    
    // Botones
    button: '#3b82f6',
    buttonOutline: 'transparent',
    buttonActive: '#1d4ed8',
    buttonInactive: '#f3f4f6',
    
    // Tabs
    tabActive: '#3b82f6',
    tabInactive: 'transparent',
    
    // Estados
    estadoNormal: '#22c55e',
    estadoAlerta: '#eab308',
    estadoFalla: '#ef4444',
    estadoMantenimiento: '#f97316',
    
    // Gráficas
    chartGrid: '#e5e7eb',
    chartText: '#6b7280',
    chartAxis: '#d1d5db',
    chartTooltipBg: '#ffffff',
    chartTooltipText: '#000000',
    chartTooltipBorder: '#e5e7eb',
    
    // Tablas
    tableHeader: '#f9fafb',
    tableRowHover: 'rgba(0,0,0,0.02)',
    tableBorder: '#e5e7eb',
    
    // Modales
    modalBg: '#ffffff',
    modalBorder: '#e5e7eb',
    modalHeader: '#3b82f6',
    
    // Filtros
    filterBg: '#ffffff',
    filterShadow: '0 1px 3px rgba(0,0,0,0.1)',
    
    // Estadísticas
    statCard: '#ffffff',
    statBorder: '#e5e7eb',
    statTotal: '#3b82f6',
    
    // NUEVOS - SIDEBAR
    sidebarLogoText: '#1f2937',
    sidebarMenuText: '#4b5563',
    sidebarMenuActiveBg: '#dbeafe',
    sidebarMenuActiveText: '#1d4ed8',
    sidebarMenuActiveBorder: '#3b82f6',
    
    // NUEVOS - BOTONES
    buttonPrimaryBg: '#3b82f6',
    buttonPrimaryText: '#ffffff',
    buttonPrimaryHover: '#2563eb',
    buttonSecondaryBg: '#f3f4f6',
    buttonSecondaryText: '#374151',
    buttonSecondaryHover: '#e5e7eb',
  },

  // ============================================
  // TEMA TECNOLÓGICO
  // ============================================
  tecnologico: {
    nombre: 'Tecnológico',
    
    // Sidebar
    sidebar: '#0a1628',
    sidebarText: 'rgba(34, 211, 238, 0.7)',
    sidebarActive: 'rgba(8, 145, 178, 0.3)',
    sidebarHover: 'rgba(8, 145, 178, 0.2)',
    
    // Topbar
    topbar: '#0a1628',
    topbarText: '#22d3ee',
    
    // Fondos
    background: '#0d1b2a',
    card: '#1a2d45',
    cardShadow: '0 4px 6px rgba(8, 145, 178, 0.2)',
    loginBg: '#0d1b2a',
    
    // Textos
    text: '#cffafe',
    textSecondary: 'rgba(103, 232, 249, 0.7)',
    textMuted: 'rgba(34, 211, 238, 0.4)',
    
    // Bordes e inputs
    border: 'rgba(21, 94, 117, 0.5)',
    input: '#0d1b2a',
    inputPlaceholder: 'rgba(21, 94, 117, 0.5)',
    
    // Botones
    button: '#0891b2',
    buttonOutline: 'transparent',
    buttonActive: '#0e7490',
    buttonInactive: 'rgba(8, 145, 178, 0.3)',
    
    // Tabs
    tabActive: '#22d3ee',
    tabInactive: 'transparent',
    
    // Estados
    estadoNormal: '#22c55e',
    estadoAlerta: '#eab308',
    estadoFalla: '#ef4444',
    estadoMantenimiento: '#f97316',
    
    // Gráficas
    chartGrid: '#1a3a5c',
    chartText: '#60a5fa',
    chartAxis: '#1a3a5c',
    chartTooltipBg: '#0d1b2a',
    chartTooltipText: '#22d3ee',
    chartTooltipBorder: '#1a3a5c',
    
    // Tablas
    tableHeader: '#0d1b2a',
    tableRowHover: 'rgba(8, 145, 178, 0.2)',
    tableBorder: 'rgba(21, 94, 117, 0.5)',
    
    // Modales
    modalBg: '#1a2d45',
    modalBorder: 'rgba(21, 94, 117, 0.5)',
    modalHeader: '#22d3ee',
    
    // Filtros
    filterBg: '#1a2d45',
    filterShadow: '0 4px 6px rgba(8, 145, 178, 0.2)',
    
    // Estadísticas
    statCard: '#1a2d45',
    statBorder: 'rgba(21, 94, 117, 0.5)',
    statTotal: '#22d3ee',
    
    // NUEVOS - SIDEBAR
    sidebarLogoText: '#ffffff',
    sidebarMenuText: 'rgba(34, 211, 238, 0.7)',
    sidebarMenuActiveBg: 'rgba(8, 145, 178, 0.3)',
    sidebarMenuActiveText: '#22d3ee',
    sidebarMenuActiveBorder: '#22d3ee',
    
    // NUEVOS - BOTONES
    buttonPrimaryBg: '#0891b2',
    buttonPrimaryText: '#ffffff',
    buttonPrimaryHover: '#0e7490',
    buttonSecondaryBg: 'rgba(8, 145, 178, 0.3)',
    buttonSecondaryText: '#67e8f9',
    buttonSecondaryHover: 'rgba(8, 145, 178, 0.5)',
  },

  // ============================================
  // TEMA PSICODÉLICO
  // ============================================
  psicodelico: {
    nombre: 'Psicodélico',
    
    // Sidebar
    sidebar: '#2d1b69',
    sidebarText: 'rgba(249, 168, 212, 0.7)',
    sidebarActive: 'rgba(219, 39, 119, 0.2)',
    sidebarHover: 'rgba(219, 39, 119, 0.1)',
    
    // Topbar
    topbar: '#2d1b69',
    topbarText: '#f472b6',
    
    // Fondos
    background: '#1a1a2e',
    card: 'rgba(45, 27, 105, 0.8)',
    cardShadow: '0 4px 6px rgba(126, 34, 206, 0.3)',
    loginBg: '#1a1a2e',
    
    // Textos
    text: '#fce7f3',
    textSecondary: 'rgba(249, 168, 212, 0.6)',
    textMuted: 'rgba(244, 114, 182, 0.4)',
    
    // Bordes e inputs
    border: 'rgba(126, 34, 206, 0.5)',
    input: '#1a1a2e',
    inputPlaceholder: 'rgba(126, 34, 206, 0.5)',
    
    // Botones
    button: '#db2777',
    buttonOutline: 'transparent',
    buttonActive: '#be185d',
    buttonInactive: 'rgba(219, 39, 119, 0.1)',
    
    // Tabs
    tabActive: '#f472b6',
    tabInactive: 'transparent',
    
    // Estados
    estadoNormal: '#22c55e',
    estadoAlerta: '#eab308',
    estadoFalla: '#ef4444',
    estadoMantenimiento: '#f97316',
    
    // Gráficas
    chartGrid: '#3d2a6b',
    chartText: '#f472b6',
    chartAxis: '#3d2a6b',
    chartTooltipBg: '#1a1a2e',
    chartTooltipText: '#f472b6',
    chartTooltipBorder: '#3d2a6b',
    
    // Tablas
    tableHeader: '#1a1a2e',
    tableRowHover: 'rgba(219, 39, 119, 0.1)',
    tableBorder: 'rgba(126, 34, 206, 0.5)',
    
    // Modales
    modalBg: 'rgba(45, 27, 105, 0.8)',
    modalBorder: 'rgba(126, 34, 206, 0.5)',
    modalHeader: '#f472b6',
    
    // Filtros
    filterBg: 'rgba(45, 27, 105, 0.8)',
    filterShadow: '0 4px 6px rgba(126, 34, 206, 0.3)',
    
    // Estadísticas
    statCard: 'rgba(45, 27, 105, 0.8)',
    statBorder: 'rgba(126, 34, 206, 0.5)',
    statTotal: '#f472b6',
    
    // NUEVOS - SIDEBAR
    sidebarLogoText: '#ffffff',
    sidebarMenuText: 'rgba(249, 168, 212, 0.7)',
    sidebarMenuActiveBg: 'rgba(219, 39, 119, 0.2)',
    sidebarMenuActiveText: '#f472b6',
    sidebarMenuActiveBorder: '#f472b6',
    
    // NUEVOS - BOTONES
    buttonPrimaryBg: '#db2777',
    buttonPrimaryText: '#ffffff',
    buttonPrimaryHover: '#be185d',
    buttonSecondaryBg: 'rgba(219, 39, 119, 0.1)',
    buttonSecondaryText: '#f9a8d4',
    buttonSecondaryHover: 'rgba(219, 39, 119, 0.2)',
  },
};

const DEFAULT_TEMA = TEMAS_HARDCODEADOS.default;

export const ThemeProvider = ({ children }) => {
  const [temaActual, setTemaActual] = useState('default');
  const [temaConfig, setTemaConfig] = useState(DEFAULT_TEMA);
  const [loading, setLoading] = useState(true);
  const [usarTemasBD, setUsarTemasBD] = useState(true);
  const [temasDisponibles, setTemasDisponibles] = useState(TEMAS_HARDCODEADOS);
  const [temasFromBD, setTemasFromBD] = useState({});

  const tieneToken = () => {
    const token = localStorage.getItem('token');
    return token && token !== 'undefined' && token !== 'null' && token.length > 0;
  };

  const cargarConfiguracionTemas = async () => {
    try {
      if (!tieneToken()) {
        // console.log(' [ThemeContext] Sin token, esperando autenticación...');
        return true;
      }
      
      // console.log(' [ThemeContext] Cargando configuración de temas...');
      const response = await api.get('/temas/configuracion');
      // console.log(' [ThemeContext] Configuración recibida:', response.data);
      
      const usarBD = response.data.usar_temas_bd !== undefined ? response.data.usar_temas_bd : true;
      setUsarTemasBD(usarBD);
      localStorage.setItem('usarTemasBD', JSON.stringify(usarBD));
      return usarBD;
    } catch (error) {
      console.error('❌ [ThemeContext] Error cargando configuración:', error);
      setUsarTemasBD(true);
      localStorage.setItem('usarTemasBD', JSON.stringify(true));
      return true;
    }
  };

  const cargarTemasDesdeBD = async () => {
    try {
      if (!tieneToken()) {
        // console.log(' [ThemeContext] Sin token, usando temas hardcodeados');
        return TEMAS_HARDCODEADOS;
      }
      
      // console.log(' [ThemeContext] Cargando temas desde BD...');
      const response = await api.get('/temas/');
      const temasBD = response.data;
      // console.log(' [ThemeContext] Temas recibidos:', temasBD.map(t => t.clave));
      
      if (temasBD && temasBD.length > 0) {
        const temasConvertidos = {};
        temasBD.forEach(tema => {
          temasConvertidos[tema.clave] = {
            // ============================================
            // TODOS LOS ATRIBUTOS - CON VALORES JSON
            // ============================================
            nombre: tema.nombre,
            
            // Sidebar
            sidebar: tema.sidebar || '#3b82f6',
            sidebarText: tema.sidebar_text || '#d1d5db',
            sidebarActive: tema.sidebar_active || '#1d4ed8',
            sidebarHover: tema.sidebar_hover || 'rgba(255,255,255,0.1)',
            
            // Topbar
            topbar: tema.topbar || '#3b82f6',
            topbarText: tema.topbar_text || '#ffffff',
            
            // Fondos
            background: tema.background || '#f9fafb',
            card: tema.card || '#ffffff',
            cardShadow: tema.card_shadow || '0 1px 3px rgba(0,0,0,0.1)',
            loginBg: tema.login_bg || '#f9fafb',
            
            // Textos
            text: tema.text || '#1f2937',
            textSecondary: tema.text_secondary || '#4b5563',
            textMuted: tema.text_muted || '#9ca3af',
            
            // Bordes e inputs
            border: tema.border || '#e5e7eb',
            input: tema.input || '#ffffff',
            inputPlaceholder: tema.input_placeholder || '#9ca3af',
            
            // Botones
            button: tema.button || '#3b82f6',
            buttonOutline: tema.button_outline || 'transparent',
            buttonActive: tema.button_active || '#1d4ed8',
            buttonInactive: tema.button_inactive || '#f3f4f6',
            
            // Tabs
            tabActive: tema.tab_active || '#3b82f6',
            tabInactive: tema.tab_inactive || 'transparent',
            
            // Estados
            estadoNormal: tema.estado_normal || '#22c55e',
            estadoAlerta: tema.estado_alerta || '#eab308',
            estadoFalla: tema.estado_falla || '#ef4444',
            estadoMantenimiento: tema.estado_mantenimiento || '#f97316',
            
            // Gráficas
            chartGrid: tema.chart_grid || '#e5e7eb',
            chartText: tema.chart_text || '#6b7280',
            chartAxis: tema.chart_axis || '#d1d5db',
            chartTooltipBg: tema.chart_tooltip_bg || '#ffffff',
            chartTooltipText: tema.chart_tooltip_text || '#000000',
            chartTooltipBorder: tema.chart_tooltip_border || '#e5e7eb',
            
            // Tablas
            tableHeader: tema.table_header || '#f9fafb',
            tableRowHover: tema.table_row_hover || 'rgba(0,0,0,0.02)',
            tableBorder: tema.table_border || '#e5e7eb',
            
            // Modales
            modalBg: tema.modal_bg || '#ffffff',
            modalBorder: tema.modal_border || '#e5e7eb',
            modalHeader: tema.modal_header || '#3b82f6',
            
            // Filtros
            filterBg: tema.filter_bg || '#ffffff',
            filterShadow: tema.filter_shadow || '0 1px 3px rgba(0,0,0,0.1)',
            
            // Estadísticas
            statCard: tema.stat_card || '#ffffff',
            statBorder: tema.stat_border || '#e5e7eb',
            statTotal: tema.stat_total || '#3b82f6',
            
            // NUEVOS - SIDEBAR
            sidebarLogoText: tema.sidebar_logo_text || '#ffffff',
            sidebarMenuText: tema.sidebar_menu_text || '#d1d5db',
            sidebarMenuActiveBg: tema.sidebar_menu_active_bg || 'transparent',
            sidebarMenuActiveText: tema.sidebar_menu_active_text || '#ffffff',
            sidebarMenuActiveBorder: tema.sidebar_menu_active_border || 'transparent',
            
            // NUEVOS - BOTONES
            buttonPrimaryBg: tema.button_primary_bg || '#3b82f6',
            buttonPrimaryText: tema.button_primary_text || '#ffffff',
            buttonPrimaryHover: tema.button_primary_hover || '#2563eb',
            buttonSecondaryBg: tema.button_secondary_bg || '#f3f4f6',
            buttonSecondaryText: tema.button_secondary_text || '#374151',
            buttonSecondaryHover: tema.button_secondary_hover || '#e5e7eb',
          };
        });
        
        setTemasFromBD(temasConvertidos);
        setTemasDisponibles(temasConvertidos);
        // console.log(' [ThemeContext] Temas convertidos:', Object.keys(temasConvertidos));
        // console.log(' [ThemeContext] sidebarLogoText del primer tema:', Object.values(temasConvertidos)[0]?.sidebarLogoText);
        return temasConvertidos;
      }
      
      return TEMAS_HARDCODEADOS;
    } catch (error) {
      console.error('❌ [ThemeContext] Error cargando temas desde BD:', error);
      return TEMAS_HARDCODEADOS;
    }
  };

  // const obtenerTemaUsuario = async () => {
  //   try {
  //     if (!tieneToken()) {
  //       // console.log(' [ThemeContext] Sin token, usando tema de localStorage');
  //       return localStorage.getItem('tema_actual') || 'default';
  //     }
      
  //     // console.log(' [ThemeContext] Obteniendo tema del usuario...');
  //     const response = await api.get('/preferencias/tema');
  //     const tema = response.data?.tema || 'default';
  //     // console.log(' [ThemeContext] Tema del usuario:', tema);
      
  //     //  Guardar en localStorage para referencia
  //     localStorage.setItem('tema_actual', tema);
      
  //     return tema;
  //   } catch (error) {
  //     console.error('❌ [ThemeContext] Error obteniendo tema del usuario:', error);
  //     return localStorage.getItem('tema_actual') || 'default';
  //   }
  // };

  const obtenerTemaUsuario = async () => {
    try {
      //  PRIMERO: Intentar obtener desde BD (fuente de verdad)
      if (tieneToken()) {
        // console.log(' [ThemeContext] Obteniendo tema del usuario desde BD...');
        const response = await api.get('/preferencias/tema');
        const tema = response.data?.tema || 'default';
        // console.log(' [ThemeContext] Tema del usuario desde BD:', tema);
        
        //  Guardar en localStorage para futuras cargas rápidas
        localStorage.setItem('tema_actual', tema);
        return tema;
      }
      
      //  SEGUNDO: Fallback a localStorage si no hay token
      // console.log(' [ThemeContext] Sin token, usando tema de localStorage');
      const localTema = localStorage.getItem('tema_actual');
      if (localTema && localTema !== 'undefined' && localTema !== 'null') {
        const temas = usarTemasBD ? temasDisponibles : TEMAS_HARDCODEADOS;
        if (temas[localTema]) {
          return localTema;
        }
      }
      
      return 'default';
    } catch (error) {
      console.error('❌ [ThemeContext] Error obteniendo tema del usuario:', error);
      const fallback = localStorage.getItem('tema_actual') || 'default';
      // console.log(' [ThemeContext] Fallback a localStorage:', fallback);
      return fallback;
    }
  };

  // ============================================
  // 4. APLICAR TEMA VISUALMENTE - CORREGIDO
  // ============================================
  const aplicarTema = (tema) => {
    // console.log(' [ThemeContext] aplicarTema() llamado con:', tema?.nombre);
    if (!tema) return;
    
    // console.log(' [ThemeContext] Aplicando tema:', tema.nombre || 'Desconocido');
    
    try {
      //  USAR getBackgroundValue (ahora parsea JSON)
      const bgValue = getBackgroundValue(tema.background);
      const sidebarValue = getBackgroundValue(tema.sidebar);
      const topbarValue = getBackgroundValue(tema.topbar);
      
      //  LOGS PARA VERIFICAR
      // console.log(' [ThemeContext] sidebar (raw):', tema.sidebar);
      // console.log(' [ThemeContext] sidebar (extracted):', sidebarValue);
      // console.log(' [ThemeContext] topbar (extracted):', topbarValue);
      // console.log(' [ThemeContext] background (extracted):', bgValue);
      
      //  Si no hay valor, usar defaults
      const finalBg = bgValue || '#f9fafb';
      const finalSidebar = sidebarValue || '#3b82f6';
      const finalTopbar = topbarValue || '#3b82f6';
      
      //  APLICAR AL BODY
      document.body.style.backgroundColor = '';
      document.body.style.background = '';
      document.body.style.backgroundColor = finalBg;
      document.body.className = '';
      
      // console.log(' [ThemeContext] Body background set to:', finalBg);
      
    } catch (e) {
      console.warn('⚠️ [ThemeContext] Error:', e);
    }
  };

  // ============================================
  // 5. CARGAR TODO (INICIAL) - CORREGIDO
  // ============================================
  const cargarTema = async () => {
    try {
      setLoading(true);
      // console.log(' [ThemeContext] Iniciando carga de temas...');
      
      const usarBD = await cargarConfiguracionTemas();
      // console.log(' [ThemeContext] usarBD:', usarBD);
      
      let temas;
      if (usarBD && tieneToken()) {
        temas = await cargarTemasDesdeBD();
        // console.log(' [ThemeContext] Temas cargados desde BD:', Object.keys(temas));
        setTemasDisponibles(temas);
      } else {
        temas = TEMAS_HARDCODEADOS;
        setTemasDisponibles(TEMAS_HARDCODEADOS);
        // console.log(' [ThemeContext] Usando temas hardcodeados');
      }
      
      const temaUsuario = await obtenerTemaUsuario();
      // console.log(' [ThemeContext] Tema del usuario:', temaUsuario);
      
      //  Obtener el tema seleccionado (YA es un objeto con valores parseados)
      const temaSeleccionado = temas[temaUsuario] || temas.default || TEMAS_HARDCODEADOS.default;
      // console.log(' [ThemeContext] Tema seleccionado:', temaSeleccionado.nombre);
      
      setTemaActual(temaUsuario);
      setTemaConfig(temaSeleccionado);
      localStorage.setItem('tema_actual', temaUsuario);
      
      //  APLICAR TEMA (ya usa los valores parseados)
      aplicarTema(temaSeleccionado);
      
      // console.log(' [ThemeContext] Tema cargado exitosamente');
    } catch (error) {
      console.error('❌ [ThemeContext] Error cargando tema:', error);
      setTemaActual('default');
      setTemaConfig(TEMAS_HARDCODEADOS.default);
      aplicarTema(TEMAS_HARDCODEADOS.default);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 6. RECARGAR TEMAS DESDE BD - CORREGIDO
  // ============================================
  const recargarTemas = async () => {
    try {
      // console.log(' [ThemeContext] Recargando temas desde BD...');
      
      if (!tieneToken()) {
        // console.log(' [ThemeContext] Sin token, no se puede recargar');
        return TEMAS_HARDCODEADOS;
      }
      
      const usarBD = await cargarConfiguracionTemas();
      
      let temas;
      if (usarBD) {
        temas = await cargarTemasDesdeBD();
      } else {
        temas = TEMAS_HARDCODEADOS;
        setTemasDisponibles(TEMAS_HARDCODEADOS);
      }
      
      const temaUsuario = await obtenerTemaUsuario();
      const temaSeleccionado = temas[temaUsuario] || temas.default || TEMAS_HARDCODEADOS.default;
      
      setTemaActual(temaUsuario);
      setTemaConfig(temaSeleccionado);
      localStorage.setItem('tema_actual', temaUsuario);
      aplicarTema(temaSeleccionado);
      // console.log(' [ThemeContext] aplicando tema visualmente:', temaSeleccionado.nombre);
      // console.log(' [ThemeContext] background aplicado:', temaSeleccionado.background);
      
      // console.log(' [ThemeContext] Temas recargados:', Object.keys(temas));
      return temas;
    } catch (error) {
      console.error('❌ [ThemeContext] Error recargando temas:', error);
      return TEMAS_HARDCODEADOS;
    }
  };

  const cambiarTema = async (tema) => {
    // console.log(' [ThemeContext] Cambiando tema a:', tema);
    
    const temas = usarTemasBD ? temasDisponibles : TEMAS_HARDCODEADOS;
    
    if (!temas[tema]) {
      console.warn(`⚠️ [ThemeContext] Tema "${tema}" no existe, usando default`);
      tema = 'default';
    }
    
    try {
      //  Siempre guardar en localStorage primero (rápido)
      localStorage.setItem('tema_actual', tema);
      
      //  Guardar en BD si hay token
      if (tieneToken()) {
        await api.put('/preferencias/tema', { tema });
        // console.log(' [ThemeContext] Tema guardado en BD:', tema);
      } else {
        console.log(' [ThemeContext] Sin token, guardando solo en localStorage');
      }
      
      //  Actualizar estado
      setTemaActual(tema);
      setTemaConfig(temas[tema]);
      aplicarTema(temas[tema]);
      
      // console.log(' [ThemeContext] Tema cambiado a:', tema);
      return { success: true };
    } catch (error) {
      console.error('❌ [ThemeContext] Error guardando tema:', error);
      // Fallback: ya guardamos en localStorage, solo actualizar estado
      setTemaActual(tema);
      setTemaConfig(temas[tema]);
      aplicarTema(temas[tema]);
      return { success: true, warning: 'Guardado solo en localStorage' };
    }
  };

  useEffect(() => {
    cargarTema();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        // console.log(' [ThemeContext] Token cambiado, recargando temas...');
        if (tieneToken()) {
          recargarTemas();
        } else {
          setTemasDisponibles(TEMAS_HARDCODEADOS);
          setTemaActual('default');
          setTemaConfig(DEFAULT_TEMA);
          localStorage.setItem('tema_actual', 'default');
          aplicarTema(DEFAULT_TEMA);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ============================================
  //  VALUE CORREGIDO
  // ============================================
  const value = {
    temaActual,
    temaConfig,
    cambiarTema,
    TEMAS: usarTemasBD ? temasDisponibles : TEMAS_HARDCODEADOS,
    cargarTema,
    recargarTemas,
    loading,
    usarTemasBD,
    temasDisponibles,
  };

  // console.log(' [ThemeProvider] TEMAS keys en value:', Object.keys(value.TEMAS));
  // console.log(' [ThemeProvider] temasDisponibles keys:', Object.keys(temasDisponibles));

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

let warningShown = false;

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context) {
    return context;
  }

  if (!warningShown) {
    console.warn('⚠️ useTheme: No se encontró ThemeProvider, usando valores por defecto');
    warningShown = true;
  }
  
  return {
    temaActual: 'default',
    temaConfig: DEFAULT_TEMA,
    cambiarTema: async () => ({ success: false, error: 'ThemeProvider no disponible' }),
    TEMAS: TEMAS_HARDCODEADOS,
    loading: false,
    usarTemasBD: false,
    temasDisponibles: TEMAS_HARDCODEADOS,
    recargarTemas: async () => {},
    cargarTema: async () => {},
  };
};

export default ThemeContext;
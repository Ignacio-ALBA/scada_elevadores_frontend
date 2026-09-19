// frontend/src/components/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line
} from 'recharts';
import { elevadorService } from '../../../services/elevadorService';
import { edificioService } from '../../../services/edificioService';
import { alarmasService } from '../../../services/alarmasService';
import { eventosService } from '../../../services/eventosService';
import { mantenimientoService } from '../../../services/mantenimientoService';
import { emuladorService } from '../../../services/emuladorService';
import { useAuth } from '../../../context/AuthContext';
import StatCard from '../../../components/common/StatCard';
import ChartCard from '../../../components/common/ChartCard';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';
// import { TEMAS } from '../../../context/ThemeContext';
// import { useTheme } from '../../../context/ThemeContext';
import { useSafeTheme } from '../../../hooks/useSafeTheme';

// Iconos
const IconElevator = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
  </svg>
);

const IconAlarm = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
  </svg>
);

const IconEvent = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8.414V6a1 1 0 10-2 0v5a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 10.414z"/>
  </svg>
);

const IconMaintenance = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
    <path d="M7 6h6v1H7zM7 8h6v1H7zM7 10h6v1H7z"/>
  </svg>
);

// const COLORS = {
//   verde: '#22c55e',
//   rojo: '#ef4444',
//   naranja: '#f59e0b',
//   azul: '#3b82f6',
//   cyan: '#06b6d4',
//   morado: '#8b5cf6',
//   rosa: '#ec4899',
//   gris: '#64748b'
// };

// const COLORS = {
//   verde: '#22c55e',
//   rojo: '#ef4444',
//   naranja: '#f59e0b',
//   azul: '#3b82f6',
//   cyan: '#22d3ee', 
//   morado: '#a78bfa',
//   rosa: '#f472b6',
//   gris: '#94a3b8'   
// };

// const COLORS = {
//   verde: isDark ? '#4ade80' : '#22c55e',
//   rojo: isDark ? '#f87171' : '#ef4444',
//   naranja: isDark ? '#fbbf24' : '#f59e0b',
//   azul: isDark ? '#60a5fa' : '#3b82f6',
//   cyan: isDark ? '#22d3ee' : '#06b6d4',
//   morado: isDark ? '#a78bfa' : '#8b5cf6',
//   rosa: isDark ? '#f472b6' : '#ec4899',
//   gris: isDark ? '#94a3b8' : '#64748b'
// };

// const ESTADO_COLORS = {
//   'operativo': COLORS.verde,
//   'mantenimiento': COLORS.naranja,
//   'falla': COLORS.rojo,
//   'desconectado': COLORS.gris,
//   'sismo': COLORS.azul
// };

const Dashboard = () => {
  const { user } = useAuth();
  // const { TEMAS } = useTheme();
  const { temaConfig } = useSafeTheme();

  //  Obtener tema del localStorage
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';
  
  //  Definir COLORS DENTRO del componente, después de isDark
  const COLORS = {
    verde: isDark ? '#4ade80' : '#22c55e',
    rojo: isDark ? '#f87171' : '#ef4444',
    naranja: isDark ? '#fbbf24' : '#f59e0b',
    azul: isDark ? '#60a5fa' : '#3b82f6',
    cyan: isDark ? '#22d3ee' : '#06b6d4',
    morado: isDark ? '#a78bfa' : '#8b5cf6',
    rosa: isDark ? '#f472b6' : '#ec4899',
    gris: isDark ? '#94a3b8' : '#64748b'
  };

  const ESTADO_COLORS = {
    'operativo': COLORS.verde,
    'mantenimiento': COLORS.naranja,
    'falla': COLORS.rojo,
    'desconectado': COLORS.gris,
    'sismo': COLORS.azul
  };

  //  TODOS los hooks al inicio
  const [stats, setStats] = useState({
    elevadores: { total: 0, porEstado: {} },
    alarmas: { total: 0, activas: 0, porPrioridad: {} },
    eventos: { total: 0, ultimos: [] },
    mantenimiento: { total: 0, pendientes: 0, porEstado: {} },
    edificios: { total: 0 },
    ocupacion: { data: [] }
  });
  
  const [datosEmulador, setDatosEmulador] = useState(null);
  const [periodo, setPeriodo] = useState('7d');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [trendData, setTrendData] = useState([]);
  
  const [loading, setLoading] = useState({
    elevadores: false,
    edificios: false,
    alarmas: false,
    eventos: false,
    mantenimiento: false,
    emulador: false,
    ocupacion: false,
    tendencia: false
  });

  const updateTimerRef = useRef(null);
  const UPDATE_INTERVAL = parseInt(import.meta.env.VITE_DASHBOARD_INTERVAL) || 30000;

  const pageTitle = useNombreInterfaz('dashboard');

  // const [temaLocal] = useState(() => {
  //   return localStorage.getItem('tema_actual') || 'default';
  // });
 
  // ============================================
  // FUNCIONES DE CARGA
  // ============================================

  const updateStats = (newStats) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  const cargarElevadores = async (showLoading = true) => {
    if (showLoading) {
      setLoading(prev => ({ ...prev, elevadores: true }));
    }
    try {
      const response = await elevadorService.getAll({ activo: true });
      const data = response.data || [];
      const porEstado = {};
      data.forEach(e => {
        const estado = e.estado_operativo || 'desconocido';
        porEstado[estado] = (porEstado[estado] || 0) + 1;
      });
      
      const ocupacionData = data.map(e => {
        let ocupacion = 0;
        switch (e.estado_operativo) {
          case 'operativo':
            ocupacion = Math.floor(Math.random() * 40 + 30);
            break;
          case 'mantenimiento':
            ocupacion = Math.floor(Math.random() * 15 + 5);
            break;
          case 'falla':
            ocupacion = 0;
            break;
          default:
            ocupacion = Math.floor(Math.random() * 60 + 10);
        }
        return {
          nombre: e.nombre || e.codigo,
          ocupacion: ocupacion,
          estado: e.estado_operativo || 'desconocido',
          capacidad: e.capacidad_personas || 8,
          piso_actual: e.piso_actual || 0
        };
      });

      updateStats({
        elevadores: { total: data.length, porEstado },
        ocupacion: { data: ocupacionData }
      });
    } catch (error) {
      console.error('Error cargando elevadores:', error);
    } finally {
      if (showLoading) {
        setLoading(prev => ({ ...prev, elevadores: false }));
      }
    }
  };

  const cargarEdificios = async (showLoading = true) => {
    if (showLoading) {
      setLoading(prev => ({ ...prev, edificios: true }));
    }
    try {
      const response = await edificioService.getAll({ activo: true });
      const data = response.data || [];
      updateStats({ edificios: { total: data.length } });
    } catch (error) {
      console.error('Error cargando edificios:', error);
    } finally {
      if (showLoading) {
        setLoading(prev => ({ ...prev, edificios: false }));
      }
    }
  };

  const cargarAlarmas = async (showLoading = true) => {
    if (showLoading) {
      setLoading(prev => ({ ...prev, alarmas: true }));
    }
    try {
      const result = await alarmasService.getAll({ resuelta: false, limit: 100 });
      const data = result.data || [];
      const porPrioridad = {};
      data.forEach(a => {
        const prioridad = a.prioridad || 'media';
        porPrioridad[prioridad] = (porPrioridad[prioridad] || 0) + 1;
      });
      updateStats({
        alarmas: {
          total: data.length,
          activas: data.filter(a => !a.resuelta).length,
          porPrioridad
        }
      });
    } catch (error) {
      console.error('Error cargando alarmas:', error);
    } finally {
      if (showLoading) {
        setLoading(prev => ({ ...prev, alarmas: false }));
      }
    }
  };

  const cargarEventos = async (showLoading = true) => {
    if (showLoading) {
      setLoading(prev => ({ ...prev, eventos: true }));
    }
    try {
      const result = await eventosService.getAll({ limit: 50 });
      const data = result.data || [];
      updateStats({
        eventos: {
          total: data.length,
          ultimos: data.slice(0, 5)
        }
      });
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      if (showLoading) {
        setLoading(prev => ({ ...prev, eventos: false }));
      }
    }
  };

  const cargarMantenimiento = async (showLoading = true) => {
    if (showLoading) {
        setLoading(prev => ({ ...prev, mantenimiento: true }));
    }
    try {
        const response = await mantenimientoService.getAll({ limit: 1000 });
        // ✅ La respuesta ahora es { total, data }
        const data = response.data || [];
        const porEstado = {};
        data.forEach(m => {
            const estado = m.estado || 'desconocido';
            porEstado[estado] = (porEstado[estado] || 0) + 1;
        });
        updateStats({
            mantenimiento: {
                total: data.length,
                pendientes: data.filter(m => m.estado === 'pendiente' || m.estado === 'programado').length,
                porEstado
            }
        });
    } catch (error) {
        console.error('Error cargando mantenimiento:', error);
    } finally {
        if (showLoading) {
            setLoading(prev => ({ ...prev, mantenimiento: false }));
        }
    }
  };

  const cargarEmulador = async (showLoading = true) => {
    if (showLoading) {
      setLoading(prev => ({ ...prev, emulador: true }));
    }
    try {
      const data = await emuladorService.obtenerDatos('PLC-TorreA-01');
      setDatosEmulador(data);
    } catch (error) {
      console.error('Error cargando emulador:', error);
    } finally {
      if (showLoading) {
        setLoading(prev => ({ ...prev, emulador: false }));
      }
    }
  };

  const cargarTendencia = async (showLoading = true) => {
    if (showLoading) {
      setLoading(prev => ({ ...prev, tendencia: true }));
    }
    try {
      const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90;
      
      // Obtener datos reales de eventos, alarmas y mantenimientos
      const [eventosResult, alarmasResult, mantenimientosResult] = await Promise.all([
        eventosService.getAll({ limit: 1000 }),
        alarmasService.getAll({ limit: 1000 }),
        mantenimientoService.getAll({ limit: 1000 })
      ]);

      //  Extraer el array de datos de la respuesta
      const eventosData = eventosResult.data || [];
      const alarmasData = alarmasResult.data || [];
      const mantenimientosData = mantenimientosResult.data || [];

      // Procesar por día
      const diasMap = {};
      const hoy = new Date();
      
      for (let i = 0; i < dias; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - i);
        const key = fecha.toISOString().split('T')[0];
        diasMap[key] = {
          fecha: key,
          eventos: 0,
          alarmas: 0,
          mantenimientos: 0,
          label: `Día ${dias - i}`
        };
      }
      
      // Contar eventos por día
      (eventosData || []).forEach(e => {
        const fechaStr = e.fecha_hora || e.created_at;
        if (fechaStr) {
          const fecha = new Date(fechaStr);
          if (!isNaN(fecha.getTime())) {
            const key = fecha.toISOString().split('T')[0];
            if (diasMap[key]) {
              diasMap[key].eventos++;
            }
          }
        }
      });
      
      // Contar alarmas por día
      (alarmasData || []).forEach(a => {
        const fechaStr = a.timestamp || a.created_at;
        if (fechaStr) {
          const fecha = new Date(fechaStr);
          if (!isNaN(fecha.getTime())) {
            const key = fecha.toISOString().split('T')[0];
            if (diasMap[key]) {
              diasMap[key].alarmas++;
            }
          }
        }
      });
      
      // Contar mantenimientos por día -  Usar mantenimientosData
      (mantenimientosData || []).forEach(m => {
        const fechaStr = m.fecha_programada || m.fecha_registro || m.created_at;
        if (fechaStr) {
          const fecha = new Date(fechaStr);
          if (!isNaN(fecha.getTime())) {
            const key = fecha.toISOString().split('T')[0];
            if (diasMap[key]) {
              diasMap[key].mantenimientos++;
            }
          }
        }
      });
      
      // Convertir a array ordenado
      const sortedData = Object.values(diasMap).sort((a, b) => a.fecha.localeCompare(b.fecha));
      setTrendData(sortedData);
      
    } catch (error) {
      console.error('Error cargando tendencia:', error);
      // Fallback con datos mock si falla
      const mockData = Array.from({ length: 7 }, (_, i) => ({
        label: `Día ${i + 1}`,
        eventos: Math.floor(Math.random() * 20 + 5),
        alarmas: Math.floor(Math.random() * 10 + 2),
        mantenimientos: Math.floor(Math.random() * 5 + 1)
      }));
      setTrendData(mockData);
    } finally {
      if (showLoading) {
        setLoading(prev => ({ ...prev, tendencia: false }));
      }
    }
  };

  const cargarTodosLosDatos = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      await Promise.all([
        cargarElevadores(showLoading),
        cargarEdificios(showLoading),
        cargarAlarmas(showLoading),
        cargarEventos(showLoading),
        cargarMantenimiento(showLoading),
        cargarEmulador(showLoading),
        cargarTendencia(showLoading)
      ]);

      setLastUpdate(new Date());

    } catch (err) {
      console.error('Error cargando dashboard:', err);
      if (showLoading) {
        setError('Error al cargar algunos datos del dashboard');
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    cargarTodosLosDatos(true);
    
    updateTimerRef.current = setInterval(() => {
      cargarTodosLosDatos(false);
    }, UPDATE_INTERVAL);
    
    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    cargarTodosLosDatos(false);
  }, [periodo]);

  // ============================================
  // DATOS PARA GRÁFICOS
  // ============================================

  const getEstadoPieData = () => {
    const { porEstado } = stats.elevadores;
    return Object.entries(porEstado).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  const getAlarmaPieData = () => {
    const { porPrioridad } = stats.alarmas;
    return Object.entries(porPrioridad).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  const estadoPieData = getEstadoPieData();
  const alarmaPieData = getAlarmaPieData();
  const ocupacionData = stats.ocupacion.data;

  // ============================================
  // RENDER
  // ============================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-text-secondary mt-4">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
        <button 
          onClick={() => cargarTodosLosDatos(true)}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className={isDark ? 'text-dark' : 'text-light'}>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className="text-text-secondary">
            Bienvenido, {user?.nombre || 'Usuario'} — Resumen general del sistema
          </p>
          {lastUpdate && (
            <p className="text-xs text-text-muted mt-1">
              Última actualización: {lastUpdate.toLocaleTimeString()} 
              (automática cada {UPDATE_INTERVAL / 1000} segundos)
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
          <button
            onClick={() => cargarTodosLosDatos(true)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 border ${
              isDark 
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            🔄 Actualizar todo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={IconElevator}
          title="Elevadores"
          value={stats.elevadores.total}
          subtitle={Object.entries(stats.elevadores.porEstado).map(([k, v]) => 
            `${k}: ${v}`
          ).join(' | ')}
          color="blue"
          onRefresh={() => cargarElevadores(true)}
          loading={loading.elevadores}
        />
        <StatCard
          icon={IconAlarm}
          title="Alarmas Activas"
          value={stats.alarmas.activas}
          subtitle={`Total: ${stats.alarmas.total}`}
          color="red"
          onRefresh={() => cargarAlarmas(true)}
          loading={loading.alarmas}
        />
        <StatCard
          icon={IconEvent}
          title="Eventos"
          value={stats.eventos.total}
          subtitle="Últimos 50 registros"
          color="cyan"
          onRefresh={() => cargarEventos(true)}
          loading={loading.eventos}
        />
        <StatCard
          icon={IconMaintenance}
          title="Mantenimiento Pendiente"
          value={stats.mantenimiento.pendientes}
          subtitle={`Total: ${stats.mantenimiento.total}`}
          color="yellow"
          onRefresh={() => cargarMantenimiento(true)}
          loading={loading.mantenimiento}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia */}
        <ChartCard 
          title="Tendencia de Actividad" 
          onRefresh={() => cargarTendencia(true)}
          loading={loading.tendencia}
          actions={
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className={`text-xs border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="7d">7 días</option>
              <option value="30d">30 días</option>
              <option value="90d">90 días</option>
            </select>
          }
        >
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e2e8f0'} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 10, fill: isDark ? '#e2e8f0' : '#64748b' }} 
                axisLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
                tickLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: isDark ? '#e2e8f0' : '#64748b' }}
                axisLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
                tickLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                  color: isDark ? '#ffffff' : '#000000',
                  border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }} 
                labelStyle={{ color: isDark ? '#e2e8f0' : '#000000' }}
              />
              <Legend 
                wrapperStyle={{ 
                  color: isDark ? '#e2e8f0' : '#000000',
                  fontSize: '12px'
                }}
                formatter={(value) => (
                  <span style={{ color: isDark ? '#e2e8f0' : '#000000' }}>
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="eventos" fill={isDark ? '#60a5fa' : '#3b82f6'} name="Eventos" />
              <Bar dataKey="alarmas" fill={isDark ? '#f87171' : '#ef4444'} name="Alarmas" />
              <Line type="monotone" dataKey="mantenimientos" stroke={isDark ? '#fbbf24' : '#f59e0b'} name="Mantenimiento" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Estado de elevadores */}
        <ChartCard 
          title="Estado de Elevadores"
          onRefresh={() => cargarElevadores(true)}
          loading={loading.elevadores}
        >
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={estadoPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {estadoPieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={ESTADO_COLORS[entry.name.toLowerCase()] || COLORS.gris} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                  color: isDark ? '#ffffff' : '#000000',
                  border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }} 
                labelStyle={{ color: isDark ? '#e2e8f0' : '#000000' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* ✅ Etiquetas de colores debajo del gráfico - AHORA CON COLOR ADAPTADO */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {estadoPieData.map((entry) => (
              <span key={entry.name} className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: ESTADO_COLORS[entry.name.toLowerCase()] || COLORS.gris }}
                />
                {entry.name}: {entry.value}
              </span>
            ))}
          </div>
        </ChartCard>

        {/* Alarmas por prioridad */}
        <ChartCard 
          title="Alarmas por Prioridad"
          onRefresh={() => cargarAlarmas(true)}
          loading={loading.alarmas}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={alarmaPieData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e2e8f0'} />
              <XAxis 
                type="number" 
                tick={{ fontSize: 10, fill: isDark ? '#e2e8f0' : '#64748b' }}
                axisLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
                tickLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 10, fill: isDark ? '#e2e8f0' : '#64748b', width: 60 }}
                axisLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
                tickLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                  color: isDark ? '#ffffff' : '#000000',
                  border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }} 
                labelStyle={{ color: isDark ? '#e2e8f0' : '#000000' }}
              />
              <Bar dataKey="value" fill={isDark ? '#f87171' : '#ef4444'} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Ocupación */}
        <ChartCard 
          title="Ocupación de Elevadores"
          onRefresh={() => cargarElevadores(true)}
          loading={loading.elevadores}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ocupacionData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e2e8f0'} />
              <XAxis 
                dataKey="nombre" 
                tick={{ fontSize: 9, fill: isDark ? '#e2e8f0' : '#64748b' }} 
                interval={0} 
                angle={-45} 
                textAnchor="end" 
                height={50}
                axisLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
                tickLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: isDark ? '#e2e8f0' : '#64748b' }} 
                domain={[0, 100]}
                axisLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
                tickLine={{ stroke: isDark ? '#4b5563' : '#cbd5e1' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                  color: isDark ? '#ffffff' : '#000000',
                  border: isDark ? '1px solid #374151' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }} 
                labelStyle={{ color: isDark ? '#e2e8f0' : '#000000' }}
              />
              <Bar dataKey="ocupacion" fill={isDark ? '#22d3ee' : '#06b6d4'}>
                {ocupacionData.slice(0, 10).map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={ESTADO_COLORS[entry.estado] || COLORS.gris} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Eventos Recientes */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} rounded-xl overflow-hidden`}>
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Eventos Recientes</h3>
          <button
            onClick={() => cargarEventos(true)}
            disabled={loading.eventos}
            className={`text-xs ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-primary-500 hover:text-primary-700'} flex items-center gap-1 disabled:opacity-50`}
          >
            {loading.eventos ? (
              <span className="inline-block w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              '🔄 Actualizar'
            )}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-4 py-2 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Fecha</th>
                <th className={`px-4 py-2 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Evento</th>
                <th className={`px-4 py-2 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Elevador</th>
                <th className={`px-4 py-2 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Usuario</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {stats.eventos.ultimos.length === 0 ? (
                <tr>
                  <td colSpan="4" className={`px-4 py-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                    No hay eventos recientes
                  </td>
                </tr>
              ) : (
                stats.eventos.ultimos.map((evento, index) => (
                  <tr key={index} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(evento.fecha_hora || evento.created_at).toLocaleDateString()}
                    </td>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                      {evento.descripcion || evento.tipo || '-'}
                    </td>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {evento.elevador?.nombre || evento.id_elevador || '-'}
                    </td>
                    <td className={`px-4 py-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {evento.usuario || 'Sistema'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estado del emulador */}
      {datosEmulador && (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} ${isDark ? 'shadow-lg shadow-black/50' : 'shadow-card'} rounded-xl p-4`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${datosEmulador ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                Emulador: {datosEmulador ? '🟢 Conectado' : '🔴 Desconectado'}
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Última actualización: {new Date(datosEmulador?.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <button
              onClick={() => cargarEmulador(true)}
              disabled={loading.emulador}
              className={`text-xs ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-500 hover:text-cyan-700'} flex items-center gap-1 disabled:opacity-50`}
            >
              {loading.emulador ? (
                <span className="inline-block w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                '🔄 Actualizar'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
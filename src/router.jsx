// frontend/src/router.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './components/pages/Login/Login';
import Dashboard from './components/pages/Dashboard/Dashboard';
import Elevadores from './components/pages/Elevadores/Elevadores';
import Cabinas from './components/pages/Cabinas/Cabinas';
import Alarmas from './components/pages/Alarmas/Alarmas';
import Eventos from './components/pages/Eventos/Eventos';
import Mantenimiento from './components/pages/Mantenimiento/Mantenimiento';
import Reportes from './components/pages/Reportes/Reportes';
import Usuarios from './components/pages/Usuarios/Usuarios';
import Roles from './components/pages/Roles/Roles';
import Privilegios from './components/pages/Privilegios/Privilegios';
import Configuraciones from './components/pages/Configuraciones/Configuraciones';
import Integraciones from './components/pages/Integraciones/Integraciones';
import Catalogo from './components/pages/Catalogo/Catalogo';
import MonitorSCADA from './components/pages/MonitorSCADA/MonitorSCADA';
import InterfacesVisuales from './components/pages/InterfacesVisuales/InterfacesVisuales';
import VisualizacionInterface from './components/pages/Visualizacion/VisualizacionInterface';
import Edificios from './components/pages/Edificios/Edificios';
import Empresas from './components/pages/Empresas/Empresas';
import ParametrosElevador from './components/pages/ParametrosElevador/ParametrosElevador';
import ParametrosCabina from './components/pages/ParametrosCabina/ParametrosCabina';
import Controladores from './components/pages/Controladores/Controladores';
import CatalogoConfiguracionIG from './components/pages/Catalogo/CatalogoConfiguracionIG';
import CatalogoControladores from './components/pages/Catalogo/CatalogoControladores';
import CatalogoVariablesScada from './components/pages/Catalogo/CatalogoVariablesScada';
import CatalogoRoles from './components/pages/Catalogo/CatalogoRoles';
import CatalogoPermisos from './components/pages/Catalogo/CatalogoPermisos';
import ElevadoresGraficos from './components/pages/ElevadoresGraficos/ElevadoresGraficos';
import InterfazGrafica from './components/pages/InterfazGrafica/InterfazGrafica';
import VinculacionParametros from './components/pages/Catalogo/VinculacionParametros';
import MSParametros from './components/pages/MSParametros/MSParametros';
import Logs from './components/pages/Logs';

export const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        // Rutas principales
        { index: true, element: <Dashboard /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'elevadores', element: <Elevadores /> },
        { path: 'cabinas', element: <Cabinas /> },
        { path: 'alarmas', element: <Alarmas /> },
        { path: 'eventos', element: <Eventos /> },
        { path: 'mantenimiento', element: <Mantenimiento /> },
        { path: 'reportes', element: <Reportes /> },
        { path: 'reportes/alarmas', element: <Alarmas /> },
        { path: 'reportes/eventos', element: <Eventos /> },
        { path: 'reportes/mantenimiento', element: <Mantenimiento /> },
        { path: 'reportes/log', element: <Logs /> },
        { path: 'usuarios', element: <Usuarios /> },
        { path: 'roles', element: <Roles /> },
        { path: 'privilegios', element: <Privilegios /> },
        { path: 'configuraciones', element: <Configuraciones /> },
        { path: 'integraciones', element: <Integraciones /> },
        { path: 'monitor', element: <MonitorSCADA /> },
        { path: 'interfaces-visuales', element: <InterfacesVisuales /> },
        { path: 'interfaces/:id', element: <VisualizacionInterface /> },
        { path: 'edificios', element: <Edificios /> },
        { path: 'empresas', element: <Empresas /> },
        { path: 'parametros-elevador', element: <ParametrosElevador /> },
        { path: 'parametros-cabina', element: <ParametrosCabina /> },
        { path: 'interfaz-grafica/:id', element: <InterfazGrafica /> },
        { path: 'vinculacion-parametros', element: <VinculacionParametros /> },
        { path: 'cabinas-graficos', element: <div>Cabinas Gráficos</div> },
        { path: 'usuarios', element: <Usuarios /> },

        { path: 'configuracion-ig', element: <CatalogoConfiguracionIG /> },
        { path: 'controladores', element: <CatalogoControladores /> },
        // { path: 'variables-scada', element: <CatalogoVariablesScada /> },
        { path: 'variables-scada', element: <CatalogoVariablesScada canEdit={true} /> },
        { path: 'roles', element: <CatalogoRoles canEdit={true} /> },
        { path: 'permisos', element: <CatalogoPermisos canEdit={true} /> },
        { path: 'elevadores-graficos', element: <ElevadoresGraficos /> },
        { path: 'ms-parametros', element: <MSParametros /> },
        
        // Ruta genérica de catálogo
        { path: 'catalogo', element: <Catalogo /> },
        { path: 'interfaces-graficas', element: <div>Interfaces Gráficas</div> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
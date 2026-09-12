// frontend/src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useInactivity } from '../../hooks/useInactivity';
import InactivityModal from '../common/InactivityModal';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { showModal, inactiveTime, handleForcedLogout } = useInactivity(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Modal de inactividad - SOLO logout forzado */}
      <InactivityModal
        isOpen={showModal}
        onLogout={handleForcedLogout}
        inactiveTime={inactiveTime}
      />
    </div>
  );
};

export default MainLayout;

// // frontend/src/components/layout/MainLayout.jsx
// import React, { useState } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import { useInactivity } from '../../hooks/useInactivity';
// import Sidebar from './Sidebar';
// import Topbar from './Topbar';

// const MainLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();
  
//   const timeoutMinutes = parseInt(localStorage.getItem('tiempo_inactividad')) || 10;
//   useInactivity(timeoutMinutes);

//   // ✅ Detectar si estamos en la interfaz gráfica
//   const isInterfazGrafica = location.pathname.startsWith('/interfaz-grafica');
//   const isMonitorSCADA = location.pathname.startsWith('/ms-parametros');
//   const isLogin = location.pathname === '/login';

//   // ✅ Fondo oscuro solo para Interfaz Gráfica y Monitor SCADA
//   const isDarkMode = isInterfazGrafica || isMonitorSCADA;

//   return (
//     <div className={`flex h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
//       <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
//       <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-0'}`}>
//         <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//         <main className={`flex-1 overflow-auto ${isDarkMode ? '' : 'p-4'}`}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;
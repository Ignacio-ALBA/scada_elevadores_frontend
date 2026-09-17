// frontend/src/components/pages/Catalogo/CatalogoConfiguracionIG.jsx
import React, { useState, useEffect } from 'react';
import { configuracionIGService } from '../../../services/configuracionIGService';
import { usePermisos } from '../../../context/PermisoContext';
import CatalogoConfiguracionIGTable from './CatalogoConfiguracionIGTable';
import CatalogoConfiguracionIGForm from './CatalogoConfiguracionIGForm';
import { useNombreInterfaz } from '../../../hooks/useNombreInterfaz';

const IconPlus = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
  </svg>
);

const CatalogoConfiguracionIG = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [totalConfiguraciones, setTotalConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [message, setMessage] = useState(null);
  const [filterActivo, setFilterActivo] = useState(true);
  const [elevadoresDisponibles, setElevadoresDisponibles] = useState([]);
  const { puedeCrear, puedeEditar, puedeEliminar } = usePermisos();
  const pageTitle = useNombreInterfaz('configuracion_ig');

  // ✅ Obtener el tema para estilos dinámicos
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDark = temaLocal === 'oscuro';

  const cargarTotalConfiguraciones = async () => {
    try {
      const data = await configuracionIGService.getAll({});
      const sortedData = data.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      setTotalConfiguraciones(sortedData);
    } catch (error) {
      console.error('Error cargando total de configuraciones:', error);
    }
  };

  const cargarConfiguraciones = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterActivo === true) {
        params.estado = 'activo';
      } else if (filterActivo === false) {
        params.estado = 'inactivo';
      }
      const data = await configuracionIGService.getAll(params);
      const sortedData = data.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      setConfiguraciones(sortedData);
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
      setMessage({ type: 'error', text: 'Error al cargar las configuraciones' });
    } finally {
      setLoading(false);
    }
  };

  const cargarElevadoresDisponibles = async () => {
    try {
      const data = await configuracionIGService.getElevadoresDisponibles();
      setElevadoresDisponibles(data);
    } catch (error) {
      console.error('Error cargando elevadores:', error);
    }
  };

  const contarPorEstado = () => {
    if (!totalConfiguraciones || totalConfiguraciones.length === 0) {
      return { todos: 0, activos: 0, inactivos: 0, eliminados: 0 };
    }
    
    const noEliminados = totalConfiguraciones.filter(c => c.estado !== 'eliminado');
    const activos = noEliminados.filter(c => c.estado === 'activo' || c.activo === true);
    const inactivos = noEliminados.filter(c => c.estado === 'inactivo' || c.activo === false);
    const eliminados = totalConfiguraciones.filter(c => c.estado === 'eliminado');
    
    return {
      todos: noEliminados.length,
      activos: activos.length,
      inactivos: inactivos.length,
      eliminados: eliminados.length
    };
  };

  useEffect(() => {
    cargarTotalConfiguraciones();
    cargarElevadoresDisponibles();
  }, []);

  useEffect(() => {
    cargarConfiguraciones();
  }, [filterActivo]);

  const handleAdd = () => {
    setEditingConfig(null);
    setShowForm(true);
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ ¿Estás seguro de ELIMINAR esta configuración? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      await configuracionIGService.delete(id);
      setMessage({ type: 'success', text: 'Configuración eliminada correctamente' });
      await cargarTotalConfiguraciones();
      await cargarConfiguraciones();
    } catch (error) {
      console.error('Error eliminando:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la configuración' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleToggleActivo = async (configuracion) => {
    try {
      await configuracionIGService.toggle(configuracion.id_configuracion);
      setMessage({ 
        type: 'success', 
        text: `Configuración ${configuracion.activo ? 'desactivada' : 'activada'} correctamente` 
      });
      await cargarTotalConfiguraciones();
      await cargarConfiguraciones();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setMessage({ type: 'error', text: 'Error al cambiar el estado' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSave = async (formData) => {
    try {
      if (editingConfig) {
        await configuracionIGService.update(editingConfig.id_configuracion, formData);
        setMessage({ type: 'success', text: 'Configuración actualizada correctamente' });
      } else {
        await configuracionIGService.create(formData);
        setMessage({ type: 'success', text: 'Configuración creada correctamente' });
      }
      setShowForm(false);
      setEditingConfig(null);
      await cargarTotalConfiguraciones();
      await cargarConfiguraciones();
    } catch (error) {
      console.error('Error guardando:', error);
      const errorMsg = error.response?.data?.detail || 'Error al guardar la configuración';
      setMessage({ type: 'error', text: typeof errorMsg === 'string' ? errorMsg : 'Error al guardar' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingConfig(null);
  };

  const handleReordenar = () => {
    cargarTotalConfiguraciones();
    cargarConfiguraciones();
  };

  const contadores = contarPorEstado();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-primary-500'}`}>
            {pageTitle}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-text-secondary'}>
            Configura las interfaces gráficas que aparecerán en el menú "Elevadores Gráficos"
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterActivo(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
              filterActivo === true 
                ? isDark ? 'bg-green-700 text-white' : 'bg-green-100 text-green-700 border border-green-200'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✅ Activos ({contadores.activos})
          </button>
          <button
            onClick={() => setFilterActivo(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
              filterActivo === false 
                ? isDark ? 'bg-red-700 text-white' : 'bg-red-100 text-red-700 border border-red-200'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ❌ Inactivos ({contadores.inactivos})
          </button>
          <button
            onClick={() => setFilterActivo(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
              filterActivo === null 
                ? isDark ? 'bg-cyan-600 text-white' : 'bg-blue-100 text-blue-700 border border-blue-200'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📋 Todos ({contadores.todos})
          </button>
          <span className={`px-4 py-2 text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
            🗑️ Eliminados ({contadores.eliminados})
          </span>
          {puedeCrear('configuracion_ig') && (
            <button
              onClick={handleAdd}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm ${
                isDark 
                  ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-md'
              }`}
            >
              <IconPlus />
              Nueva Configuración
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <CatalogoConfiguracionIGTable
        configuraciones={configuraciones}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActivo={handleToggleActivo}
        onReordenar={handleReordenar}
        puedeEditar={puedeEditar('configuracion_ig')}
        puedeEliminar={puedeEliminar('configuracion_ig')}
        filterActivo={filterActivo}
        isDark={isDark}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center sticky top-0 z-10 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-cyan-400' : 'text-primary-500'}`}>
                {editingConfig ? 'Editar Configuración IG' : 'Nueva Configuración IG'}
              </h2>
              <button onClick={handleCancel} className={isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}>✕</button>
            </div>
            <CatalogoConfiguracionIGForm
              config={editingConfig}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={loading}
              elevadoresDisponibles={elevadoresDisponibles}
              isDark={isDark}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoConfiguracionIG;
// frontend/src/components/pages/Usuarios/CambiarPassword.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';  // ✅ CORREGIDO
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const CambiarPassword = ({ isDark = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post('/usuarios/cambiar-password', formData);
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error al cambiar la contraseña';
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDark ? 'bg-slate-800' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-800';
  const inputFocus = 'focus:ring-2 focus:ring-primary-500';

  // Detectar tema automáticamente
  const temaLocal = localStorage.getItem('tema_actual') || 'default';
  const isDarkMode = isDark !== undefined ? isDark : temaLocal === 'oscuro';

  return (
    <div className={`max-w-md mx-auto ${bgColor} rounded-xl shadow-lg p-6 border ${borderColor}`}>
      <h2 className={`text-xl font-bold ${textColor} mb-4`}>Cambiar contraseña</h2>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>
              Contraseña actual
            </label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${inputFocus} ${inputBg}`}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>
              Nueva contraseña
            </label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              minLength={6}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${inputFocus} ${inputBg}`}
              placeholder="•••••••• (mínimo 6 caracteres)"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${textSecondary}`}>
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              minLength={6}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${inputFocus} ${inputBg}`}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t ${borderColor}">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`px-6 py-2 border rounded-lg transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
          >
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CambiarPassword;
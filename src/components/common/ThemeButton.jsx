// frontend/src/components/common/ThemeButton.jsx
import React from 'react';
import { useSafeTheme } from '../../hooks/useSafeTheme';

const ThemeButton = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const { TEMAS, temaActual } = useSafeTheme();
  const temaLocal = temaActual || 'default';
  const temaConfig = TEMAS ? TEMAS[temaLocal] : {};

  // ✅ Obtener clases según la variante
  const getButtonClasses = () => {
    if (variant === 'primary') {
      return `${temaConfig.buttonPrimaryBg || 'bg-primary-500'} 
              ${temaConfig.buttonPrimaryText || 'text-white'} 
              ${temaConfig.buttonPrimaryHover || 'hover:bg-primary-700'}`;
    }
    
    if (variant === 'secondary') {
      return `${temaConfig.buttonSecondaryBg || 'bg-gray-100'} 
              ${temaConfig.buttonSecondaryText || 'text-gray-700'} 
              ${temaConfig.buttonSecondaryHover || 'hover:bg-gray-200'}`;
    }
    
    if (variant === 'outline') {
      return `border-2 ${temaConfig.buttonSecondaryBg || 'border-gray-300'} 
              ${temaConfig.buttonSecondaryText || 'text-gray-700'} 
              ${temaConfig.buttonSecondaryHover || 'hover:bg-gray-50'}`;
    }
    
    return '';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg transition-colors shadow-sm font-medium ${getButtonClasses()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ThemeButton;
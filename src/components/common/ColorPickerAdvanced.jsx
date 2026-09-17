// frontend/src/components/common/ColorPickerAdvanced.jsx
import React, { useState, useEffect } from 'react';

const ColorPickerAdvanced = ({ 
  value, 
  onChange, 
  label, 
  className = '',
  isDark = false 
}) => {
  // ✅ Parsear el valor correctamente (maneja strings JSON y objetos)
  const parseValue = (val) => {
    if (!val) return { type: 'solid', value: '#3b82f6', opacity: 1 };
    
    // Si es un string, intentar parsear JSON
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (parsed && typeof parsed === 'object') {
          if (parsed.value) {
            return { type: parsed.type || 'solid', value: parsed.value, opacity: parsed.opacity || 1 };
          }
          if (parsed.gradient) {
            return { 
              type: 'gradient', 
              value: '#3b82f6',
              gradient: parsed.gradient,
              opacity: 1
            };
          }
        }
        return { type: 'solid', value: val, opacity: 1 };
      } catch (e) {
        // Si no es JSON, es un string directo
        if (val.startsWith('#')) {
          return { type: 'solid', value: val, opacity: 1 };
        }
        if (val.startsWith('rgba')) {
          const match = val.match(/rgba\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/);
          if (match) {
            return { 
              type: 'rgba', 
              value: `rgb(${match[1]}, ${match[2]}, ${match[3]})`,
              opacity: parseFloat(match[4])
            };
          }
        }
        if (val.includes('gradient')) {
          return { type: 'gradient', value: val, opacity: 1 };
        }
        return { type: 'custom', value: val, opacity: 1 };
      }
    }
    
    // Si es un objeto directamente
    if (typeof val === 'object' && val !== null) {
      if (val.value) {
        return { type: val.type || 'solid', value: val.value, opacity: val.opacity || 1 };
      }
      if (val.gradient) {
        return { type: 'gradient', value: '#3b82f6', gradient: val.gradient, opacity: 1 };
      }
    }
    
    return { type: 'solid', value: '#3b82f6', opacity: 1 };
  };

  const [config, setConfig] = useState(parseValue(value));

  // ✅ Actualizar cuando cambia el value prop
  useEffect(() => {
    setConfig(parseValue(value));
  }, [value]);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (newConfig) => {
    setConfig(newConfig);
    let cssValue = '';
    if (newConfig.type === 'solid') {
      cssValue = newConfig.value;
    } else if (newConfig.type === 'rgba') {
      cssValue = `rgba(${hexToRgb(newConfig.value)}, ${newConfig.opacity})`;
    } else if (newConfig.type === 'gradient') {
      const dir = newConfig.gradient?.direction || 'to right';
      const colors = newConfig.gradient?.colors || ['#3b82f6', '#8b5cf6'];
      cssValue = `linear-gradient(${dir}, ${colors.join(', ')})`;
    } else {
      cssValue = newConfig.value;
    }
    onChange(cssValue);
  };

  const hexToRgb = (hex) => {
    if (!hex) return '0, 0, 0';
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
  };

  const getColorPreview = () => {
    if (config.type === 'gradient' && config.gradient) {
      const dir = config.gradient.direction || 'to right';
      const colors = config.gradient.colors || ['#3b82f6', '#8b5cf6'];
      return `linear-gradient(${dir}, ${colors.join(', ')})`;
    }
    if (config.type === 'rgba') {
      return `rgba(${hexToRgb(config.value)}, ${config.opacity})`;
    }
    return config.value || '#3b82f6';
  };

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  //  Obtener color para el preview (siempre un color sólido para mostrar)
  const getSolidColor = () => {
    if (!config || !config.value) return '#3b82f6';
    
    // Si es un objeto con value
    if (config.value && typeof config.value === 'string') {
      // Si ya es un HEX válido
      if (config.value.startsWith('#')) {
        return config.value;
      }
      // Si es un rgb, extraer y convertir a HEX
      const rgbMatch = config.value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        return rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
      }
    }
    
    // Si es un gradiente, tomar el primer color
    if (config.type === 'gradient' && config.gradient?.colors) {
      const firstColor = config.gradient.colors[0];
      if (firstColor && firstColor.startsWith('#')) {
        return firstColor;
      }
      return '#3b82f6';
    }
    
    return '#3b82f6';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        {/* Color picker - muestra el color real */}
        <input
          type="color"
          value={getSolidColor()} // ✅ getSolidColor() siempre devuelve un HEX válido
          onChange={(e) => {
            const newConfig = { ...config, value: e.target.value };
            if (config.type === 'rgba') {
              newConfig.value = e.target.value;
              newConfig.opacity = config.opacity || 1;
            } else {
              newConfig.value = e.target.value;
            }
            handleChange(newConfig);
          }}
          className="w-8 h-8 rounded-lg cursor-pointer border p-0 flex-shrink-0"
          style={{ 
            borderColor: isDark ? '#4b5563' : '#d1d5db',
            backgroundColor: getSolidColor(),
          }}
        />
        
        {/* Preview del color/gradiente */}
        <div 
          className="w-8 h-8 rounded-lg border flex-shrink-0"
          style={{ 
            background: getColorPreview(),
            borderColor: isDark ? '#4b5563' : '#d1d5db',
          }}
        />
        
        {/* Input de texto con el valor */}
        <input
          type="text"
          value={typeof value === 'string' ? value : JSON.stringify(value)}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          className="flex-1 px-2 py-1 text-sm rounded-lg border font-mono focus:outline-none focus:ring-2 min-w-0"
          style={{
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderColor: isDark ? '#4b5563' : '#d1d5db',
            color: isDark ? '#f1f5f9' : '#1f2937',
          }}
          placeholder="HEX, rgba, o gradiente"
        />
        
        {/* Botón avanzado */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${
            showAdvanced 
              ? 'bg-primary-500 text-white' 
              : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ⚙️
        </button>
      </div>

      {/* Panel avanzado */}
      {showAdvanced && (
        <div 
          className="p-3 rounded-lg border"
          style={{
            backgroundColor: isDark ? '#1f2937' : '#f9fafb',
            borderColor: isDark ? '#4b5563' : '#e5e7eb',
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                Tipo
              </label>
              <select
                value={config.type}
                onChange={(e) => {
                  const newConfig = { ...config, type: e.target.value };
                  if (e.target.value === 'solid') {
                    newConfig.value = config.value || '#3b82f6';
                    newConfig.opacity = 1;
                    delete newConfig.gradient;
                  }
                  if (e.target.value === 'rgba') {
                    newConfig.value = config.value || '#3b82f6';
                    newConfig.opacity = config.opacity || 0.5;
                    delete newConfig.gradient;
                  }
                  if (e.target.value === 'gradient') {
                    newConfig.gradient = {
                      direction: 'to right',
                      colors: [config.value || '#3b82f6', '#8b5cf6']
                    };
                    newConfig.value = '#3b82f6';
                  }
                  handleChange(newConfig);
                }}
                className={`w-full px-2 py-1 text-sm rounded-lg border ${
                  isDark ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-300 bg-white'
                }`}
              >
                <option value="solid">Sólido</option>
                <option value="rgba">Transparente</option>
                <option value="gradient">Gradiente</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            {(config.type === 'rgba') && (
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Opacidad: {Math.round((config.opacity || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.opacity || 1}
                  onChange={(e) => {
                    const newConfig = { ...config, opacity: parseFloat(e.target.value) };
                    handleChange(newConfig);
                  }}
                  className="w-full"
                />
              </div>
            )}

            {(config.type === 'gradient') && (
              <>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Dirección
                  </label>
                  <select
                    value={config.gradient?.direction || 'to right'}
                    onChange={(e) => {
                      const newConfig = { 
                        ...config, 
                        gradient: { 
                          ...config.gradient, 
                          direction: e.target.value 
                        } 
                      };
                      handleChange(newConfig);
                    }}
                    className={`w-full px-2 py-1 text-sm rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <option value="to right">→ Derecha</option>
                    <option value="to left">← Izquierda</option>
                    <option value="to bottom">↓ Abajo</option>
                    <option value="to top">↑ Arriba</option>
                    <option value="to bottom right">↘ Diagonal</option>
                    <option value="to bottom left">↙ Diagonal</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                    Colores (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={config.gradient?.colors?.join(', ') || '#3b82f6, #8b5cf6'}
                    onChange={(e) => {
                      const colors = e.target.value.split(',').map(s => s.trim());
                      const newConfig = { 
                        ...config, 
                        gradient: { 
                          ...config.gradient, 
                          colors: colors 
                        } 
                      };
                      handleChange(newConfig);
                    }}
                    className={`w-full px-2 py-1 text-sm rounded-lg border font-mono ${
                      isDark ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="#color1, #color2"
                  />
                </div>
              </>
            )}

            {(config.type === 'custom') && (
              <div className="col-span-2">
                <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>
                  Valor CSS personalizado
                </label>
                <input
                  type="text"
                  value={config.value || ''}
                  onChange={(e) => {
                    const newConfig = { ...config, value: e.target.value };
                    handleChange(newConfig);
                  }}
                  className={`w-full px-2 py-1 text-sm rounded-lg border font-mono ${
                    isDark ? 'border-gray-600 bg-gray-800 text-gray-200' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="ej: var(--mi-color), #ff0000, rgba(255,0,0,0.5)"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPickerAdvanced;
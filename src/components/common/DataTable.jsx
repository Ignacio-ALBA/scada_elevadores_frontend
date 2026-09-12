import React, { useState, useEffect } from 'react';

// Iconos SVG inline
const IconChevronUp = () => (
  <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
    <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/>
  </svg>
);

const IconChevronDown = () => (
  <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
  </svg>
);

const IconPrev = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
  </svg>
);

const IconNext = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
  </svg>
);

const IconSearch = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
  </svg>
);

/**
 * Componente DataTable genérico y reutilizable
 * 
 * @param {Array} columns - Configuración de columnas [{ key, title, render, sortable, width }]
 * @param {Array} data - Datos a mostrar
 * @param {number} total - Total de registros (para paginación)
 * @param {boolean} loading - Estado de carga
 * @param {number} pageSize - Tamaño de página actual
 * @param {number} currentPage - Página actual
 * @param {function} onPageChange - Callback cuando cambia la página
 * @param {function} onPageSizeChange - Callback cuando cambia el tamaño de página
 * @param {function} onSearch - Callback para búsqueda (opcional)
 * @param {function} onSort - Callback para ordenamiento (opcional)
 * @param {string} emptyMessage - Mensaje cuando no hay datos
 * @param {boolean} selectable - Si se pueden seleccionar filas
 * @param {Array} selectedIds - IDs seleccionados
 * @param {function} onSelect - Callback cuando se selecciona una fila
 * @param {string} idField - Campo usado como ID (default: 'id')
 * @param {Array} actions - Acciones por fila [{ label, icon, onClick, className }]
 * @param {string} className - Clases adicionales
 * @param {string} tableClassName - Clases adicionales para la tabla
 */
const DataTable = ({
  columns = [],
  data = [],
  total = 0,
  loading = false,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  emptyMessage = 'No hay datos para mostrar',
  selectable = false,
  selectedIds = [],
  onSelect,
  idField = 'id',
  actions = [],
  className = '',
  tableClassName = '',
  showSearch = false,
  searchPlaceholder = 'Buscar...',
  showPageSizeSelector = true,
  pageSizeOptions = [5, 10, 20, 50, 100],
  renderRowClassName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectAll, setSelectAll] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  // Efecto para seleccionar/deseleccionar todos
  useEffect(() => {
    if (selectable && data.length > 0) {
      const allSelected = data.every(item => selectedIds.includes(item[idField]));
      setSelectAll(allSelected);
    }
  }, [selectedIds, data, idField, selectable]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    if (onSort) {
      onSort(key, direction);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deseleccionar todos
      const ids = data.map(item => item[idField]);
      if (onSelect) {
        onSelect(selectedIds.filter(id => !ids.includes(id)));
      }
    } else {
      // Seleccionar todos
      const ids = data.map(item => item[idField]);
      if (onSelect) {
        onSelect([...selectedIds, ...ids]);
      }
    }
  };

  const handleSelectRow = (id) => {
    if (onSelect) {
      if (selectedIds.includes(id)) {
        onSelect(selectedIds.filter(selectedId => selectedId !== id));
      } else {
        onSelect([...selectedIds, id]);
      }
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <IconChevronUp /> : <IconChevronDown />;
  };

  const getColumnWidth = (column) => {
    if (column.width) return column.width;
    if (column.key === 'acciones') return 'w-32';
    return '';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Barra de búsqueda */}
      {(showSearch || onSearch) && (
        <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <IconSearch />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showPageSizeSelector && onPageSizeChange && (
              <select
                value={pageSize}
                onChange={(e) => {
                  onPageSizeChange(parseInt(e.target.value));
                }}
                className="px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size} por página
                  </option>
                ))}
              </select>
            )}
            <span className="text-sm text-text-muted">
              {total} registros
            </span>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className={`w-full ${tableClassName}`}>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider ${getColumnWidth(column)}`}
                >
                  {column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-1 hover:text-primary-500 transition-colors focus:outline-none"
                    >
                      {column.title}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.title
                  )}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-24">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  <div className="flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                    Cargando...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="px-4 py-8 text-center text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowClassName = renderRowClassName 
                  ? renderRowClassName(item, index) 
                  : 'hover:bg-gray-50 transition-colors';
                
                return (
                  <tr key={item[idField] || index} className={rowClassName}>
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item[idField])}
                          onChange={() => handleSelectRow(item[idField])}
                          className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-sm ${column.className || ''}`}
                        style={column.style || {}}
                      >
                        {column.render 
                          ? column.render(item[column.key], item, index)
                          : item[column.key] ?? '-'}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={`p-1 rounded hover:bg-gray-100 transition-colors ${action.className || ''}`}
                              title={action.label}
                              disabled={action.disabled ? action.disabled(item) : false}
                            >
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {!loading && data.length > 0 && totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-wrap gap-2">
          <div className="text-sm text-text-muted">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange && onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconPrev />
            </button>
            <button
              onClick={() => onPageChange && onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconNext />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
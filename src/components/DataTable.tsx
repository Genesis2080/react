import React, { useState, useMemo } from 'react';
import { format, parseISO, isValid } from 'date-fns';

export interface Column<T, K extends keyof T = keyof T> {
  key: K;
  header: string;
  render?: (value: T[K], row: T) => React.ReactNode;
  sortable?: boolean;
  dateFormat?: string;
}

interface DataTableProps<T, K extends keyof T = keyof T> {
  data: T[];
  columns: Column<T, K>[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onSave: (updatedRow: T, originalRow: T) => void;
  onCancel: () => void;
  editingRow: Partial<T> | null;
  setEditingRow: (row: Partial<T> | null) => void;
  pageSize?: number;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState<T> {
  key: keyof T | null;
  direction: SortDirection;
}

export function DataTable<T extends object, K extends keyof T = keyof T>({
  data,
  columns,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  editingRow,
  setEditingRow,
  pageSize = 10,
}: DataTableProps<T, K>) {
  const [sortState, setSortState] = useState<SortState<T>>({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.direction) {
      return data;
    }
    return [...data].sort((a, b) => {
      const aVal = a[sortState.key as keyof T];
      const bVal = b[sortState.key as keyof T];
      
      let comparison = 0;
      
      if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        comparison = aVal === bVal ? 0 : aVal ? 1 : -1;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }
      
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState.key, sortState.direction]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleSort = (key: keyof T) => {
    setSortState((prev: SortState<T>) => {
      if (prev.key !== key) {
        return { key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key: null, direction: null };
    });
    setCurrentPage(1);
  };

  const formatCellValue = (col: Column<T, K>, value: T[K]): string => {
    if (col.dateFormat && (value instanceof Date || typeof value === 'string')) {
      const date = typeof value === 'string' ? parseISO(value) : value;
      if (isValid(date)) {
        return format(date, col.dateFormat);
      }
    }
    return String(value);
  };

  const handleInputChange = (key: keyof T, value: string) => {
    if (editingRow) {
      setEditingRow({ ...editingRow, [key]: value });
    }
  };

  const handleSave = (row: T) => {
    if (editingRow) {
      onSave({ ...row, ...editingRow } as T, row);
      setEditingRow(null);
    }
  };

  const renderCell = (col: Column<T, K>, row: T, isEditing: boolean) => {
    const value = row[col.key];
    
    if (isEditing) {
      return (
        <input
          type="text"
          value={(editingRow as Record<string, unknown>)[String(col.key)] as string ?? ''}
          onChange={(e) => handleInputChange(col.key, e.target.value)}
        />
      );
    }
    
    if (col.render) {
      return col.render(value, row);
    }
    
    return formatCellValue(col, value);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th 
                key={String(col.key)}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                className={col.sortable ? 'sortable' : undefined}
              >
                {col.header}
                {sortState.key === col.key && (
                  <span className="sort-icon">{sortState.direction === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => {
            const isRowEditing = editingRow !== null && row === (editingRow as T);
            return (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={`${index}-${String(col.key)}`}>
                    {renderCell(col, row, isRowEditing)}
                  </td>
                ))}
                <td>
                  {isRowEditing ? (
                    <>
                      <button onClick={() => handleSave(row)}>Guardar</button>
                      <button onClick={onCancel}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => {
                        setEditingRow({ ...row } as Partial<T>);
                        onEdit(row);
                      }}>Editar</button>
                      <button onClick={() => onDelete(row)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
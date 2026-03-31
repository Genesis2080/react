import React from 'react';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  onSave: (updatedRow: T, originalRow: T) => void;
  onCancel: () => void;
  editingRow: Partial<T> | null;
  setEditingRow: (row: Partial<T> | null) => void;
}

export function DataTable<T extends object>({
  data,
  columns,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  editingRow,
  setEditingRow,
}: DataTableProps<T>) {
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

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          const isRowEditing = editingRow !== null && row === (editingRow as T);
          return (
            <tr key={index}>
              {columns.map((col) => (
                <td key={`${index}-${String(col.key)}`}>
                  {isRowEditing ? (
                    <input
                      type="text"
                      value={(editingRow as Record<string, unknown>)[String(col.key)] as string ?? ''}
                      onChange={(e) => handleInputChange(col.key, e.target.value)}
                    />
                  ) : col.render ? (
                    col.render(row[col.key], row)
                  ) : (
                    String(row[col.key])
                  )}
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
  );
}
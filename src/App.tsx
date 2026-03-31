import { useState } from 'react';
import { DataTable } from './components/DataTable';
import type { Column } from './components/DataTable';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

const datosIniciales: Usuario[] = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Admin' },
  { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Usuario' },
  { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Usuario' },
];

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(datosIniciales);
  const [editingRow, setEditingRow] = useState<Partial<Usuario> | null>(null);

  const handleEdit = (row: Usuario) => {
    console.log('Editando:', row);
  };

  const handleDelete = (row: Usuario) => {
    setUsuarios(usuarios.filter((u) => u.id !== row.id));
  };

  const handleSave = (updatedRow: Usuario, _originalRow: Usuario) => {
    setUsuarios(usuarios.map((u) => (u.id === updatedRow.id ? updatedRow : u)));
    setEditingRow(null);
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const columns: Column<Usuario>[] = [
    { key: 'id', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { 
      key: 'rol', 
      header: 'Rol',
      render: (value: unknown) => (
        <span style={{ fontWeight: 'bold' }}>{value as string}</span>
      )
    },
  ];

  return (
    <div>
      <h1>DataTable Genérica</h1>
      <DataTable
        data={usuarios}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
        onCancel={handleCancel}
        editingRow={editingRow}
        setEditingRow={setEditingRow}
      />
    </div>
  );
}

export default App;
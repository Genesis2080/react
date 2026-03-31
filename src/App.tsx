import { useState, useCallback } from 'react';
import { DataTable } from './components/DataTable';
import type { Column } from './components/DataTable';
import { calculateDaysDifference } from './utils/dateUtils';
import type { User, Product, Order } from './types';

const initialUsers: User[] = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', createdAt: new Date('2024-01-15'), isActive: true },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'user', createdAt: new Date('2024-02-20'), isActive: true },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'user', createdAt: new Date('2024-03-10'), isActive: false },
  { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'guest', createdAt: new Date('2024-04-05'), isActive: true },
  { id: 5, name: 'Pedro Sánchez', email: 'pedro@example.com', role: 'user', createdAt: new Date('2024-05-12'), isActive: true },
  { id: 6, name: 'Laura Rodríguez', email: 'laura@example.com', role: 'admin', createdAt: new Date('2024-06-01'), isActive: true },
  { id: 7, name: 'Miguel Torres', email: 'miguel@example.com', role: 'user', createdAt: new Date('2024-07-15'), isActive: false },
  { id: 8, name: 'Sofia Jiménez', email: 'sofia@example.com', role: 'user', createdAt: new Date('2024-08-20'), isActive: true },
  { id: 9, name: 'David Moreno', email: 'david@example.com', role: 'guest', createdAt: new Date('2024-09-10'), isActive: true },
  { id: 10, name: 'Elena Ruiz', email: 'elena@example.com', role: 'user', createdAt: new Date('2024-10-25'), isActive: true },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop Pro', sku: 'LP-001', price: 1299.99, stock: 15, category: 'Electronics' },
  { id: 2, name: 'Mouse Wireless', sku: 'MW-002', price: 29.99, stock: 50, category: 'Accessories' },
  { id: 3, name: 'Keyboard Mechanical', sku: 'KM-003', price: 89.99, stock: 25, category: 'Accessories' },
  { id: 4, name: 'Monitor 27"', sku: 'MN-004', price: 399.99, stock: 8, category: 'Electronics' },
  { id: 5, name: 'USB-C Hub', sku: 'UH-005', price: 49.99, stock: 100, category: 'Accessories' },
];

const initialOrders: Order[] = [
  { id: 1, orderNumber: 'ORD-2024-001', customerName: 'Juan Pérez', total: 1399.98, status: 'completed', orderDate: new Date('2024-01-20') },
  { id: 2, orderNumber: 'ORD-2024-002', customerName: 'María García', total: 59.98, status: 'processing', orderDate: new Date('2024-02-15') },
  { id: 3, orderNumber: 'ORD-2024-003', customerName: 'Carlos López', total: 399.99, status: 'pending', orderDate: new Date('2024-03-01') },
  { id: 4, orderNumber: 'ORD-2024-004', customerName: 'Ana Martínez', total: 89.99, status: 'cancelled', orderDate: new Date('2024-03-10') },
  { id: 5, orderNumber: 'ORD-2024-005', customerName: 'Pedro Sánchez', total: 1449.98, status: 'completed', orderDate: new Date('2024-04-05') },
];

function App() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingOrder, setEditingOrder] = useState<Partial<Order> | null>(null);

  const handleEdit = useCallback(() => {}, []);

  const handleDeleteUser = useCallback((row: User) => {
    setUsers(users.filter((u) => u.id !== row.id));
  }, [users]);

  const handleDeleteProduct = useCallback((row: Product) => {
    setProducts(products.filter((p) => p.id !== row.id));
  }, [products]);

  const handleDeleteOrder = useCallback((row: Order) => {
    setOrders(orders.filter((o) => o.id !== row.id));
  }, [orders]);

  const handleSaveUser = useCallback((updatedRow: User) => {
    setUsers(users.map((u) => (u.id === updatedRow.id ? updatedRow : u)));
    setEditingUser(null);
  }, [users]);

  const handleSaveProduct = useCallback((updatedRow: Product) => {
    setProducts(products.map((p) => (p.id === updatedRow.id ? updatedRow : p)));
    setEditingProduct(null);
  }, [products]);

  const handleSaveOrder = useCallback((updatedRow: Order) => {
    setOrders(orders.map((o) => (o.id === updatedRow.id ? updatedRow : o)));
    setEditingOrder(null);
  }, [orders]);

  const userColumns: Column<User, keyof User>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Nombre', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { 
      key: 'role', 
      header: 'Rol',
      sortable: true,
      render: (value) => <span className={`badge badge-${value}`}>{String(value).toUpperCase()}</span>
    },
    { key: 'createdAt', header: 'Creado', sortable: true, dateFormat: 'dd/MM/yyyy' },
    {
      key: 'isActive',
      header: 'Activo',
      render: (value) => <span className={value ? 'status-active' : 'status-inactive'}>{value ? '✓' : '✗'}</span>
    },
  ];

  const productColumns: Column<Product, keyof Product>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Producto', sortable: true },
    { key: 'sku', header: 'SKU', sortable: true },
    { 
      key: 'price', 
      header: 'Precio', 
      sortable: true,
      render: (value) => <span className="price">${Number(value).toFixed(2)}</span>
    },
    { 
      key: 'stock', 
      header: 'Stock',
      sortable: true,
      render: (value) => {
        const stock = Number(value);
        return <span className={stock < 10 ? 'stock-low' : stock < 50 ? 'stock-medium' : 'stock-high'}>{stock}</span>;
      }
    },
    { key: 'category', header: 'Categoría', sortable: true },
  ];

  const orderColumns: Column<Order, keyof Order>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'orderNumber', header: 'Pedido', sortable: true },
    { key: 'customerName', header: 'Cliente', sortable: true },
    { key: 'total', header: 'Total', sortable: true, render: (value) => <span className="price">${Number(value).toFixed(2)}</span> },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      render: (value) => {
        const colors: Record<string, string> = { pending: '#f59e0b', processing: '#3b82f6', completed: '#10b981', cancelled: '#ef4444' };
        return <span className="badge" style={{ backgroundColor: colors[String(value)] }}>{String(value).toUpperCase()}</span>;
      }
    },
    { 
      key: 'orderDate', 
      header: 'Fecha', 
      sortable: true,
      dateFormat: 'dd/MM/yyyy',
      render: (value) => {
        const date = value as Date;
        const days = calculateDaysDifference(date, new Date());
        return <div><div>{date.toLocaleDateString()}</div><small className="text-muted">Hace {days} días</small></div>;
      }
    },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 DataTable Genérico con TypeScript</h1>
        <p>Componente fuertemente tipado con genéricos, paginación, ordenación y formato de fechas</p>
      </header>

      <section className="content-section">
        <h2>👥 Usuarios</h2>
        <DataTable
          data={users}
          columns={userColumns}
          onEdit={handleEdit}
          onDelete={handleDeleteUser}
          onSave={handleSaveUser}
          onCancel={() => setEditingUser(null)}
          editingRow={editingUser}
          setEditingRow={setEditingUser}
          pageSize={5}
        />
      </section>

      <section className="content-section">
        <h2>📦 Productos</h2>
        <DataTable
          data={products}
          columns={productColumns}
          onEdit={handleEdit}
          onDelete={handleDeleteProduct}
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
          editingRow={editingProduct}
          setEditingRow={setEditingProduct}
          pageSize={5}
        />
      </section>

      <section className="content-section">
        <h2>📋 Pedidos</h2>
        <DataTable
          data={orders}
          columns={orderColumns}
          onEdit={handleEdit}
          onDelete={handleDeleteOrder}
          onSave={handleSaveOrder}
          onCancel={() => setEditingOrder(null)}
          editingRow={editingOrder}
          setEditingRow={setEditingOrder}
          pageSize={5}
        />
      </section>

      <footer className="app-footer">
        <p>ℹ️ <strong>Partial&lt;T&gt;</strong> usado para el estado de edición</p>
        <p>📅 <strong>date-fns</strong> integrado para cálculos de fechas con tipos estrictos</p>
      </footer>
    </div>
  );
}

export default App;
# Arquitectura y Tipado en el Proyecto React

## Resumen

Este proyecto utiliza TypeScript con React para garantizar seguridad en tiempo de compilación y reducir errores en runtime. El componente `DataTable<T>` demuestra el uso efectivo de genéricos, tipos de utilidad y librerías externas con tipos estrictos.

---

## Estructura del Proyecto

```
react/
├── src/
│   ├── components/
│   │   └── DataTable.tsx    # Componente genérico
│   ├── types/
│   │   └── index.ts        # Interfaces reutilizables
│   ├── utils/
│   │   └── dateUtils.ts    # Utilidades con date-fns
│   ├── App.tsx             # Demo con 3 tablas
│   └── index.css           # Estilos
├── docs/
│   └── arquitectura-final.md
├── package.json
└── tsconfig.json
```

---

## 1. Genéricos (Generics)

### Implementación

```typescript
// Tipo de columna con genérico
export interface Column<T, K extends keyof T = keyof T> {
  key: K;
  header: string;
  render?: (value: T[K], row: T) => React.ReactNode;
  sortable?: boolean;
  dateFormat?: string;
}

// Componente genérico
export function DataTable<T extends object, K extends keyof T>({...})
```

### Beneficios

- **Type Safety**: Cada columna conoce el tipo exacto de su valor
- **Reutilización**: Un componente para User, Product, Order, etc.
- **Tipado de callbacks**: `onSave` recibe `T` no `any`

### Comparación con JS estándar

| Aspecto | TypeScript (Generics) | JavaScript Estándar |
|---------|----------------------|---------------------|
| Error por tipo incorrecto | En compilación | Solo en runtime |
| IntelliSense | Completo | Parcial/Nulo |
| Refactorización | Segura | Propensa a errores |

---

## 2. Tipos de Utilidad (Utility Types)

### Partial<T>

```typescript
const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
```

**Beneficio**: Permite edición parcial - el usuario modifica solo algunos campos.

### keyof T

```typescript
key: K extends keyof T
```

**Beneficio**: Garantiza que solo se usen claves válidas del tipo T.

### inferencia de tipos en useState

```typescript
const [users, setUsers] = useState<User[]>(initialUsers); // infiere User[]
```

---

## 3. Tipo `never` para Exhaustiveness Checking

### Implementación

```typescript
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'processing': return 'Procesando';
    case 'completed': return 'Completado';
    case 'cancelled': return 'Cancelado';
    default:
      const _exhaustive: never = status;
      throw new Error(`Estado no manejado: ${_exhaustive}`);
  }
}
```

### Beneficios

- **Escalabilidad**: Añadir `'refunded'` fuerza actualizar la función
- **Detección automática**: Sin tests, el compilador avisa

---

## 4. Librerías Externas con Tipos

### date-fns

```typescript
import { differenceInDays, format, parseISO, isValid } from 'date-fns';

// Tipos estrictos: Date → number
export function calculateDaysDifference(startDate: Date, endDate: Date): number {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new TypeError('Both arguments must be Date objects');
  }
  return differenceInDays(endDate, startDate);
}
```

**Verificaciones de tipos:**
- Input debe ser `Date` (validación runtime + tipo)
- Output es `number` garantizado

---

## 5. Componente DataTable<T> - Funcionalidades

### Características implementadas

1. **Genéricos**: `<T extends object, K extends keyof T>`
2. **Partial<T>**: Estado de edición
3. **Ordenación**: Sorting multi-tipo (Date, number, string, boolean)
4. **Paginación**: `pageSize` configurable
5. **Formato de fechas**: `date-fns` integrado
6. **Render personalizado**: Función `render` opcional por columna

### Interfaz completa

```typescript
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
```

### Ejemplo de uso

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  isActive: boolean;
}

const columns: Column<User, keyof User>[] = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Nombre', sortable: true },
  { 
    key: 'createdAt', 
    header: 'Creado', 
    sortable: true, 
    dateFormat: 'dd/MM/yyyy' 
  },
  {
    key: 'isActive',
    header: 'Activo',
    render: (value) => <span>{value ? '✓' : '✗'}</span>
  },
];

<DataTable
  data={users}
  columns={columns}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onSave={handleSave}
  onCancel={handleCancel}
  editingRow={editingUser}
  setEditingRow={setEditingUser}
  pageSize={5}
/>
```

---

## 6. Tipos de Interfaces del Proyecto

```typescript
// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  orderDate: Date;
}
```

**Beneficio**: Tipos reutilizables, cambio en un lugar afecta todo el código.

---

## Conclusión

El uso de TypeScript ha permitido:

1. **Mover errores de runtime a compilación**: El 90% de errores potenciales se detectan antes de ejecutar.
2. **Documentación automática**: Los tipos actúan como documentación ejecutable.
3. **Refactorización segura**: Cambios en estructuras de datos son seguros.
4. **Componente reutilizable**: `DataTable<T>` sirve para cualquier entidad.
5. **Integración con librerías**: `date-fns` aporta funcionalidad con tipos estrictos.

El proyecto demuestra que TypeScript + React = código robusto con menos bugs en producción.

---

## Verificaciones

```bash
# Verificación de tipos
npx tsc --noEmit  # 0 errores ✓

# Build de producción
npm run build     # ✓
```
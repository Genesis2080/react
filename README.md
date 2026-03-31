# DataTable Genérico con React + TypeScript

Proyecto de prácticas que implementa un componente `DataTable<T>` fuertemente tipado utilizando genéricos, tipos de utilidad de TypeScript y la librería `date-fns` para el manejo de fechas.

## Características

- **Componente Genérico**: `DataTable<T>` funciona con cualquier tipo de datos
- **Genéricos con restricciones**: `<T extends object, K extends keyof T>`
- **Ordenación**: Sorting por columnas (Date, number, string, boolean)
- **Paginación**: Configurable con `pageSize`
- **Formato de fechas**: Integración con `date-fns`
- **Partial<T>**: Estado de edición con tipos opcionales
- **Tipado estricto**: Sin `any`, validación completa en compilación

## Estructura del Proyecto

```
src/
├── components/
│   └── DataTable.tsx    # Componente genérico
├── types/
│   └── index.ts         # Interfaces (User, Product, Order)
├── utils/
│   └── dateUtils.ts     # Utilidades con date-fns
├── App.tsx              # Demo con 3 tablas
└── index.css            # Estilos
```

## Tipos de Utilidad utilizados

- `Partial<T>` - Estado de edición
- `keyof T` - Claves válidas
- Genéricos `<T, K>` - Tipado de columnas

## Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Verificación de tipos
npx tsc --noEmit

# Lint
npm run lint
```

## Verificaciones

- `npx tsc --noEmit` → 0 errores ✓
- `npm run lint` → ✓
- `npm run build` → ✓
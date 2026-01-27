// src/pages/inventory/index.js
/**
 * Exportaciones del módulo de inventario.
 *
 * Este módulo incluye:
 * - Dashboard de inventario
 * - Gestión de proveedores
 * - Gestión de marcas
 * - Gestión de productos y stock
 * - Inventario por sucursal
 */

// Dashboard
export { default as InventoryDashboard } from './dashboard/InventoryDashboard';

// Proveedores
export { SuppliersList, SupplierForm } from './suppliers';

// Marcas
export { BrandsList, BrandForm } from './brands';

// Productos
export { ProductsList, ProductDetail, ProductForm } from './products';

// Inventario por sucursal
export { default as ProductsAndInventory } from './ProductsAndInventory';
export { default as BranchInventoryList } from './BranchInventoryList';
export { default as AdjustInventoryModal } from './AdjustInventoryModal';
export { default as TransferInventoryModal } from './TransferInventoryModal';

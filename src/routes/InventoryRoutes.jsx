// src/routes/InventoryRoutes.jsx
/**
 * Rutas del módulo de inventario.
 * 
 * Este archivo define las rutas para la gestión de inventario por sucursal.
 * Debe ser importado en el App.jsx principal.
 */

import { Routes, Route } from 'react-router-dom';
import { BranchInventoryList } from '@/pages/inventory';

/**
 * Componente de rutas de inventario.
 * 
 * Rutas disponibles:
 * - /inventory - Lista de inventario por sucursal
 */
const InventoryRoutes = () => {
  return (
    <Routes>
      <Route index element={<BranchInventoryList />} />
    </Routes>
  );
};

export default InventoryRoutes;

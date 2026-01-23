// src/routes/SupplierRoutes.jsx
/**
 * Rutas del módulo de proveedores.
 * 
 * Este archivo define las rutas para el CRUD de proveedores.
 * Debe ser importado en el App.jsx principal.
 */

import { Routes, Route } from 'react-router-dom';
import { SuppliersList, SupplierForm } from '@/pages/suppliers';

/**
 * Componente de rutas de proveedores.
 * 
 * Rutas disponibles:
 * - /suppliers - Lista de proveedores
 * - /suppliers/new - Crear nuevo proveedor
 * - /suppliers/:id/edit - Editar proveedor
 */
const SupplierRoutes = () => {
  return (
    <Routes>
      <Route index element={<SuppliersList />} />
      <Route path="new" element={<SupplierForm />} />
      <Route path=":id/edit" element={<SupplierForm />} />
    </Routes>
  );
};

export default SupplierRoutes;

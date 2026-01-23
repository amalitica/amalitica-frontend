// src/routes/BrandRoutes.jsx
/**
 * Rutas del módulo de marcas.
 * 
 * Este archivo define las rutas para el CRUD de marcas.
 * Debe ser importado en el App.jsx principal.
 */

import { Routes, Route } from 'react-router-dom';
import { BrandsList, BrandForm } from '@/pages/brands';

/**
 * Componente de rutas de marcas.
 * 
 * Rutas disponibles:
 * - /brands - Lista de marcas
 * - /brands/new - Crear nueva marca
 * - /brands/:id/edit - Editar marca
 */
const BrandRoutes = () => {
  return (
    <Routes>
      <Route index element={<BrandsList />} />
      <Route path="new" element={<BrandForm />} />
      <Route path=":id/edit" element={<BrandForm />} />
    </Routes>
  );
};

export default BrandRoutes;

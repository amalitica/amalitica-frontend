// src/routes/ProductRoutes.jsx
/**
 * Rutas del módulo de productos.
 * 
 * Este archivo define las rutas para el CRUD de productos.
 * Debe ser importado en el App.jsx principal.
 */

import { Routes, Route } from 'react-router-dom';
import { ProductsList, ProductDetail, ProductForm } from '@/pages/products';

/**
 * Componente de rutas de productos.
 * 
 * Rutas disponibles:
 * - /products - Lista de productos
 * - /products/new - Crear nuevo producto
 * - /products/:id - Ver detalle de producto
 * - /products/:id/edit - Editar producto
 */
const ProductRoutes = () => {
  return (
    <Routes>
      <Route index element={<ProductsList />} />
      <Route path="new" element={<ProductForm />} />
      <Route path=":id" element={<ProductDetail />} />
      <Route path=":id/edit" element={<ProductForm />} />
    </Routes>
  );
};

export default ProductRoutes;

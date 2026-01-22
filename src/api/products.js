// src/api/products.js
/**
 * Servicio API para gestión de productos.
 * 
 * Este módulo contiene todas las funciones para comunicarse con
 * los endpoints de productos del backend.
 */

import api from './axios';

/**
 * Obtiene todos los enums disponibles para productos.
 * Se usa para poblar los selectores en formularios.
 * 
 * @returns {Promise<Object>} Objeto con todos los enums
 */
export const getProductEnums = async () => {
  const response = await api.get('/inventory/products/enums');
  return response.data;
};

/**
 * Obtiene el resumen de estadísticas de productos.
 * 
 * @returns {Promise<Object>} Estadísticas de productos
 */
export const getProductsStatsSummary = async () => {
  const response = await api.get('/inventory/products/stats/summary');
  return response.data;
};

/**
 * Lista productos con paginación, filtros y búsqueda.
 * 
 * @param {Object} params - Parámetros de consulta
 * @param {number} [params.page=1] - Número de página
 * @param {number} [params.page_size=20] - Tamaño de página
 * @param {string} [params.search] - Búsqueda por nombre, SKU o código de barras
 * @param {string} [params.category] - Filtrar por categoría
 * @param {string} [params.supplier] - Filtrar por proveedor
 * @param {string} [params.price_tier] - Filtrar por segmento de precio
 * @param {string} [params.lifecycle_stage] - Filtrar por etapa del ciclo de vida
 * @param {boolean} [params.low_stock] - Solo productos con stock bajo
 * @param {boolean} [params.out_of_stock] - Solo productos agotados
 * @param {boolean} [params.active=true] - Filtrar por estado activo
 * @param {string} [params.sort_by='name'] - Campo para ordenar
 * @param {string} [params.sort_order='asc'] - Orden: asc o desc
 * @returns {Promise<Object>} Respuesta paginada con productos
 */
export const getProducts = async (params = {}) => {
  const response = await api.get('/inventory/products', { params });
  return response.data;
};

/**
 * Obtiene un producto por su ID con todos los detalles.
 * 
 * @param {number} productId - ID del producto
 * @returns {Promise<Object>} Producto con detalles y métricas
 */
export const getProduct = async (productId) => {
  const response = await api.get(`/inventory/products/${productId}`);
  return response.data;
};

/**
 * Crea un nuevo producto.
 * 
 * @param {Object} productData - Datos del producto
 * @returns {Promise<Object>} Producto creado
 */
export const createProduct = async (productData) => {
  const response = await api.post('/inventory/products', productData);
  return response.data;
};

/**
 * Actualiza un producto existente.
 * 
 * @param {number} productId - ID del producto
 * @param {Object} productData - Datos a actualizar
 * @returns {Promise<Object>} Producto actualizado
 */
export const updateProduct = async (productId, productData) => {
  const response = await api.patch(`/inventory/products/${productId}`, productData);
  return response.data;
};

/**
 * Elimina (soft delete) un producto.
 * 
 * @param {number} productId - ID del producto
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  await api.delete(`/inventory/products/${productId}`);
};

/**
 * Exporta productos a CSV.
 * 
 * @param {Object} params - Parámetros de filtro (mismos que getProducts)
 * @returns {Promise<Blob>} Archivo CSV
 */
export const exportProductsCSV = async (params = {}) => {
  const response = await api.get('/inventory/products/export/csv', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

// =============================================================================
// CONSTANTES Y HELPERS
// =============================================================================

/**
 * Mapeo de categorías a colores para badges.
 */
export const CATEGORY_COLORS = {
  FRAME: 'bg-blue-100 text-blue-800',
  LENS: 'bg-green-100 text-green-800',
  CONTACT_LENS: 'bg-purple-100 text-purple-800',
  ACCESSORY: 'bg-orange-100 text-orange-800',
  SOLUTION: 'bg-cyan-100 text-cyan-800',
  CASE: 'bg-gray-100 text-gray-800',
  CLEANING: 'bg-yellow-100 text-yellow-800',
  OTHER: 'bg-slate-100 text-slate-800',
};

/**
 * Mapeo de categorías a nombres en español.
 */
export const CATEGORY_LABELS = {
  FRAME: 'Armazón',
  LENS: 'Lente Oftálmico',
  CONTACT_LENS: 'Lente de Contacto',
  ACCESSORY: 'Accesorio',
  SOLUTION: 'Solución',
  CASE: 'Estuche',
  CLEANING: 'Limpieza',
  OTHER: 'Otro',
};

/**
 * Mapeo de segmentos de precio a colores.
 */
export const PRICE_TIER_COLORS = {
  ECONOMY: 'bg-green-100 text-green-800',
  STANDARD: 'bg-blue-100 text-blue-800',
  PREMIUM: 'bg-purple-100 text-purple-800',
  LUXURY: 'bg-amber-100 text-amber-800',
};

/**
 * Mapeo de etapas del ciclo de vida a colores.
 */
export const LIFECYCLE_COLORS = {
  NEW: 'bg-green-100 text-green-800',
  GROWING: 'bg-blue-100 text-blue-800',
  MATURE: 'bg-gray-100 text-gray-800',
  DECLINING: 'bg-orange-100 text-orange-800',
  DISCONTINUED: 'bg-red-100 text-red-800',
};

/**
 * Formatea un precio en pesos mexicanos.
 * 
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return '-';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);
};

/**
 * Formatea un porcentaje.
 * 
 * @param {number} value - Valor a formatear
 * @param {number} [decimals=1] - Decimales
 * @returns {string} Porcentaje formateado
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea una fecha.
 * 
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default {
  getProductEnums,
  getProductsStatsSummary,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProductsCSV,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PRICE_TIER_COLORS,
  LIFECYCLE_COLORS,
  formatPrice,
  formatPercent,
  formatDate,
};

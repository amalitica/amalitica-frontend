// src/api/brands.js
/**
 * Servicio API para gestión de marcas.
 *
 * Este módulo contiene todas las funciones para comunicarse con
 * los endpoints de marcas del backend.
 */

import api from './axios';

/**
 * Lista simplificada de marcas para dropdowns.
 *
 * @param {Object} params - Parámetros de consulta
 * @param {string} [params.category] - Filtrar por categoría de producto
 * @param {boolean} [params.include_inactive=false] - Incluir marcas inactivas
 * @returns {Promise<Array>} Lista de marcas (id, name, category, is_luxury, active)
 */
export const getBrandsSimple = async (params = {}) => {
  const response = await api.get('/brands/simple', { params });
  return response.data;
};

/**
 * Lista marcas con paginación, búsqueda y filtros.
 *
 * @param {Object} params - Parámetros de consulta
 * @param {number} [params.page=1] - Número de página
 * @param {number} [params.page_size=20] - Tamaño de página
 * @param {string} [params.search] - Búsqueda por nombre o fabricante
 * @param {string} [params.category] - Filtrar por categoría
 * @param {number} [params.supplier_id] - Filtrar por proveedor
 * @param {boolean} [params.is_luxury] - Filtrar por marcas de lujo
 * @param {boolean} [params.active_only=true] - Solo marcas activas
 * @returns {Promise<Object>} Respuesta paginada con marcas
 */
export const getBrands = async (params = {}) => {
  const response = await api.get('/brands', { params });
  return response.data;
};

/**
 * Obtiene una marca por su ID.
 *
 * @param {number} brandId - ID de la marca
 * @returns {Promise<Object>} Marca con detalles
 */
export const getBrand = async (brandId) => {
  const response = await api.get(`/brands/${brandId}`);
  return response.data;
};

/**
 * Crea una nueva marca.
 *
 * @param {Object} brandData - Datos de la marca
 * @returns {Promise<Object>} Marca creada
 */
export const createBrand = async (brandData) => {
  const response = await api.post('/brands', brandData);
  return response.data;
};

/**
 * Actualiza una marca existente.
 *
 * @param {number} brandId - ID de la marca
 * @param {Object} brandData - Datos a actualizar
 * @returns {Promise<Object>} Marca actualizada
 */
export const updateBrand = async (brandId, brandData) => {
  const response = await api.patch(`/brands/${brandId}`, brandData);
  return response.data;
};

/**
 * Elimina (soft delete) una marca.
 *
 * @param {number} brandId - ID de la marca
 * @returns {Promise<void>}
 */
export const deleteBrand = async (brandId) => {
  await api.delete(`/brands/${brandId}`);
};

export default {
  getBrandsSimple,
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};

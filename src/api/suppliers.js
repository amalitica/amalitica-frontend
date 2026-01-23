// src/api/suppliers.js
/**
 * Servicio API para gestión de proveedores.
 *
 * Este módulo contiene todas las funciones para comunicarse con
 * los endpoints de proveedores del backend.
 */

import api from './axios';

/**
 * Lista simplificada de proveedores para dropdowns.
 *
 * @param {boolean} [includeInactive=false] - Incluir proveedores inactivos
 * @returns {Promise<Array>} Lista de proveedores (id, name, active)
 */
export const getSuppliersSimple = async (includeInactive = false) => {
  const response = await api.get('/suppliers/simple', {
    params: { include_inactive: includeInactive },
  });
  return response.data;
};

/**
 * Lista proveedores con paginación y búsqueda.
 *
 * @param {Object} params - Parámetros de consulta
 * @param {number} [params.page=1] - Número de página
 * @param {number} [params.page_size=20] - Tamaño de página
 * @param {string} [params.search] - Búsqueda por nombre, RFC o contacto
 * @param {boolean} [params.active_only=true] - Solo proveedores activos
 * @returns {Promise<Object>} Respuesta paginada con proveedores
 */
export const getSuppliers = async (params = {}) => {
  const response = await api.get('/suppliers', { params });
  return response.data;
};

/**
 * Obtiene un proveedor por su ID.
 *
 * @param {number} supplierId - ID del proveedor
 * @returns {Promise<Object>} Proveedor con detalles
 */
export const getSupplier = async (supplierId) => {
  const response = await api.get(`/suppliers/${supplierId}`);
  return response.data;
};

/**
 * Crea un nuevo proveedor.
 *
 * @param {Object} supplierData - Datos del proveedor
 * @returns {Promise<Object>} Proveedor creado
 */
export const createSupplier = async (supplierData) => {
  const response = await api.post('/suppliers', supplierData);
  return response.data;
};

/**
 * Actualiza un proveedor existente.
 *
 * @param {number} supplierId - ID del proveedor
 * @param {Object} supplierData - Datos a actualizar
 * @returns {Promise<Object>} Proveedor actualizado
 */
export const updateSupplier = async (supplierId, supplierData) => {
  const response = await api.patch(`/suppliers/${supplierId}`, supplierData);
  return response.data;
};

/**
 * Elimina (soft delete) un proveedor.
 *
 * @param {number} supplierId - ID del proveedor
 * @returns {Promise<void>}
 */
export const deleteSupplier = async (supplierId) => {
  await api.delete(`/suppliers/${supplierId}`);
};

export default {
  getSuppliersSimple,
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};

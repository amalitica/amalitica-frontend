// src/api/inventory.js
/**
 * Servicio API para gestión de inventario por sucursal.
 *
 * Este módulo contiene todas las funciones para comunicarse con
 * los endpoints de inventario del backend.
 */

import api from './axios';

// ============================================================================
// DASHBOARD DE INVENTARIO
// ============================================================================

/**
 * Obtiene datos para el Dashboard de Inventario.
 *
 * @returns {Promise<Object>} Métricas del inventario
 */
export const getInventoryDashboard = async () => {
  const response = await api.get('/inventory/dashboard');
  return response.data;
};

/**
 * Obtiene el progreso de configuración inicial del inventario.
 *
 * @returns {Promise<Object>} Progreso de configuración con checklist
 */
export const getSetupProgress = async () => {
  const response = await api.get('/inventory/dashboard/setup-progress');
  return response.data;
};

/**
 * Obtiene la actividad reciente del inventario.
 *
 * @param {number} [limit=10] - Número máximo de actividades
 * @returns {Promise<Array>} Lista de actividades recientes
 */
export const getRecentActivity = async (limit = 10) => {
  const response = await api.get('/inventory/dashboard/recent-activity', {
    params: { limit },
  });
  return response.data;
};

// ============================================================================
// INVENTARIO POR SUCURSAL
// ============================================================================

/**
 * Lista el inventario de una sucursal específica con filtros y paginación.
 *
 * @param {number} branchId - ID de la sucursal
 * @param {Object} params - Parámetros de consulta
 * @param {string} [params.search] - Buscar por SKU o nombre de producto
 * @param {string} [params.category] - Filtrar por categoría
 * @param {boolean} [params.low_stock] - Solo productos con stock bajo
 * @param {boolean} [params.out_of_stock] - Solo productos agotados
 * @param {number} [params.page=1] - Número de página
 * @param {number} [params.page_size=20] - Tamaño de página
 * @returns {Promise<Object>} Respuesta paginada con inventario
 */
export const getBranchInventory = async (branchId, params = {}) => {
  const response = await api.get(`/inventory/branch/${branchId}`, { params });
  return response.data;
};

/**
 * Obtiene el inventario de un producto en todas las sucursales.
 *
 * @param {number} productId - ID del producto
 * @returns {Promise<Array>} Lista de inventario por sucursal
 */
export const getProductInventoryAllBranches = async (productId) => {
  const response = await api.get(`/inventory/product/${productId}`);
  return response.data;
};

/**
 * Lista todos los productos con stock bajo.
 *
 * @param {number} [branchId] - Filtrar por sucursal (opcional)
 * @returns {Promise<Array>} Lista de productos con stock bajo
 */
export const getLowStockProducts = async (branchId = null) => {
  const params = branchId ? { branch_id: branchId } : {};
  const response = await api.get('/inventory/low-stock', { params });
  return response.data;
};

/**
 * Lista todos los productos agotados.
 *
 * @param {number} [branchId] - Filtrar por sucursal (opcional)
 * @returns {Promise<Array>} Lista de productos agotados
 */
export const getOutOfStockProducts = async (branchId = null) => {
  const params = branchId ? { branch_id: branchId } : {};
  const response = await api.get('/inventory/out-of-stock', { params });
  return response.data;
};

/**
 * Ajusta el inventario de un producto en una sucursal.
 *
 * @param {Object} adjustment - Datos del ajuste
 * @param {number} adjustment.product_id - ID del producto
 * @param {number} adjustment.branch_id - ID de la sucursal
 * @param {number} adjustment.quantity - Cantidad a ajustar (positivo=entrada, negativo=salida)
 * @param {string} adjustment.reason - Razón del ajuste (PURCHASE, SALE, ADJUSTMENT, DAMAGED, RETURN, INITIAL, OTHER)
 * @param {string} [adjustment.notes] - Notas adicionales
 * @returns {Promise<Object>} Datos del ajuste creado
 */
export const adjustInventory = async (adjustment) => {
  const response = await api.post('/inventory/adjust', adjustment);
  return response.data;
};

/**
 * Transfiere inventario de un producto entre sucursales.
 *
 * @param {Object} transfer - Datos de la transferencia
 * @param {number} transfer.product_id - ID del producto
 * @param {number} transfer.from_branch_id - ID de la sucursal origen
 * @param {number} transfer.to_branch_id - ID de la sucursal destino
 * @param {number} transfer.quantity - Cantidad a transferir (debe ser positiva)
 * @param {string} [transfer.notes] - Notas adicionales
 * @returns {Promise<Object>} Datos de la transferencia creada
 */
export const transferInventory = async (transfer) => {
  const response = await api.post('/inventory/transfer', transfer);
  return response.data;
};

/**
 * Actualiza la configuración de inventario (reorder_level, safety_stock, location).
 *
 * @param {number} inventoryId - ID del registro de inventario
 * @param {Object} update - Datos a actualizar
 * @param {number} [update.reorder_level] - Nivel de reorden
 * @param {number} [update.safety_stock] - Stock de seguridad
 * @param {string} [update.location] - Ubicación física
 * @returns {Promise<Object>} Datos del inventario actualizado
 */
export const updateInventoryConfig = async (inventoryId, update) => {
  const response = await api.patch(`/inventory/${inventoryId}`, update);
  return response.data;
};

/**
 * Obtiene estadísticas globales de inventario del tenant.
 *
 * @returns {Promise<Object>} Estadísticas globales de inventario
 */
export const getInventoryStats = async () => {
  const response = await api.get('/inventory/stats');
  return response.data;
};

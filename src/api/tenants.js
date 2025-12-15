import axios from 'axios';

// Detectar si estamos en desarrollo o producción
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Registrar un nuevo tenant (óptica) en el sistema.
 *
 * Este endpoint es público y no requiere autenticación.
 * Crea en una sola transacción:
 * - TenantSettings (configuración del negocio)
 * - Subscription (14 días de prueba gratis)
 * - Branch (sucursal principal)
 * - User (administrador)
 *
 * @param {Object} tenantData - Datos del registro
 * @param {string} tenantData.business_name - Nombre del negocio
 * @param {string} tenantData.business_email - Correo del negocio
 * @param {string} tenantData.business_phone - Teléfono del negocio
 * @param {string} tenantData.branch_code - Código de la sucursal (ej. 'MTZ')
 * @param {string} tenantData.branch_name - Nombre de la sucursal (ej. 'Matriz')
 * @param {string} tenantData.branch_address - Dirección de la sucursal
 * @param {string} tenantData.branch_city - Ciudad
 * @param {string} tenantData.branch_state - Estado
 * @param {string} [tenantData.branch_postal_code] - Código postal (opcional)
 * @param {string} tenantData.admin_name - Nombre del administrador
 * @param {string} tenantData.admin_email - Correo del administrador
 * @param {string} [tenantData.admin_phone] - Teléfono del administrador (opcional)
 * @param {string} tenantData.admin_password - Contraseña del administrador
 *
 * @returns {Promise<Object>} Respuesta con tokens y datos del registro
 * @returns {boolean} response.success - Indica si el registro fue exitoso
 * @returns {string} response.message - Mensaje de bienvenida
 * @returns {number} response.tenant_id - ID del tenant creado
 * @returns {number} response.admin_user_id - ID del usuario administrador
 * @returns {number} response.branch_id - ID de la sucursal creada
 * @returns {number} response.subscription_id - ID de la suscripción
 * @returns {string} response.access_token - Token JWT de acceso
 * @returns {string} response.refresh_token - Token JWT de refresh
 * @returns {string} response.token_type - Tipo de token ('bearer')
 */
export const registerTenant = async (tenantData) => {
  // Usamos axios directamente (sin apiClient) porque es un endpoint público
  // que no requiere autenticación ni interceptores
  const response = await axios.post(
    `${API_BASE_URL}/public/register-tenant`,
    tenantData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export default {
  registerTenant,
};

// src/api/compliance.js
/**
 * API client para endpoints de cumplimiento LFPDPPP.
 */

import api from './axios';

/**
 * Crea un registro de consentimiento para un cliente.
 * @param {number} customerId - ID del cliente
 * @param {Object} consentData - Datos del consentimiento
 * @param {boolean} consentData.primary_consent - Consentimiento primario (obligatorio)
 * @param {boolean} consentData.secondary_consent - Consentimiento secundario (opcional)
 * @param {string} consentData.consent_method - Método de obtención del consentimiento
 * @param {string} [consentData.ip_address] - Dirección IP del cliente
 * @param {string} [consentData.user_agent] - User-Agent del navegador
 * @returns {Promise} Respuesta del servidor con el consentimiento creado
 */
export const createConsent = (customerId, consentData) => {
  return api.post(`/compliance/customers/${customerId}/consent`, consentData);
};

/**
 * Obtiene el consentimiento activo de un cliente.
 * @param {number} customerId - ID del cliente
 * @returns {Promise} Respuesta del servidor con el consentimiento
 */
export const getConsent = (customerId) => {
  return api.get(`/compliance/customers/${customerId}/consent`);
};

/**
 * Actualiza el consentimiento secundario de un cliente.
 * @param {number} customerId - ID del cliente
 * @param {Object} updateData - Datos a actualizar
 * @param {boolean} updateData.secondary_consent - Nuevo valor del consentimiento secundario
 * @returns {Promise} Respuesta del servidor con el consentimiento actualizado
 */
export const updateSecondaryConsent = (customerId, updateData) => {
  return api.put(`/compliance/customers/${customerId}/consent`, updateData);
};

/**
 * Revoca el consentimiento de un cliente.
 * @param {number} customerId - ID del cliente
 * @param {string} [reason] - Motivo de la revocación
 * @returns {Promise} Respuesta del servidor
 */
export const revokeConsent = (customerId, reason = null) => {
  const params = reason ? { reason } : {};
  return api.delete(`/compliance/customers/${customerId}/consent`, { params });
};

/**
 * Obtiene estadísticas de consentimiento del tenant.
 * @returns {Promise} Respuesta del servidor con las estadísticas
 */
export const getConsentStatistics = () => {
  return api.get('/compliance/statistics');
};

/**
 * Obtiene la versión actual del Aviso de Privacidad.
 * @returns {Promise} Respuesta del servidor con la versión
 */
export const getPrivacyPolicyVersion = () => {
  return api.get('/compliance/privacy-policy/version');
};

// src/api/consultations.js
import apiClient from './axios';

/**
 * Obtener todas las consultas con paginación y búsqueda
 * @param {number} page - Número de página (1-indexed)
 * @param {number} size - Tamaño de página (máximo 100)
 * @param {string} search - Término de búsqueda (opcional)
 * @returns {Promise} - Respuesta con {total_count, page, size, items}
 */
export const getConsultations = async (page = 1, size = 20, search = '') => {
  const params = { page, size };
  if (search) {
    params.q = search; // Cambiar 'search' a 'q' para coincidir con el backend
  }
  return apiClient.get('/consultations/', { params });
};

/**
 * Obtener una consulta por ID
 * @param {number} id - ID de la consulta
 * @returns {Promise} - Datos de la consulta
 */
export const getConsultationById = async (id) => {
  return apiClient.get(`/consultations/${id}`);
};

/**
 * Crear una nueva consulta
 * @param {object} consultationData - Datos de la consulta
 * @returns {Promise} - Consulta creada
 */
export const createConsultation = async (consultationData) => {
  return apiClient.post('/consultations/', consultationData);
};

/**
 * Actualizar una consulta existente
 * @param {number} id - ID de la consulta
 * @param {object} consultationData - Datos actualizados
 * @returns {Promise} - Consulta actualizada
 */
export const updateConsultation = async (id, consultationData) => {
  return apiClient.patch(`/consultations/${id}`, consultationData);
};

/**
 * Eliminar una consulta (borrado lógico)
 * @param {number} id - ID de la consulta
 * @returns {Promise}
 */
export const deleteConsultation = async (id) => {
  return apiClient.delete(`/consultations/${id}`);
};

/**
 * Obtener estadísticas de consultas
 * @returns {Promise} - Estadísticas de consultas
 */
export const getConsultationStats = async () => {
  return apiClient.get('/consultations/stats/summary');
};

/**
 * Obtener consultas con entregas pendientes
 *
 * Retorna las consultas que tienen productos pendientes de entrega,
 * ordenadas por fecha de entrega más próxima.
 *
 * @returns {Promise} - Lista de consultas con entregas pendientes
 */
export const getPendingDeliveries = async () => {
  return apiClient.get('/consultations/pending-deliveries');
};

// src/api/catalogs.js
// API para el catálogo geográfico de México (SEPOMEX)

import api from './axios';

/**
 * Obtiene la lista de todos los estados de México.
 * @returns {Promise<Array>} Lista de estados con id, code y name
 */
export const getStates = async () => {
  const response = await api.get('/catalogs/states');
  return response.data;
};

/**
 * Obtiene los municipios de un estado específico.
 * @param {number} stateId - ID del estado
 * @returns {Promise<Array>} Lista de municipios con id, code, name y state_id
 */
export const getMunicipalitiesByState = async (stateId) => {
  const response = await api.get(`/catalogs/states/${stateId}/municipalities`);
  return response.data;
};

/**
 * Busca asentamientos (colonias) por código postal.
 * También devuelve información del estado y municipio correspondiente.
 * @param {string} postalCode - Código postal de 5 dígitos
 * @returns {Promise<Object>} Objeto con postal_code, state, municipality, settlements y total_settlements
 */
export const lookupByPostalCode = async (postalCode) => {
  const response = await api.get('/catalogs/settlements', {
    params: { postal_code: postalCode }
  });
  return response.data;
};

/**
 * Obtiene los códigos postales de un municipio específico.
 * @param {number} municipalityId - ID del municipio
 * @returns {Promise<Array>} Lista de códigos postales con postal_code y settlement_count
 */
export const getPostalCodesByMunicipality = async (municipalityId) => {
  const response = await api.get(`/catalogs/municipalities/${municipalityId}/postal-codes`);
  return response.data;
};

/**
 * Obtiene los asentamientos de un municipio específico.
 * @param {number} municipalityId - ID del municipio
 * @param {number} limit - Límite de resultados (default: 100)
 * @param {number} offset - Offset para paginación (default: 0)
 * @returns {Promise<Array>} Lista de asentamientos
 */
export const getSettlementsByMunicipality = async (municipalityId, limit = 100, offset = 0) => {
  const response = await api.get(`/catalogs/municipalities/${municipalityId}/settlements`, {
    params: { limit, offset }
  });
  return response.data;
};

/**
 * Crea un asentamiento personalizado (cuando la colonia no está en el catálogo).
 * @param {Object} data - Datos del asentamiento
 * @param {string} data.postal_code - Código postal de 5 dígitos
 * @param {string} data.name - Nombre de la colonia
 * @param {number} data.municipality_id - ID del municipio
 * @param {string} [data.settlement_type] - Tipo de asentamiento (default: "Colonia")
 * @returns {Promise<Object>} Asentamiento creado con su ID
 */
export const createCustomSettlement = async (data) => {
  const response = await api.post('/catalogs/settlements', data);
  return response.data;
};

/**
 * Busca asentamientos por nombre.
 * @param {string} query - Término de búsqueda (mínimo 2 caracteres)
 * @param {number} [stateId] - Filtrar por estado (opcional)
 * @param {number} [limit] - Límite de resultados (default: 20)
 * @returns {Promise<Array>} Lista de asentamientos que coinciden
 */
export const searchSettlements = async (query, stateId = null, limit = 20) => {
  const params = { q: query, limit };
  if (stateId) params.state_id = stateId;
  
  const response = await api.get('/catalogs/settlements/search', { params });
  return response.data;
};

export default {
  getStates,
  getMunicipalitiesByState,
  lookupByPostalCode,
  getPostalCodesByMunicipality,
  getSettlementsByMunicipality,
  createCustomSettlement,
  searchSettlements,
};

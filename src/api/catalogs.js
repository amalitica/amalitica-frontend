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
 * Obtiene los asentamientos de un municipio específico.
 * @param {number} municipalityId - ID del municipio
 * @param {string} [searchQuery] - Término de búsqueda para filtrar por nombre (opcional)
 * @param {number} limit - Límite de resultados (default: 1000)
 * @param {number} offset - Offset para paginación (default: 0)
 * @returns {Promise<Array>} Lista de asentamientos
 */
export const getSettlementsByMunicipality = async (municipalityId, searchQuery = null, limit = 1000, offset = 0) => {
  const params = { limit, offset };
  if (searchQuery) {
    params.q = searchQuery;
  }
  const response = await api.get(`/catalogs/municipalities/${municipalityId}/settlements`, {
    params
  });
  return response.data;
};

/**
 * Obtiene los códigos postales de una colonia específica por nombre.
 * Devuelve información completa incluyendo estado, municipio y lista de CPs.
 * @param {number} municipalityId - ID del municipio
 * @param {string} settlementName - Nombre de la colonia
 * @param {string} [settlementType] - Tipo de asentamiento (opcional, para desambiguar)
 * @returns {Promise<Object>} Objeto con settlement_name, settlement_type, municipality, state, postal_codes y total_postal_codes
 */
export const getPostalCodesBySettlementName = async (municipalityId, settlementName, settlementType = null) => {
  const params = {
    municipality_id: municipalityId,
    settlement_name: settlementName
  };
  if (settlementType) {
    params.settlement_type = settlementType;
  }
  const response = await api.get('/catalogs/settlements/by-name/postal-codes', { params });
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

export default {
  getStates,
  getMunicipalitiesByState,
  lookupByPostalCode,
  getSettlementsByMunicipality,
  getPostalCodesBySettlementName,
  createCustomSettlement,
};

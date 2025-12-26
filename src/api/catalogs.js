// src/api/catalogs.js
/**
 * API para el catálogo geográfico de México (SEPOMEX).
 *
 * Este módulo proporciona funciones para consultar el catálogo geográfico
 * de México, incluyendo estados, municipios y asentamientos (colonias).
 *
 * Flujos de captura de domicilio soportados:
 *
 * **Flujo 1: Por Código Postal (CP → Estado/Municipio → Colonia)**
 * - lookupByPostalCode(postalCode) - Busca por CP y devuelve estado, municipio y colonias
 *
 * **Flujo 2: Por Ubicación (Estado → Municipio → Colonia → CP)**
 * - getStates() - Lista todos los estados
 * - getMunicipalitiesByState(stateId) - Lista municipios de un estado
 * - getSettlementsByMunicipality(municipalityId) - Lista colonias AGRUPADAS con CPs incluidos
 *
 * **Ambos Flujos:**
 * - createCustomSettlement(data) - Crea colonia personalizada cuando no aparece en catálogo
 */

import api from './axios';

/**
 * Obtiene la lista de todos los estados de México.
 *
 * @returns {Promise<Array>} Lista de estados con id, code y name
 *
 * @example
 * const states = await getStates();
 * // [{ id: 1, code: "01", name: "Aguascalientes" }, ...]
 */
export const getStates = async () => {
  const response = await api.get('/catalogs/states');
  return response.data;
};

/**
 * Obtiene los municipios de un estado específico.
 *
 * @param {number} stateId - ID del estado
 * @returns {Promise<Array>} Lista de municipios con id, code, name y state_id
 *
 * @example
 * const municipalities = await getMunicipalitiesByState(9); // CDMX
 * // [{ id: 10, code: "010", name: "Álvaro Obregón", state_id: 9 }, ...]
 */
export const getMunicipalitiesByState = async (stateId) => {
  const response = await api.get(`/catalogs/states/${stateId}/municipalities`);
  return response.data;
};

/**
 * Busca asentamientos (colonias) por código postal.
 * También devuelve información del estado y municipio correspondiente.
 *
 * Este endpoint se usa en el Flujo 1 (CP → Estado/Municipio → Colonia).
 *
 * @param {string} postalCode - Código postal de 5 dígitos
 * @returns {Promise<Object>} Objeto con postal_code, state, municipality, settlements y total_settlements
 *
 * @example
 * const result = await lookupByPostalCode('01000');
 * // {
 * //   postal_code: "01000",
 * //   state: { id: 9, code: "09", name: "Ciudad de México" },
 * //   municipality: { id: 10, code: "010", name: "Álvaro Obregón", state_id: 9 },
 * //   settlements: [{ id: 12345, postal_code: "01000", name: "San Ángel", ... }],
 * //   total_settlements: 1
 * // }
 */
export const lookupByPostalCode = async (postalCode) => {
  const response = await api.get('/catalogs/settlements', {
    params: { postal_code: postalCode }
  });
  return response.data;
};

/**
 * Obtiene los asentamientos de un municipio específico (AGRUPADOS).
 *
 * Este endpoint se usa en el Flujo 2 (Estado → Municipio → Colonia → CP).
 *
 * **IMPORTANTE:** Los asentamientos vienen AGRUPADOS por nombre y tipo,
 * eliminando duplicados. Cada asentamiento incluye todos sus códigos postales
 * en el campo `postal_codes`.
 *
 * @param {number} municipalityId - ID del municipio
 * @param {string} [searchQuery] - Término de búsqueda para filtrar por nombre (opcional)
 * @param {number} [limit=1000] - Límite de resultados
 * @param {number} [offset=0] - Offset para paginación
 * @returns {Promise<Array>} Lista de asentamientos agrupados
 *
 * @example
 * const settlements = await getSettlementsByMunicipality(2713);
 * // [
 * //   {
 * //     id: 185229,
 * //     name: "Abore",
 * //     settlement_type: "Ranchería",
 * //     postal_codes: ["33194", "33195", "33196"],  // ← Todos los CPs incluidos
 * //     total_postal_codes: 3,
 * //     ...
 * //   },
 * //   ...
 * // ]
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
 * Crea un asentamiento personalizado (cuando la colonia no está en el catálogo).
 *
 * Se usa en ambos flujos cuando el usuario no encuentra su colonia en la lista
 * y necesita ingresarla manualmente.
 *
 * @param {Object} data - Datos del asentamiento
 * @param {string} data.postal_code - Código postal de 5 dígitos
 * @param {string} data.name - Nombre de la colonia
 * @param {number} data.municipality_id - ID del municipio
 * @param {string} [data.settlement_type="Colonia"] - Tipo de asentamiento
 * @returns {Promise<Object>} Asentamiento creado con su ID
 *
 * @example
 * const newSettlement = await createCustomSettlement({
 *   postal_code: '06600',
 *   name: 'Mi Nueva Colonia',
 *   municipality_id: 15,
 *   settlement_type: 'Colonia'
 * });
 * // { id: 999999, postal_code: "06600", name: "Mi Nueva Colonia", is_official: false, ... }
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
  createCustomSettlement,
};

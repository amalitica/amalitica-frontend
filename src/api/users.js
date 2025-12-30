// src/api/users.js
import api from './axios';

export const getUsers = async (params = {}) => {
  const response = await api.get('/users/', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

/**
 * Infiere el género a partir del nombre proporcionado.
 * 
 * @param {string} name - Nombre(s) para inferir género
 * @returns {Promise<{
 *   gender: string,
 *   gender_enum: string | null,
 *   confidence: number,
 *   method: string,
 *   name_used: string
 * }>} Resultado de la inferencia
 * 
 * @example
 * const result = await inferGender('María José');
 * // { gender: 'female', gender_enum: 'Femenino', confidence: 0.95, method: 'gender-guesser', name_used: 'María' }
 */
export const inferGender = async (name) => {
  const response = await api.post('/gender/infer', { name });
  return response.data;
};

/**
 * Infiere el género para múltiples nombres en una sola llamada.
 * 
 * @param {string[]} names - Lista de nombres a analizar
 * @returns {Promise<Array<{
 *   gender: string,
 *   gender_enum: string | null,
 *   confidence: number,
 *   method: string,
 *   name_used: string
 * }>>} Lista de resultados de inferencia
 */
export const inferGenderBatch = async (names) => {
  const response = await api.post('/gender/infer-batch', names);
  return response.data;
};

import apiClient from './axios';

export const getCustomers = (params) => {
  return apiClient.get('/customers/', { params });
};

export const searchCustomers = async (query) => {
  if (!query || query.length < 2) return [];

  // Llamamos a getCustomers con los parámetros justos para la búsqueda
  const response = await getCustomers({ q: query, size: 10 });
  return response.data.items;
};

/**
 *  Obtener los enums disponibles para clientes
 *  @return {Promise}
 */
export const getCustomerEnums = () => {
  return apiClient.get('/customers/enums');
};

export const getCustomerById = (id) => {
  return apiClient.get(`/customers/${id}`);
};

export const createCustomer = (customerData) => {
  return apiClient.post('/customers/', customerData);
};

export const updateCustomer = (id, customerData) => {
  return apiClient.patch(`/customers/${id}`, customerData);
};

export const deleteCustomer = (id) => {
  return apiClient.delete(`/customers/${id}`);
};

export const getCustomerStats = () => {
  return apiClient.get('/customers/stats/summary');
};

/**
 * Obtener los clientes más recientes de la sucursal
 * @param {number} limit - Número de clientes a obtener (por defecto 10)
 * @returns {Promise} - Lista de clientes recientes
 */
export const getRecentCustomers = async (limit = 10) => {
  const response = await getCustomers({
    size: limit,
    sort_by: 'creation_date',
    sort_order: 'desc',
  });
  return response.data.items;
};

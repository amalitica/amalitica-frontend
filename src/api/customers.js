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

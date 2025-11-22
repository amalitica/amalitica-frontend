import apiClient from './axios';

export const getCustomers = (params) => {
  return apiClient.get('/customers/', { params });
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

import apiClient from './axios';

export const getCustomers = (params) => {
  return apiClient.get('/customers/', { params });
};

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

import apiClient from './axios';

export const getConsultations = (params) => {
  return apiClient.get('/consultations/', { params });
};

export const createConsultation = (data) => {
  return apiClient.post('/consultations/', data);
};

// Agrega aquí las demás funciones (getById, update, delete) cuando las necesites

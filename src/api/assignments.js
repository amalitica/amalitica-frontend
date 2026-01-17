// src/api/assignments.js

import api from './config';

const ASSIGNMENTS_URL = '/api/v1/assignments';

export const createAssignment = async (assignmentData) => {
  const response = await api.post(ASSIGNMENTS_URL, assignmentData);
  return response.data;
};

export const getAssignment = async (assignmentId) => {
  const response = await api.get(`${ASSIGNMENTS_URL}/${assignmentId}`);
  return response.data;
};

export const updateAssignment = async (assignmentId, assignmentData) => {
  const response = await api.patch(`${ASSIGNMENTS_URL}/${assignmentId}`, assignmentData);
  return response.data;
};

export const deleteAssignment = async (assignmentId) => {
  const response = await api.delete(`${ASSIGNMENTS_URL}/${assignmentId}`);
  return response.data;
};

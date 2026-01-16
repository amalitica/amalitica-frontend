import apiClient from './axios';

export const getBranches = (params) => {
  return apiClient.get('/branches/', { params });
};

export const getBranchById = (id) => {
  return apiClient.get(`/branches/${id}`);
};

export const createBranch = (branchData) => {
  return apiClient.post('/branches/', branchData);
};

export const updateBranch = (id, branchData) => {
  return apiClient.patch(`/branches/${id}`, branchData);
};

export const deleteBranch = (id) => {
  return apiClient.delete(`/branches/${id}`);
};

/**
 * Obtener todas las sucursales activas (sin paginación para selectores)
 */
export const getAllBranches = async () => {
  const response = await getBranches({ size: 100 });
  return response.data.items;
};

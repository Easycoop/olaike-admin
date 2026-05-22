import api from "../api/axios";

export const getFees = async (groupId) => {
  const response = await api.get(`/fees/definitions/${groupId}`);
  return response.data;
};

export const createFee = async (payload) => {
  const response = await api.post(`/fees/definitions`, payload);
  return response.data;
};

export const updateFee = async (payload) => {
  const response = await api.put(`/fees/definitions/${payload.id}`, payload);
  return response.data;
};

export const deleteFee = async (feeId) => {
  const response = await api.delete(`/fees/definitions/${feeId}`);
  return response.data;
};
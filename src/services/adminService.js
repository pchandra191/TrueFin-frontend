import api from "./api";

function unwrap(res) {
  return res.data;
}

export const getDashboardStats = () =>
  api.get("/api/analytics/dashboard").then(unwrap);

export const getDefaulters = (params) =>
  api.get("/api/analytics/defaulters", { params }).then(unwrap);

export const getCollections = (params) =>
  api.get("/api/analytics/collections", { params }).then(unwrap);

export const getBorrowers = (params) =>
  api.get("/api/borrowers", { params }).then(unwrap);

export const getBorrowerById = (id) =>
  api.get(`/api/borrowers/${id}`).then(unwrap);

export const createBorrower = (data) =>
  api.post("/api/borrowers", data).then(unwrap);

export const updateBorrower = (id, data) =>
  api.put(`/api/borrowers/${id}`, data).then(unwrap);

export const deleteBorrower = (id) =>
  api.delete(`/api/borrowers/${id}`).then(unwrap);

export const recordPayment = (id, data) =>
  api.post(`/api/borrowers/${id}/installments`, data).then(unwrap);

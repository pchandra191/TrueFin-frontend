/* globals api imported from ./api.js */
import api from "./api";

export const getLoans = (params = {}) =>
  api.get("/api/loans", { params });

export const getLoanById = (id) =>
  api.get(`/api/loans/${id}`);

export const createLoan = (data) =>
  api.post("/api/loans", data);

export const updateLoan = (id, data) =>
  api.put(`/api/loans/${id}`, data);

export const deleteLoan = (id) =>
  api.delete(`/api/loans/${id}`);

export const getLoanStatistics = () =>
  api.get("/api/loans/statistics");

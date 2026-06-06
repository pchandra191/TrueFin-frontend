import api from "./api";

export const getInstallments = (loanId) =>
  api.get(`/api/loans/${loanId}/installments`);

export const createInstallment = (loanId, data) =>
  api.post(`/api/loans/${loanId}/installments`, data);

export const updateInstallment = (loanId, installmentId, data) =>
  api.put(`/api/loans/${loanId}/installments/${installmentId}`, data);

export const deleteInstallment = (loanId, installmentId) =>
  api.delete(`/api/loans/${loanId}/installments/${installmentId}`);

export const markInstallmentPaid = (loanId, installmentId) =>
  api.post(`/api/loans/${loanId}/installments/${installmentId}/pay`);

import api from "./api";

function unwrap<T>(res: { data: T }) {
  return res.data;
}

export function getInstallments(loanId: string) {
  return api.get(`/api/loans/${loanId}/installments`).then(unwrap);
}

export function createInstallment(loanId: string, data: object) {
  return api.post(`/api/loans/${loanId}/installments`, data).then(unwrap);
}

export function updateInstallment(loanId: string, installmentId: string, data: object) {
  return api.put(`/api/loans/${loanId}/installments/${installmentId}`, data).then(unwrap);
}

export function deleteInstallment(loanId: string, installmentId: string) {
  return api.delete(`/api/loans/${loanId}/installments/${installmentId}`).then(unwrap);
}

export function markInstallmentPaid(loanId: string, installmentId: string) {
  return api.post(`/api/loans/${loanId}/installments/${installmentId}/pay`).then(unwrap);
}

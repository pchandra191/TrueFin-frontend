import api from "./api";

function unwrap<T>(res: { data: T }) {
  return res.data;
}

export function getLoans(params: object = {}) {
  return api.get("/api/loans", { params }).then(unwrap);
}

export function getLoanById(id: string) {
  return api.get(`/api/loans/${id}`).then(unwrap);
}

export function createLoan(data: object) {
  return api.post("/api/loans", data).then(unwrap);
}

export function updateLoan(id: string, data: object) {
  return api.put(`/api/loans/${id}`, data).then(unwrap);
}

export function deleteLoan(id: string) {
  return api.delete(`/api/loans/${id}`).then(unwrap);
}

export function getLoanStatistics() {
  return api.get("/api/loans/statistics").then(unwrap);
}

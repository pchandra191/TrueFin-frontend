import api from "./api";
import {
  cachedApiCall,
  CACHE_DURATIONS,
  invalidateRelatedCache,
} from "./cacheService";

function unwrap<T>(res: { data: T }) {
  return res.data;
}

export function getInstallments(loanId: string) {
  const cacheKey = `tf_cache_med_installments_${loanId}`;
  return cachedApiCall(
    cacheKey,
    () => api.get(`/api/loans/${loanId}/installments`).then(unwrap),
    CACHE_DURATIONS.MEDIUM
  );
}

export function createInstallment(loanId: string, data: object) {
  invalidateRelatedCache(`tf_cache_med_installments_${loanId}`);
  return api.post(`/api/loans/${loanId}/installments`, data).then(unwrap);
}

export function updateInstallment(loanId: string, installmentId: string, data: object) {
  invalidateRelatedCache(`tf_cache_med_installments_${loanId}`);
  return api.put(`/api/loans/${loanId}/installments/${installmentId}`, data).then(unwrap);
}

export function deleteInstallment(loanId: string, installmentId: string) {
  invalidateRelatedCache(`tf_cache_med_installments_${loanId}`);
  return api.delete(`/api/loans/${loanId}/installments/${installmentId}`).then(unwrap);
}

export function markInstallmentPaid(loanId: string, installmentId: string) {
  invalidateRelatedCache(`tf_cache_med_installments_${loanId}`);
  return api.post(`/api/loans/${loanId}/installments/${installmentId}/pay`).then(unwrap);
}

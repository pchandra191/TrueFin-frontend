import api from "./api";
import type {
  BorrowersResponse,
  Borrower,
  Installment,
} from "../types/borrower";
import {
  cachedApiCall,
  CACHE_DURATIONS,
  CACHE_KEYS,
  getBorrowersCacheKey,
  getBorrowerCacheKey,
  setCachedData,
  invalidateRelatedCache,
} from "./cacheService";

async function unwrap<T>(res: { data: T }): Promise<T> {
  return res.data;
}

// --- Borrowers ---

export function getBorrowers(params: {
  cityId: number;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<BorrowersResponse> {
  const cacheKey = getBorrowersCacheKey(params);
  return cachedApiCall(
    cacheKey,
    () => api.get<BorrowersResponse>("/api/borrowers", { params }).then(unwrap),
    CACHE_DURATIONS.MEDIUM
  );
}

export function getBorrowerById(id: string): Promise<Borrower> {
  const cacheKey = getBorrowerCacheKey(id);
  return cachedApiCall(
    cacheKey,
    () => api.get<Borrower>(`/api/borrowers/${id}`).then(unwrap),
    CACHE_DURATIONS.MEDIUM
  );
}

export function createBorrower(
  data: Partial<Borrower>
): Promise<Borrower | { message: string; uniqueId: string }> {
  return api.post("/api/borrowers", data).then(unwrap);
}

export function updateBorrower(
  id: string,
  data: Partial<Borrower>
): Promise<Borrower> {
  invalidateRelatedCache(`tf_cache_med_borrower_${id}`);
  invalidateRelatedCache("tf_cache_med_borrowers_");
  return api.put(`/api/borrowers/${id}`, data).then(unwrap);
}

export function deleteBorrower(id: string): Promise<{ message: string }> {
  invalidateRelatedCache("tf_cache_med_borrowers_");
  return api.delete(`/api/borrowers/${id}`).then(unwrap);
}

export function recordPayment(
  id: string,
  data: { month: string; amount: number; status?: string }
): Promise<Borrower> {
  invalidateRelatedCache(`tf_cache_med_borrower_${id}`);
  invalidateRelatedCache("tf_cache_med_borrowers_");
  invalidateRelatedCache("tf_cache_med_dashboard_stats");
  invalidateRelatedCache("tf_cache_med_collections");
  return api.post(`/api/borrowers/${id}/installments`, data).then(unwrap);
}

// --- Analytics ---

export interface DashboardStats {
  totalBorrowers: number;
  outstandingAmount: number;
  monthlyCollection: number;
  defaultersCount: number;
  totalCollection?: number;
  paidInstallments?: number;
  defaulterInstallments?: number;
  pendingInstallments?: number;
  totalInstallments?: number;
}

export interface Defaulter {
  uniqueId: string;
  name: string;
  cityId: number;
  missedMonths: string[];
  totalMissed: number;
}

export interface Collection {
  month: string;
  amount: number;
  count: number;
}

export function getDashboardStats(): Promise<DashboardStats> {
  return cachedApiCall(
    CACHE_KEYS.DASHBOARD_STATS,
    () => api.get("/api/analytics/dashboard").then(unwrap),
    CACHE_DURATIONS.MEDIUM
  );
}

export function getDefaulters(params?: {
  cityId?: number;
  page?: number;
  limit?: number;
}): Promise<{ defaulters: Defaulter[]; total: number }> {
  const cacheKey = `tf_cache_med_defaulters_${params?.cityId || 0}_${params?.page || 1}`;
  return cachedApiCall(
    cacheKey,
    () => api.get("/api/analytics/defaulters", { params }).then(unwrap),
    CACHE_DURATIONS.MEDIUM
  );
}

export function getCollections(params?: {
  cityId?: number;
  months?: number;
}): Promise<{ collections: Collection[] }> {
  const cacheKey = `tf_cache_med_collections_${params?.cityId || 0}_${params?.months || 6}`;
  return cachedApiCall(
    cacheKey,
    () => api.get("/api/analytics/collections", { params }).then(unwrap),
    CACHE_DURATIONS.MEDIUM
  );
}

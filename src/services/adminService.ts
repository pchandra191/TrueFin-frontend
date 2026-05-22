import api from "./api";
import type {
  BorrowersResponse,
  Borrower,
  Installment,
} from "../types/borrower";

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
  return api.get<BorrowersResponse>("/api/borrowers", { params }).then(unwrap);
}

export function getBorrowerById(id: string): Promise<Borrower> {
  return api.get<Borrower>(`/api/borrowers/${id}`).then(unwrap);
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
  return api.put(`/api/borrowers/${id}`, data).then(unwrap);
}

export function deleteBorrower(id: string): Promise<{ message: string }> {
  return api.delete(`/api/borrowers/${id}`).then(unwrap);
}

export function recordPayment(
  id: string,
  data: { month: string; amount: number; status?: string }
): Promise<Borrower> {
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
  return api.get("/api/analytics/dashboard").then(unwrap);
}

export function getDefaulters(params?: {
  cityId?: number;
  page?: number;
  limit?: number;
}): Promise<{ defaulters: Defaulter[]; total: number }> {
  return api.get("/api/analytics/defaulters", { params }).then(unwrap);
}

export function getCollections(params?: {
  cityId?: number;
  months?: number;
}): Promise<{ collections: Collection[] }> {
  return api.get("/api/analytics/collections", { params }).then(unwrap);
}

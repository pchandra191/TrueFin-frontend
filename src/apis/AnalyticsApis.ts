const API_BASE = "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("trufin_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

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

export async function getDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>("/analytics/dashboard");
}

export async function getDefaulters(params?: {
  cityId?: number;
  page?: number;
  limit?: number;
}): Promise<{ defaulters: Defaulter[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.cityId) query.set("cityId", String(params.cityId));
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  return request(`/analytics/defaulters?${query.toString()}`);
}

export async function getCollections(params?: {
  cityId?: number;
  months?: number;
}): Promise<{ collections: Collection[] }> {
  const query = new URLSearchParams();
  if (params?.cityId) query.set("cityId", String(params.cityId));
  if (params?.months) query.set("months", String(params.months));
  return request(`/analytics/collections?${query.toString()}`);
}

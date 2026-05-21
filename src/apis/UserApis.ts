const API_BASE = "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `Request failed: ${response.status}`);
  }
  return payload;
}

export interface UserInstallment {
  month: string;
  amount: number;
  status: "paid" | "pending" | "defaulter" | string;
  datePaid?: string;
}

export interface UserTrackSummary {
  totalPaid: number;
  outstanding: number;
  totalInstallments: number;
  defaulterCount: number;
}

export interface UserTrackResponse {
  uniqueId: string;
  name: string;
  connectorName: string;
  cityId: number;
  installmentCondition?: string;
  lastLeft?: string | number;
  IPM?: number[];
  summary: UserTrackSummary;
  installments: UserInstallment[];
}

export function trackLogin(uniqueId: string): Promise<UserTrackResponse> {
  return request<UserTrackResponse>("/track/login", {
    method: "POST",
    body: JSON.stringify({ uniqueId }),
  });
}

export function getTrackByUniqueId(uniqueId: string): Promise<UserTrackResponse> {
  return request<UserTrackResponse>(`/track/${encodeURIComponent(uniqueId)}`);
}

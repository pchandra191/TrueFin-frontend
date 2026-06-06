import api from "./api";
import {
  cachedApiCall,
  CACHE_DURATIONS,
} from "./cacheService";

function unwrap<T>(res: { data: T }): T {
  return res.data;
}

interface UserTrackSummary {
  totalPaid: number;
  outstanding: number;
  totalInstallments: number;
  defaulterCount: number;
}

interface UserInstallment {
  month: string;
  amount: number;
  status: "paid" | "pending" | "defaulter" | string;
  datePaid?: string;
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
  return api.post("/api/track/login", { uniqueId }).then(unwrap);
}

export function getTrackByUniqueId(
  uniqueId: string
): Promise<UserTrackResponse> {
  const cacheKey = `tf_cache_med_track_${uniqueId}`;
  return cachedApiCall(
    cacheKey,
    () =>
      api
        .get(`/api/track/${encodeURIComponent(uniqueId)}`)
        .then(unwrap),
    CACHE_DURATIONS.MEDIUM
  );
}

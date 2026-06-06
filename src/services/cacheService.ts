/**
 * @fileoverview Browser-side caching utility using localStorage/sessionStorage.
 * Provides intelligent caching strategies for read-only and frequently accessed data.
 * No external caching services (Redis, Service Workers) required.
 */

/** Cache duration constants in milliseconds */
export const CACHE_DURATIONS = {
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  MEDIUM: 10 * 60 * 1000,    // 10 minutes
  SHORT: 5 * 60 * 1000,       // 5 minutes
} as const;

/** Cache key prefixes to avoid collisions */
const KEY_PREFIXES = {
  LONG: "tf_cache_long_",
  MEDIUM: "tf_cache_med_",
  SESSION: "tf_cache_sess_",
} as const;

/** Active request cache for deduplication */
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Creates a namespaced cache key
 */
function createKey(prefix: string, key: string): string {
  return `${prefix}${key}`;
}

/**
 * Retrieves cached data from storage
 * @param key - The cache key to look up
 * @param duration - Cache duration in milliseconds
 * @returns Parsed cached data or null if expired/missing
 */
export function getCachedData<T = unknown>(key: string, duration: number): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as { data: T; timestamp: number };
    const now = Date.now();

    if (now - parsed.timestamp > duration) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * Stores data in cache with timestamp
 * @param key - The cache key
 * @param data - Data to cache
 */
export function setCachedData<T>(key: string, data: T): void {
  try {
    const payload = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Storage full or unavailable - fail silently
  }
}

/**
 * Removes cached data by key
 */
export function removeCachedData(key: string): void {
  try {
    localStorage.removeItem(key);
    pendingRequests.delete(key);
  } catch {
    // Fail silently
  }
}

/**
 * Clears all expired cache entries
 */
export function clearExpiredCache(): void {
  try {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const stored = localStorage.getItem(key);
      if (!stored) continue;

      try {
        const parsed = JSON.parse(stored) as { timestamp?: number };
        if (parsed.timestamp && now - parsed.timestamp > CACHE_DURATIONS.LONG) {
          keysToRemove.push(key);
        }
      } catch {
        continue;
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      pendingRequests.delete(key);
    });
  } catch {
    // Fail silently
  }
}

/**
 * Clears all cache entries for a given prefix
 */
export function clearCacheByPrefix(prefix: string): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Fail silently
  }
}

/**
 * Cached API wrapper that returns cached data immediately and refreshes in background.
 * Also prevents duplicate concurrent API requests for the same key.
 */
export async function cachedApiCall<T>(
  key: string,
  apiFn: () => Promise<T>,
  duration: number
): Promise<T> {
  // Check for cached data first (fast path)
  const cached = getCachedData<T>(key, duration);

  if (cached !== null) {
    // Return cached data immediately
    // Also queue background refresh if no pending request exists
    if (!pendingRequests.has(key)) {
      pendingRequests.set(key, apiFn().then((fresh) => {
        setCachedData(key, fresh);
        pendingRequests.delete(key);
      }).catch(() => {
        pendingRequests.delete(key);
      }));
    }
    return cached;
  }

  // Check for pending request (request deduplication)
  const pending = pendingRequests.get(key) as Promise<T> | undefined;
  if (pending) {
    return pending;
  }

  // Make fresh API call
  const promise = apiFn().then((fresh) => {
    setCachedData(key, fresh);
    pendingRequests.delete(key);
    return fresh;
  });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Clears cache on write operations to ensure fresh data on next read
 */
export function invalidateRelatedCache(keyPattern: string): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes(keyPattern)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    pendingRequests.forEach((_, key) => {
      if (key.includes(keyPattern)) {
        pendingRequests.delete(key);
      }
    });
  } catch {
    // Fail silently
  }
}

/**
 * Synchronously reads cached data without triggering API call
 */
export function getCachedSync<T = unknown>(key: string): T | null {
  return getCachedData<T>(key, CACHE_DURATIONS.MEDIUM);
}

// Specific cache keys
export const CACHE_KEYS = {
  CITIES: createKey(KEY_PREFIXES.LONG, "cities"),
  CONNECTORS: createKey(KEY_PREFIXES.LONG, "connectors"),
  ROLES: createKey(KEY_PREFIXES.LONG, "roles"),
  PERMISSIONS: createKey(KEY_PREFIXES.LONG, "permissions"),
  SETTINGS: createKey(KEY_PREFIXES.LONG, "settings"),
  DASHBOARD_STATS: createKey(KEY_PREFIXES.MEDIUM, "dashboard_stats"),
  COLLECTIONS: createKey(KEY_PREFIXES.MEDIUM, "collections"),
  DEFAULT_USER_IMAGE: createKey(KEY_PREFIXES.SESSION, "default_user_img"),
} as const;

// Generate cache key for borrower list with params
export function getBorrowersCacheKey(params: { cityId?: number; search?: string; page?: number; limit?: number }): string {
  return createKey(KEY_PREFIXES.MEDIUM, `borrowers_${params.cityId || 0}_${params.search || ""}_${params.page || 1}_${params.limit || 50}`);
}

// Generate cache key for borrower details
export function getBorrowerCacheKey(id: string): string {
  return createKey(KEY_PREFIXES.MEDIUM, `borrower_${id}`);
}
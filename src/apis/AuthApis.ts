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

export interface LoginResponse {
  token: string;
  admin?: {
    email: string;
    name: string;
    role: string;
  };
  user?: {
    id?: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export interface MeResponse {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(): Promise<MeResponse> {
  const response = await request<MeResponse | { user: MeResponse }>("/auth/me");
  return "user" in response ? response.user : response;
}

export function logout() {
  localStorage.removeItem("trufin_token");
}

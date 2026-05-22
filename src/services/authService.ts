import api from "./api";

function unwrap<T>(res: { data: T }): T {
  return res.data;
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

export function login(email: string, password: string): Promise<LoginResponse> {
  return api.post<LoginResponse>("/api/auth/login", { email, password }).then(unwrap);
}

export function getMe(): Promise<MeResponse> {
  return api.get<MeResponse | { user: MeResponse }>("/api/auth/me").then((res) => {
    const data = res.data;
    return "user" in data ? data.user : (data as MeResponse);
  });
}

export function logout() {
  localStorage.removeItem("trufin_token");
}

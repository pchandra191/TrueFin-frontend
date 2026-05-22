import api from "./api";

function unwrap(res) {
  return res.data;
}

export const loginUser = (email, password) =>
  api.post("/api/auth/login", { email, password }).then(unwrap);

export const getCurrentUser = () =>
  api.get("/api/auth/me").then(unwrap);

export const login = loginUser

export const getMe = getCurrentUser

export function logout() {
  localStorage.removeItem("trufin_token");
}

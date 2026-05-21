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

export interface Installment {
  month: string;
  amount: number;
  status: string;
}

export interface Borrower {
  _id: string;
  uniqueId: string;
  cityId: number;
  borrowerId: number;
  name: string;
  phoneNumber?: string;
  connectorName: string;
  IPM: number[];
  lastLeft: string;
  installmentCondition: string;
  installmentStartMonth: string;
  installments: Installment[];
  createdAt: string;
  updatedAt: string;
}

export interface BorrowersResponse {
  borrowers: Borrower[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getBorrowers(params: {
  cityId: number;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<BorrowersResponse> {
  const query = new URLSearchParams();
  query.set("cityId", String(params.cityId));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  return request<BorrowersResponse>(`/borrowers?${query.toString()}`);
}

export async function getBorrowerById(id: string): Promise<Borrower> {
  return request<Borrower>(`/borrowers/${id}`);
}

export async function createBorrower(
  data: Partial<Borrower>
): Promise<Borrower | { message: string; uniqueId: string }> {
  return request<Borrower | { message: string; uniqueId: string }>("/borrowers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBorrower(id: string, data: Partial<Borrower>): Promise<Borrower> {
  return request<Borrower>(`/borrowers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBorrower(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/borrowers/${id}`, { method: "DELETE" });
}

export async function recordPayment(
  id: string,
  data: { month: string; amount: number; status?: string }
): Promise<Borrower> {
  return request<Borrower>(`/borrowers/${id}/installments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

import type {
  AuthSession,
  Product,
  ProductListResult,
} from "../types/product";
import { clearSession, getSession } from "./auth";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ data: T; headers: Headers }> {
  const session = getSession();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(path, { ...init, headers });

  if (response.status === 401) clearSession();
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new ApiError(
      payload?.message ?? "The request could not be completed.",
      response.status,
    );
  }

  if (response.status === 204) {
    return { data: undefined as T, headers: response.headers };
  }

  return {
    data: (await response.json()) as T,
    headers: response.headers,
  };
}

export async function login(username: string, password: string) {
  const { data } = await apiRequest<AuthSession>("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return data;
}

export async function logout() {
  await apiRequest<void>("/api/logout", { method: "POST" });
}

export async function fetchProducts(
  params: URLSearchParams,
): Promise<ProductListResult> {
  const { data, headers } = await apiRequest<Product[]>(
    `/api/product?${params.toString()}`,
  );
  const total = Number(
    headers.get("x-filtered-count") ??
      headers.get("x-total-count") ??
      data.length,
  );
  return { items: data, total };
}

export async function fetchProduct(id: string) {
  const { data } = await apiRequest<Product>(`/api/product/${id}`);
  return data;
}

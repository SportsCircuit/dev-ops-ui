import type { Tool, Microservice, PortalUser } from "@/types";

const BASE_URL = "";
const TOKEN_KEY = "devportal_token";
const USER_KEY = "devportal_auth";

function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Token expired / invalid — clear auth and notify React context
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth:expired"));
    throw new Error("Session expired. Please sign in again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    let message = body.error || `HTTP ${res.status}`;
    if (body.details) {
      const fieldErrors = body.details.fieldErrors;
      if (fieldErrors && typeof fieldErrors === "object") {
        const msgs = Object.entries(fieldErrors)
          .filter(([, v]) => Array.isArray(v) && v.length)
          .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`);
        if (msgs.length) message += " — " + msgs.join("; ");
      }
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────

export async function login(
  email: string,
  password: string,
): Promise<{
  token: string;
  user: { id: string; name: string; role: string; email: string };
}> {
  // Don't use fetchJson — there's no token yet
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Categories ──────────────────────────────────────────

export interface CategoryRow {
  id: string;
  name: string;
  sortOrder: number;
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  return fetchJson<CategoryRow[]>("/api/categories");
}

export async function createCategory(
  data: Pick<CategoryRow, "name" | "sortOrder">
): Promise<CategoryRow> {
  return fetchJson<CategoryRow>("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: string,
  data: Pick<CategoryRow, "name" | "sortOrder">
): Promise<CategoryRow> {
  return fetchJson<CategoryRow>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  return fetchJson<void>(`/api/categories/${id}`, { method: "DELETE" });
}

// ─── Tools ───────────────────────────────────────────────

export async function fetchTools(): Promise<Tool[]> {
  return fetchJson<Tool[]>("/api/tools");
}

export async function fetchTool(id: string): Promise<Tool> {
  return fetchJson<Tool>(`/api/tools/${id}`);
}

export async function createTool(
  data: Omit<Tool, "id">
): Promise<Tool> {
  return fetchJson<Tool>("/api/tools", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTool(
  id: string,
  data: Partial<Tool>
): Promise<Tool> {
  return fetchJson<Tool>(`/api/tools/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTool(id: string): Promise<void> {
  return fetchJson<void>(`/api/tools/${id}`, { method: "DELETE" });
}

// ─── Microservices ───────────────────────────────────────

export async function fetchMicroservices(): Promise<Microservice[]> {
  return fetchJson<Microservice[]>("/api/microservices");
}

export async function fetchMicroservice(id: string): Promise<Microservice> {
  return fetchJson<Microservice>(`/api/microservices/${id}`);
}

export async function createMicroservice(
  data: Omit<Microservice, "id">
): Promise<Microservice> {
  return fetchJson<Microservice>("/api/microservices", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMicroservice(
  id: string,
  data: Partial<Microservice>
): Promise<Microservice> {
  return fetchJson<Microservice>(`/api/microservices/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMicroservice(id: string): Promise<void> {
  return fetchJson<void>(`/api/microservices/${id}`, { method: "DELETE" });
}

// ─── Users ───────────────────────────────────────────────

export async function fetchUsers(): Promise<PortalUser[]> {
  return fetchJson<PortalUser[]>("/api/users");
}

export async function fetchUser(id: string): Promise<PortalUser> {
  return fetchJson<PortalUser>(`/api/users/${id}`);
}

export async function createUser(
  data: Omit<PortalUser, "id">
): Promise<PortalUser> {
  return fetchJson<PortalUser>("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: string,
  data: Partial<PortalUser>
): Promise<PortalUser> {
  return fetchJson<PortalUser>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: string): Promise<void> {
  return fetchJson<void>(`/api/users/${id}`, { method: "DELETE" });
}

// ─── Seed ────────────────────────────────────────────────

export async function seedDatabase(): Promise<{
  message: string;
  counts: Record<string, number>;
}> {
  return fetchJson("/api/seed", { method: "POST" });
}

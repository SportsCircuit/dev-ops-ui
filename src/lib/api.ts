import type { Tool, Microservice, PortalUser } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Categories ──────────────────────────────────────────

export interface CategoryRow {
  id: string;
  name: string;
  sortOrder: string;
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

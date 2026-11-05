import { z } from "zod";
import type { paths } from "./types";
import { useAuthStore } from "./auth-store";
import { useAppStore } from "@/lib/store";

const ApiErrorSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  detail: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  details: z.unknown().optional(),
}).passthrough();

export interface NormalizedApiError extends Error {
  code: string;
  details?: unknown;
  status: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export type ApiPath = keyof paths;
export type ApiEndpoint = ApiPath | `${ApiPath}?${string}`;

export async function apiRequest<T>(path: ApiEndpoint, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept-Language", useAppStore.getState().lang);
  const token = useAuthStore.getState().accessToken;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(init.body instanceof FormData) && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (response.status === 401) {
    useAuthStore.getState().clearSession();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }
  const text = await response.text();
  let payload: unknown;
  try {
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    const parsed = ApiErrorSchema.safeParse(payload);
    const detail = parsed.success ? parsed.data.detail : undefined;
    const message = parsed.success
      ? parsed.data.message ?? (typeof detail === "string" ? detail : undefined) ?? `Request failed (${response.status})`
      : `Request failed (${response.status})`;
    const error = new Error(message) as NormalizedApiError;
    error.code = parsed.success ? parsed.data.code ?? `HTTP_${response.status}` : `HTTP_${response.status}`;
    error.details = parsed.success ? parsed.data.details : undefined;
    error.status = response.status;
    throw error;
  }
  return payload as T;
}

export function apiJson(method: "POST" | "PUT" | "PATCH", body: unknown): RequestInit {
  return { method, body: JSON.stringify(body) };
}

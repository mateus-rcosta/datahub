import { ApiError } from "./api-error";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
    path: string;
    method?: HttpMethod;
    body?: unknown;
    token?: string;
    credentials?: RequestCredentials;
    query?: Record<string, string | number | boolean | undefined | null>;
    extraHeaders?: Record<string, string>;
    expectEmptyResponse?: boolean;
}

/**
 * apiRequest - wrapper genérico para fetch
 * - Sempre retorna ApiSuccesso<T> | ApiFalha
 * - Não lança para erros HTTP (4xx/5xx) — retorna ApiFalha
 * - Lança somente em casos extremos de rede (opcionalmente capturáveis)
 */
export async function apiRequest<T = unknown>(opts: ApiRequestOptions): Promise<T> {
  const {
    path,
    method = "GET",
    token,
    credentials = "same-origin",
    query,
    extraHeaders,
    expectEmptyResponse = false,
  } = opts;
  let body = opts.body;
  let url = path;
  if (query) {
    const qs = Object.entries(query)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&");
    if (qs) url += (url.includes("?") ? "&" : "?") + qs;
  }

  const headers: Record<string, string> = { ...extraHeaders };

  if (body !== undefined && body !== null) {
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(body);
    }
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body as BodyInit | undefined,
    credentials,
  });

  let parsed;
  try {
    parsed = await res.json();
  } catch {}

  if (res.ok) {
    if (expectEmptyResponse) {
      return undefined as unknown as T;
    }
    return parsed as T;
  }

  throw new ApiError(parsed?.mensagem ?? `HTTP error ${res.status}`, res.status, parsed?.code_error ?? null, parsed);
}
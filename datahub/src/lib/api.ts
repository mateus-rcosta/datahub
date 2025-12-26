import { ApiFalha, ApiSuccesso } from "@/types/types";

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
export async function apiRequest<T = unknown>(opts: ApiRequestOptions): Promise<ApiSuccesso<T> | ApiFalha> {
    const {
        path,
        method = 'GET',
        body,
        token,
        credentials = 'same-origin',
        query,
        extraHeaders,
        expectEmptyResponse = false,
    } = opts;

    let url = path;
    if (query) {
        const qs = Object.entries(query)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&');
        if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }

    const headers: Record<string, string> = {
        ...extraHeaders,
    };

    let bodyToSend: BodyInit | undefined;
    if (body !== undefined && body !== null) {
        if (body instanceof FormData) {
            bodyToSend = body;
        } else {
            headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
            bodyToSend = typeof body === 'string' ? body : JSON.stringify(body);
        }
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const res = await fetch(url, {
            method,
            headers,
            body: bodyToSend,
            credentials,
        });

        const parsed = await res.json().catch(() => null);

        if (res.ok) {
            if (expectEmptyResponse) {
                return { sucesso: true, dados: undefined as unknown as T };
            }

            return { sucesso: true, dados: parsed as T };
        }

        return {
            sucesso: false,
            code: parsed?.code ?? `HTTP_${res.status}`,
            mensagem: parsed?.mensagem ?? `HTTP error ${res.status}`,
            validacao: parsed?.validacao,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                sucesso: false,
                code: 'NETWORK_ERROR',
                mensagem: error?.message ?? 'Network error',
            };
        }
        return {
            sucesso: false,
            code: 'ERROR',
            mensagem: 'error',
        };
    }
}

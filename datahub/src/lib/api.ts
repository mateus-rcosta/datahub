import { ApiFalha, ApiSuccesso } from "@/types/Api";

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

    // serializar query se houver
    let url = path;
    if (query) {
        const qs = Object.entries(query)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&');
        if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }

    const headers: Record<string, string> = {
        // quando tiver body JSON definimos o header abaixo
        ...extraHeaders,
    };

    let bodyToSend: BodyInit | undefined;
    if (body !== undefined && body !== null) {
        // JSON por padrão
        headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
        bodyToSend = typeof body === 'string' ? body : JSON.stringify(body);
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

        // tentativa segura de parse do JSON (pode falhar em respostas vazias)
        const parsed = await res.json().catch(() => null);

        if (res.ok) {
            // quando esperado conteúdo vazio (204) retornamos data = undefined
            if (expectEmptyResponse) {
                return { success: true, data: undefined as unknown as T };
            }

            // se o backend já tem formato { data: ..., ... } devolvemos o parsed tal qual,
            // mas vamos tipar como T — o consumidor deve conhecer o shape.
            return { success: true, data: parsed as T };
        }

        // status não ok -> mapear body para ApiFalha se possível
        return {
            success: false,
            code: parsed?.code ?? `HTTP_${res.status}`,
            message: parsed?.message ?? `HTTP error ${res.status}`,
            validacao: parsed?.validacao,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                success: false,
                code: 'NETWORK_ERROR',
                message: error?.message ?? 'Network error',
            };
        }
        return {
            success: false,
            code: 'ERROR',
            message: 'error',
        };
    }
}

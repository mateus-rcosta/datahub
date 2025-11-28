import { RetornarUsuarios, Usuario } from "../type/types";

export function retornaUsuariosQueryOptions({ pesquisa, page, limit }: RetornarUsuarios) {
    const isServer = typeof window === "undefined";

    const url = isServer
        ? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/usuarios?pesquisa=${encodeURIComponent(pesquisa)}&page=${page}&limit=${limit}`
        : `/api/usuarios?pesquisa=${encodeURIComponent(pesquisa)}&page=${page}&limit=${limit}`;

    return {
        queryKey: ["usuarios", pesquisa, page, limit],
        queryFn: async () => {
            console.log("[queryFn] buscando usuarios page:", page, "limit:", limit, "pesquisa:", pesquisa);
            const res = await fetch(url, {
                headers: {
                    "x-requested-by": isServer ? "nextjs-server" : "nextjs-client",
                    "accept": "application/json",
                },
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Erro ao buscar usuários: ${res.status} ${text}`);
            }
            return res.json() as Promise<ApiPagination<Usuario>>;
        },
        keepPreviousData: true,
        refetchOnWindowFocus: true,
        staleTime: 5_000,
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: false,
    };
}

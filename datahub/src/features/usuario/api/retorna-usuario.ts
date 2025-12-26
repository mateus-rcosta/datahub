import { apiRequest } from "@/lib/api";
import { ApiPagination, Usuario, ApiSuccesso, ApiFalha, PageParams } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const retornaUsuarios = async (pesquisa: string, page: number, limit: number) => {
    return apiRequest<ApiPagination<Usuario>>({
        path: `/api/usuarios`,
        query: { pesquisa, page, limit },
        extraHeaders: { "x-requested-by": "nextjs-client" },
        method: "GET",
        credentials: "same-origin",
    });
};

export function useRetornaUsuarios({ pesquisa, page, limit }: PageParams) {
    const query = useQuery<ApiSuccesso<ApiPagination<Usuario>> | ApiFalha>({
        queryKey: ['usuarios', pesquisa, page, limit],
        queryFn: () => retornaUsuarios(pesquisa, page, limit),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000 * 5,
        refetchInterval: 60 * 1000 * 5,
        refetchIntervalInBackground: false,
    });
    
    return {
        isFetching: query.isFetching,
        isLoading: query.isLoading,
        data: query.data,
        error: query.error,
    }
}
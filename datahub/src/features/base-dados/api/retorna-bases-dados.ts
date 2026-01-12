import { apiRequest } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { ApiPagination, PageParams, BaseDados } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const retornaBasesDadosApi = async ({ pesquisa, page, limit }: PageParams) => {
    return apiRequest<ApiPagination<BaseDados>>({
        path: `/api/base-dados`,
        query: { pesquisa, page, limit },
        extraHeaders: { "x-requested-by": "nextjs-client" },
        method: "GET",
        credentials: "same-origin",
    });
};

export function useRetornaBasesDados({ pesquisa, page, limit }: PageParams, {enabled}: {enabled: boolean}) {
    const query = useQuery<ApiPagination<BaseDados>, ApiError>({
        queryKey: ['baseDados', pesquisa, page, limit],
        queryFn: () => retornaBasesDadosApi({pesquisa, page, limit}),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000 * 5,
        refetchInterval: 60 * 1000 * 5,
        refetchIntervalInBackground: false,
        enabled 
    });
    
    return {
        isFetching: query.isFetching,
        isLoading: query.isLoading,
        data: query.data,
        error: query.error,
        isError: query.isError
    }
}
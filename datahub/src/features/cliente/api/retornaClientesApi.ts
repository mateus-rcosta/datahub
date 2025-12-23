import { apiRequest } from "@/lib/api";
import { ApiPagination, Cliente, ApiSuccesso, ApiFalha, PageParams } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const retornaClientesApi = async (pesquisa: string, page: number, limit: number, campoPesquisa: string, id: string) => {
    return apiRequest<ApiPagination<Cliente>>({
        path: `/api/cliente/${id}`,
        query: { pesquisa, page, limit, campoPesquisa },
        extraHeaders: { "x-requested-by": "nextjs-client" },
        method: "GET",
        credentials: "same-origin",
    });
};

export function useRetornaClientesApi({ pesquisa, page, limit, campoPesquisa }: PageParams, id: string) {
    const query = useQuery<ApiSuccesso<ApiPagination<Cliente>> | ApiFalha>({
        queryKey: ['clientes', pesquisa, page, limit, id],
        queryFn: () => retornaClientesApi(pesquisa, page, limit, campoPesquisa ? campoPesquisa : "",  id),
        placeholderData: (previousData) => previousData,
    });
    
    return {
        isFetching: query.isFetching,
        isLoading: query.isLoading,
        dados: query.data,
        error: query.error,
    }
}
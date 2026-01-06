import { apiRequest } from "@/lib/api";
import { ApiSuccesso, ApiFalha, Integracao, IntegracaoDados } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const retornaIntegracaoApi = async (id:number) => {
    return apiRequest<Integracao<IntegracaoDados>>({
        path: `/api/integracoes/${id}`,
        extraHeaders: { "x-requested-by": "nextjs-client" },
        method: "GET",
        credentials: "same-origin",
    });
};

export function useRetornaIntegracao(id:number) {
    const query = useQuery<ApiSuccesso<Integracao<IntegracaoDados>> | ApiFalha>({
        queryKey: ['integracoes', id],
        queryFn: () => retornaIntegracaoApi(id),
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
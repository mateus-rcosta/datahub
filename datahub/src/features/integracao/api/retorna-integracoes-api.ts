import { apiRequest } from "@/lib/api";
import { ApiSuccesso, ApiFalha, Integracao, IntegracaoDados } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const retornaIntegracoesApi = async () => {
    return apiRequest<Integracao<IntegracaoDados>[]>({
        path: `/api/integracoes`,
        extraHeaders: { "x-requested-by": "nextjs-client" },
        method: "GET",
        credentials: "same-origin",
    });
};

export function useRetornaIntegracoes() {
    const query = useQuery<ApiSuccesso<Integracao<IntegracaoDados>[]> | ApiFalha>({
        queryKey: ['integracoes'],
        queryFn: () => retornaIntegracoesApi(),
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
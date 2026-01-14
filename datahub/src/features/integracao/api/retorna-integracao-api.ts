import { apiRequest } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { Integracao, IntegracaoDados } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const retornaIntegracaoApi = async (nome:string) => {
    return apiRequest<Integracao<IntegracaoDados>>({
        path: `/api/integracoes/${nome}`,
        extraHeaders: { "x-requested-by": "nextjs-client" },
        method: "GET",
        credentials: "same-origin",
    });
};

export function useRetornaIntegracao(nome: string, enabled = true) {
  const query = useQuery<Integracao<IntegracaoDados>, ApiError>({
    queryKey: ["integracoes", nome],
    queryFn: () => retornaIntegracaoApi(nome),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    data: query.data,
    error: query.error,
    isError: query.isError,
  };
}
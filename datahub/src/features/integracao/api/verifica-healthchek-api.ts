import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api";
import { ApiFalha, ApiSuccesso, HealthchekResponse, Integracao, IntegracaoDados } from "@/types/types";


const verificaHealthcheck = async (id: number) => {
    return apiRequest<HealthchekResponse>({
        path: `/api/integracoes/${id}/healthcheck`,
        method: 'PATCH',
        credentials: 'same-origin',
        extraHeaders: { "x-requested-by": "nextjs-client" },
        expectEmptyResponse: false,
    });
};
export const useVerificaHealthcheck = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ApiSuccesso<HealthchekResponse> | ApiFalha, unknown, number,
        { previousIntegracoes?: ApiSuccesso<Integracao<IntegracaoDados>[]> }
    >({
        mutationFn: (id) => verificaHealthcheck(id),

        onError: (_err, _id, context) => {
            if (context?.previousIntegracoes) {
                queryClient.setQueryData(['integracoes'], context.previousIntegracoes);
            }
        },

        onSuccess: (result, id) => {
            if (!result.sucesso) return;

            queryClient.setQueryData<ApiSuccesso<Integracao<IntegracaoDados>[]>>(['integracoes'], (old) => {
                    if (!old?.sucesso) return old;

                    return {
                        ...old,
                        dados: old.dados.map((integracao) =>
                            integracao.id === id
                                ? {
                                    ...integracao,
                                    status: result.dados.status === 'healthy' ? true : false,
                                }
                                : integracao
                        ),
                    };
                }
            );
        },
    });

    return {
        verificaHealthcheck: mutation.mutateAsync,
    };
};

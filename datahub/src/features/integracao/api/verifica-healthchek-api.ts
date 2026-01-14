import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import {  HealthchekResultado, Integracao, IntegracaoDados } from "@/types/types";

const verificaHealthcheck = async (nome: string) => {
    return apiRequest<HealthchekResultado>({
        path: `/api/integracoes/${nome}/healthcheck`,
        method: "PATCH",
        credentials: "same-origin",
        extraHeaders: { "x-requested-by": "nextjs-client" },
    });
};

export const useVerificaHealthcheck = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation< HealthchekResultado, ApiError, string, { previousIntegracoes?: Integracao<IntegracaoDados>[] }>({
        mutationFn: verificaHealthcheck,

        // optimistic update
        onMutate: async (nome) => {
            await queryClient.cancelQueries({ queryKey: ["integracoes"] });

            const previousIntegracoes =
                queryClient.getQueryData<Integracao<IntegracaoDados>[]>(["integracoes"]);

            if (previousIntegracoes) {
                queryClient.setQueryData<Integracao<IntegracaoDados>[]>(["integracoes"], (old) =>
                    old?.map((integracao) =>
                        integracao.nome === nome
                            ? { ...integracao, status: integracao.status}
                            : integracao
                    )
                );
            }

            return { previousIntegracoes };
        },

        onError: (_error, _id, context) => {
            if (context?.previousIntegracoes) {
                queryClient.setQueryData(["integracoes"], context.previousIntegracoes);
            }
        },

        onSuccess: (result, nome) => {
            queryClient.setQueryData<Integracao<IntegracaoDados>[]>(
                ["integracoes"],
                (old) =>
                    old?.map((integracao) =>
                        integracao.nome === nome
                            ? {
                                ...integracao,
                                status: result.status === "healthy",
                            }
                            : integracao
                    )
            );
        },
    });

    return {
        verificaHealthcheck: mutation.mutateAsync,
        isLoading: mutation.isPending,
    };
};

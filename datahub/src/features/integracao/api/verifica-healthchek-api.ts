import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { HealthchekResponse, Integracao, IntegracaoDados } from "@/types/types";

const verificaHealthcheck = async (id: number) => {
    return apiRequest<HealthchekResponse>({
        path: `/api/integracoes/${id}/healthcheck`,
        method: "PATCH",
        credentials: "same-origin",
        extraHeaders: { "x-requested-by": "nextjs-client" },
    });
};

export const useVerificaHealthcheck = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation< HealthchekResponse, ApiError, number, { previousIntegracoes?: Integracao<IntegracaoDados>[] }>({
        mutationFn: verificaHealthcheck,

        // optimistic update
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["integracoes"] });

            const previousIntegracoes =
                queryClient.getQueryData<Integracao<IntegracaoDados>[]>(["integracoes"]);

            if (previousIntegracoes) {
                queryClient.setQueryData<Integracao<IntegracaoDados>[]>(["integracoes"], (old) =>
                    old?.map((integracao) =>
                        integracao.id === id
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

        onSuccess: (result, id) => {
            queryClient.setQueryData<Integracao<IntegracaoDados>[]>(
                ["integracoes"],
                (old) =>
                    old?.map((integracao) =>
                        integracao.id === id
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
        error: mutation.error
    };
};

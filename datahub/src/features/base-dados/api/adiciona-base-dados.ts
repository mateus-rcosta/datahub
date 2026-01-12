import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api";
import { ApiError } from "@/lib/api-error";

const adicionaBaseDados = async (payload: FormData) => {
    return apiRequest<null>({
        path: `/api/base-dados`,
        method: 'POST',
        body: payload,
        credentials: 'same-origin',
        expectEmptyResponse: true,
    });
};
export const useAdicionaBaseDados = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<null, ApiError, FormData>({
        mutationFn: adicionaBaseDados,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["baseDados"] });
        },
    });

    return {
        adicionaBaseDados: mutation.mutateAsync,
        isPending: mutation.isPending,
        data: mutation.data,
    };
};
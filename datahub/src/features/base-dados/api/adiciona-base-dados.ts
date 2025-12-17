import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api";
import { ApiFalha, ApiSuccesso } from "@/types/types";


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

    const mutation = useMutation<
        ApiSuccesso<null> | ApiFalha,
        unknown,
        FormData
    >({
        mutationFn: (formData) => adicionaBaseDados(formData),
        onSuccess: (result) => {
            if (result.sucesso) {
                queryClient.invalidateQueries({ queryKey: ['baseDados'] });
            }
        },
    });

    return {
        adicionaBaseDados: mutation.mutateAsync,
        isPending: mutation.isPending,
        status: mutation.status,
        reactQueryError: mutation.error,
    };
};
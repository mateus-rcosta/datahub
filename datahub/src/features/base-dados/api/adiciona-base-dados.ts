import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api";
import { ApiFalha, ApiSuccesso } from "@/types/types";
import { toast } from "sonner";


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

    const mutation = useMutation<ApiSuccesso<null> | ApiFalha, unknown, FormData>({
        mutationFn: (formData) => adicionaBaseDados(formData),
        onSuccess: (result) => {
            if (result.sucesso) {
                queryClient.invalidateQueries({ queryKey: ['baseDados'] });
            }
            
            if (!result.sucesso) {
                console.log("result", result);
                if(result.code_error === "CSV_SEM_COLUNAS_OBRIGATORIAS"){
                    toast.error('Erro ao criar a base de dados: '+ 'CSV sem colunas obrigatórias para validação.');
                }

                if(result.code_error === "CSV_INVALIDO"){
                    toast.error('Erro ao criar a base de dados: '+ 'Arquivo CSV inválido.');
                }
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
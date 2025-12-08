import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api";
import { ApiFalha, ApiSuccesso } from "@/types/types";
import { AtualizarUsuarioInput } from "../action/atualizarUsuario";


const updateUsuario = async (data: AtualizarUsuarioInput) => {
  return apiRequest<null>({
    path: `/api/usuarios/${data.id}`,
    method: 'POST',
    body: data,
    credentials: 'same-origin', 
    expectEmptyResponse: true, 
  });
};
export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ApiSuccesso<null> | ApiFalha, unknown, AtualizarUsuarioInput>({
    mutationFn: (data) => updateUsuario(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      }
    },
  });

  return {
    updateUsuario: mutation.mutateAsync,
    isPending: mutation.isPending,
    status: mutation.status,
    reactQueryError: mutation.error,
  };
};
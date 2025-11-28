import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CriarUsuarioInput } from "../type/types";
import { apiRequest } from "@/lib/api";
import { ApiFalha, ApiSuccesso } from "@/types/Api";


const createUsuario = async (data: CriarUsuarioInput) => {
  return apiRequest<null>({
    path: '/api/usuarios',
    method: 'POST',
    body: data,
    credentials: 'same-origin', 
    expectEmptyResponse: true, 
  });
};
export const useCreateUsuario = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ApiSuccesso<null> | ApiFalha, unknown, CriarUsuarioInput>({
    mutationFn: (data) => createUsuario(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      }
    },
  });

  return {
    createUsuario: mutation.mutateAsync,
    isPending: mutation.isPending,
    status: mutation.status,
    reactQueryError: mutation.error,
  };
};
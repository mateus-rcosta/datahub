import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api";
import { ApiFalha, ApiSuccesso } from "@/types/types";


const deleteUsuario = async (id: number) => {
  return apiRequest<null>({
    path: `/api/usuarios/${id}`,
    method: 'DELETE',
    credentials: 'same-origin', 
    expectEmptyResponse: true, 
  });
};
export const usedeleteUsuario = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ApiSuccesso<null> | ApiFalha, unknown, number>({
    mutationFn: (id) => deleteUsuario(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      }
    },
  });

  return {
    deleteUsuario: mutation.mutateAsync,
    isPending: mutation.isPending,
    status: mutation.status,
    reactQueryError: mutation.error,
  };
};

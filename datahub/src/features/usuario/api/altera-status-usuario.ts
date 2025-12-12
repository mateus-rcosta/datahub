// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { apiRequest } from "@/lib/api";
// import { ApiFalha, ApiSuccesso } from "@/types/types";


// const alteraStatusUsuario = async (id: string) => {
//   return apiRequest<null>({
//     path: `/api/usuarios/${id}/status`,
//     method: 'POST',
//     credentials: 'same-origin', 
//     expectEmptyResponse: true, 
//   });
// };
// export const useAlteraStatusUsuario = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation<ApiSuccesso<null> | ApiFalha, unknown, string>({
//     mutationFn: (id) => alteraStatusUsuario(id),
//     onSuccess: (result) => {
//       if (result.success) {
//         queryClient.invalidateQueries({ queryKey: ['usuarios'] });
//       }
//     },
//   });

//   return {
//     alteraStatusUsuario: mutation.mutateAsync,
//     isPending: mutation.isPending,
//     status: mutation.status,
//     reactQueryError: mutation.error,
//   };
// };
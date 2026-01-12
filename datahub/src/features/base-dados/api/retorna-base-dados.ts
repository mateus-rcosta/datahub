import { apiRequest } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { BaseDados } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const retornaBaseDadosApi = async ({ id }: {id: string}) => {
    return apiRequest<BaseDados>({
        path: `/api/base-dados/${id}`,
        extraHeaders: { "x-requested-by": "nextjs-client" },
        method: "GET",
        credentials: "same-origin",
    });
};

export function useRetornaBaseDados({ id }: {id: string}, options?: { enabled?: boolean }) {
    const query = useQuery<BaseDados, ApiError>({
        queryKey: ['baseDados', id],
        queryFn: () => retornaBaseDadosApi({id}),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: true,
        staleTime: 60 * 1000 * 5,
        refetchInterval: 60 * 1000 * 5,
        refetchIntervalInBackground: false,
        enabled: options?.enabled
    });
    
    return {
        isFetching: query.isFetching,
        isLoading: query.isLoading,
        data: query.data,
        error: query.error,
        isError: query.isError
    }
}
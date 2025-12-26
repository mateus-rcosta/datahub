"use client";
import { getQueryClient } from "@/lib/react-query";
import { SessaoErrorType } from "@/lib/sessao-error";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type QueryKeyValue = string | number | boolean | null | undefined;
type QueryKey = QueryKeyValue[];

export function useAcaoAutenticada<TData>(
  action: any,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: {
      serverError?: unknown;
      validationErrors?: unknown;
    } & {
      thrownError?: Error | undefined;
    }) => void;
    invalidateQueries?: QueryKey[];
  }
) {
  const router = useRouter();
  const queryClient = getQueryClient();

  return useAction(action, {
    onSuccess: ({ data }: { data: TData }) => {
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: ({ error }) => {
      if (error.serverError === SessaoErrorType.USUARIO_NAO_LOGADO) {
        toast.warning("Sua sessão expirou. Redirecionando para login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
        return;
      }
      options?.onError?.(error);
    },
  });
}
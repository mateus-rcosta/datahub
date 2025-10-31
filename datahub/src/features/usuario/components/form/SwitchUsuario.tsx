"use client";

import React from "react";
import { Switch } from "@/components/ui/switch"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import mudarStatusUsuario from "@/features/usuario/action/mudarStatusUsuario";
import { toast } from "sonner";
import { retornaUsuariosQueryOptions } from "../../service/queryOptions";

type Props = {
    id: number;
    ativo: boolean;
    pesquisa?: string;
    page?: number;
    limit?: number;
};

export default function SwitchUsuario({ id, ativo, pesquisa = "", page = 1, limit = 10 }: Props) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => mudarStatusUsuario(id),

        onError: (err: unknown, id: number) => {
            toast.error(
                err instanceof Error
                    ? err.message
                    : `Erro ao mudar status de acesso do usuário com id: ${id}.`
            );
            queryClient.invalidateQueries({ queryKey: retornaUsuariosQueryOptions({ pesquisa, page, limit }).queryKey });
        },

        onSuccess: (_, id: number) => {
            toast.success(`Status alterado com sucesso do usuário com id: ${id}.`);
            queryClient.invalidateQueries({ queryKey: retornaUsuariosQueryOptions({ pesquisa, page, limit }).queryKey });
        },
    });
    
    return (
        <Switch
            checked={ativo}
            onCheckedChange={() => {
                // chama a mutação; a mutação faz o toggle no servidor
                mutation.mutate(id);
            }}
            className="max-w-8 data-[state=unchecked]:bg-black"
        />
    );
}

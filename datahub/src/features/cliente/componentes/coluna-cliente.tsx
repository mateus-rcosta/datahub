"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import CardEditaCliente from "./card-edita-cliente";
import { Cliente, PageParams } from "@/types/types";
import CardExcluiCliente from "./card-exclui-cliente";

interface ConstroiColunasParams {
    chavesDisponiveis: string[];
    colunasVisiveis: string[];
    pageParams: PageParams;
}

export function constroiClienteColunas({
    chavesDisponiveis,
    colunasVisiveis,
    pageParams,
}: ConstroiColunasParams): ColumnDef<Cliente>[] {

    const colunasDinamicas: ColumnDef<Cliente>[] = chavesDisponiveis
        .filter(chave => colunasVisiveis.includes(chave))
        .map(chave => ({
            accessorKey: `dados.${chave}`,
            header: () => (
                <span className="font-semibold capitalize">
                    {chave.replaceAll("_", " ")}
                </span>
            ),
            cell: ({ getValue }) => {
                const valor = getValue();

                if (valor == null) {
                    return <span className="text-muted-foreground">—</span>;
                }

                return <span>{String(valor)}</span>;
            },
        }));

    const colunaAcoes: ColumnDef<Cliente> = {
        id: "acoes",
        enableSorting: false,
        enableHiding: false,
        header: () => (
            <span className="font-semibold">Ações</span>
        ),
        cell: ({ row }) => (
            <div className="flex gap-2">
                <CardEditaCliente id={row.original.id} baseDeDadosId={row.original.baseDeDadosId} dados={row.original.dados as Record<string, string>} updatedAt={row.original.updatedAt as string} createdAt={row.original.createdAt as string} pageParams={pageParams} />
                <CardExcluiCliente id={row.original.id} baseDeDadosId={row.original.baseDeDadosId} pageParams={pageParams} />
            </div>
        ),
    };

    return [...colunasDinamicas, colunaAcoes];
}

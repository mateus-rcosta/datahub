"use client";

import { useEffect, useState } from "react";
import { Tabela } from "@/components/layout/table/tabela";
import { Spinner } from "@/components/ui/spinner";
import { useRetornaClientesApi } from "../api/retornaClientesApi";
import { constroiClienteColunas } from "./coluna-cliente";
import { InputPesquisa } from "@/components/layout/form/input-pesquisa";
import SeletorColunas from "@/components/layout/seletor-colunas";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";

interface TabelaClientesProps {
    baseDadosId: string;
    estrutura?: string[];
}

export default function TabelaClientes({ baseDadosId, estrutura = [] }: TabelaClientesProps) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pesquisa, setPesquisa] = useState("");
    const [campoPesquisa, setCampoPesquisa] = useState("");
    const [colunasVisiveis, setColunasVisiveis] = useState<string[]>([ "telefone", "email", "whatsapp",]);
    const [pesquisaDebounced] = useDebounce(pesquisa, 500);

    useEffect(() => {
        if (estrutura.length && !campoPesquisa) {
            const campoPadrao = estrutura.find((c) => ["telefone", "email", "whatsapp", "acoes"].includes(c));
            if (campoPadrao) setCampoPesquisa(campoPadrao);
        }
    }, [estrutura, campoPesquisa]);

    useEffect(() => {
        setPage(1);
    }, [pesquisaDebounced, campoPesquisa]);

    const { dados, isLoading, isFetching, isError, error, initialData } = useRetornaClientesApi({
        pesquisa: pesquisaDebounced,
        page,
        limit,
        campoPesquisa,
    }, baseDadosId);


    if (isLoading) {
        return <Spinner className="size-8 animate-spin" />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-6 gap-2">
                <p className="text-destructive font-semibold">
                    Erro ao carregar os dados
                </p>
                {error instanceof Error && (
                    <p className="text-sm text-muted-foreground">
                        {error.message}
                    </p>
                )}
            </div>
        );
    }

    /**
     * Dados normalizados
     */
    const { dados: clientes = [], total = 0, } = dados ?? initialData;
    const pageCount = Math.ceil(total / limit);

    /**
     * Extrai chaves dinâmicas
     */
    const chavesDinamicas = Array.from(
        new Set(
            clientes.flatMap((cliente) =>
                Object.keys(cliente.dados as Record<string, unknown>)
            )
        )
    );

    /**
     * Normaliza clientes (flatten)
     */
    const dadosNormalizados = clientes.map((cliente) => ({
        id: cliente.id,
        createdAt: cliente.createdAt,
        updatedAt: cliente.updatedAt,
        baseDeDadosId: cliente.baseDeDadosId,
        dados: cliente.dados,
        validacao: cliente.validacao,
    }));

    const colunas = constroiClienteColunas({
        chavesDisponiveis: chavesDinamicas,
        colunasVisiveis,
        pageParams: { pesquisa, page, limit, campoPesquisa },
    });

    return (
        <div className="flex flex-col h-full gap-3 p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <div className="flex-1 min-w-0">
                    <InputPesquisa
                        state={pesquisa}
                        useStatePesquisa={(value) => {
                            setPesquisa(value);
                            setPage(1);
                        }}
                        total={total}
                        campoPesquisa={campoPesquisa}
                        useCampoPesquisa={setCampoPesquisa}
                        campos={estrutura}
                    />
                </div>

                <div className="shrink-0">
                    <SeletorColunas
                        colunas={estrutura}
                        colunasSelecionadas={colunasVisiveis}
                        onChange={setColunasVisiveis}
                    />
                </div>
            </div>

            {/* Tabela */}
            <div className={cn("flex-1 min-h-0 relative", isFetching && "opacity-60")}>
                <Tabela
                    columns={colunas}
                    data={dadosNormalizados}
                    page={page}
                    limit={limit}
                    pageCount={pageCount}
                    totalItems={total}
                    onPageChange={setPage}
                    onPageSizeChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                />
            </div>
        </div>
    );
}

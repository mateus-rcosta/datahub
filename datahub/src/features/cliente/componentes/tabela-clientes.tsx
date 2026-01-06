"use client";
import { useEffect, useState } from "react";
import { Tabela } from "@/components/layout/table/tabela";
import { Spinner } from "@/components/ui/spinner"
import { useRetornaClientesApi } from "../api/retornaClientesApi";
import { constroiClienteColunas } from "./coluna-cliente";
import { InputPesquisa } from "@/components/layout/form/input-pesquisa";
import SeletorColunas from "@/components/layout/seletor-colunas";
import { useDebounce } from "use-debounce";

interface TabelaClientesProps {
    baseDadosId: string;
    estrutura?: string[];
}
export default function TabelaClientes({ baseDadosId, estrutura }: TabelaClientesProps) {
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [pesquisa, setPesquisa] = useState("");
    const [campoPesquisa, setCampoPesquisa] = useState("");
    const [pesquisaDebouncing] = useDebounce(pesquisa, 500);
    const [colunasVisiveis, setColunasVisiveis] = useState<string[]>(["telefone", "email", "whatsapp"]);

    // Define o primeiro campo
    useEffect(() => {
        if (estrutura?.length && !campoPesquisa) {
            const campoPadrao = estrutura.find(c =>
                ["telefone", "email", "whatsapp", "acoes"].includes(c)
            );

            if (campoPadrao) {
                setCampoPesquisa(campoPadrao);
            }
        }
    }, [estrutura, campoPesquisa]);

    // reseta ao digitar
    useEffect(() => {
        setPage(1);
    }, [pesquisaDebouncing, campoPesquisa]);

    const { dados: res, isLoading, isFetching } = useRetornaClientesApi({
        pesquisa: pesquisaDebouncing,
        page,
        limit,
        campoPesquisa,
    }, baseDadosId);
    
    if (isLoading) {
        return (
            <Spinner className="size-8 animate-spin" />
        );
    }

    if (!res || !res.sucesso) {
        return (
            <div className="flex flex-col items-center justify-center p-6 gap-2">
                <p className="text-destructive font-semibold">Erro ao carregar os dados</p>
                {res && !res.sucesso && res.mensagem && (
                    <p className="text-sm text-muted-foreground">{res.mensagem}</p>
                )}
            </div>
        );
    }

    const paginacao = res.dados;
    const total = paginacao.total || 0;
    const pageCount = Math.ceil(total / limit);

    const rawDados = paginacao.dados || [];

    // 1. Extrai todas as chaves possíveis
    const chavesDinamicas = Array.from(
        new Set(
            rawDados.flatMap(cliente =>
                Object.keys(cliente.dados as Record<string, unknown>)
            )
        )
    );

    // 2. Normaliza os dados (flatten)
    const dadosNormalizados = rawDados.map(cliente => ({
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
            {/* Header fixo com controles */}
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <div className="flex-1 min-w-0">
                    <InputPesquisa
                        state={pesquisa}
                        useStatePesquisa={setPesquisa}
                        total={total}
                        campoPesquisa={campoPesquisa}
                        useCampoPesquisa={setCampoPesquisa}
                        campos={estrutura}
                    />
                </div>
                <div className="shrink-0">
                    <SeletorColunas
                        colunas={estrutura || []}
                        colunasSelecionadas={colunasVisiveis}
                        onChange={setColunasVisiveis}
                    />
                </div>
            </div>

            {isFetching && (
                <div className="flex">
                    <Spinner className="animate-spin" />
                </div>
            )}

            {/* Área scrollável da tabela */}
            <div className="flex-1 min-h-0 relative">
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

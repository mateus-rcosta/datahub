"use client";

import { Spinner } from "@/components/ui/spinner";
import CardIntegracao from "./card-integracao";
import { useMemo } from "react";
import { useRetornaIntegracoes } from "../api/retorna-integracoes-api";
import type { Integracao, IntegracaoDados } from "@/types/types";

const descricaoIntegracoes: Record<string, string> = {
    Upchat: "Plataforma OmniChannel e CRM",
    Wifeed: "Plataforma de Hotspots",
};

export default function Integracao() {
    const { data, isLoading, isFetching } = useRetornaIntegracoes();

    const integracoesPorNome = useMemo(() => {
        if (!data) return {};
        return data.reduce<Record<string, Integracao<IntegracaoDados>>>(
            (acc, integracao) => {
                acc[integracao.nome] = integracao;
                return acc;
            },
            {}
        );
    }, [data]);

    const conteudoRenderizado = isLoading ? (
        <Spinner className="size-8 animate-spin m-4" />
    ) : (
        Object.entries(descricaoIntegracoes).map(([nome, descricao]) => {
            const integracao = integracoesPorNome[nome];

            return (
                <CardIntegracao
                    key={nome}
                    nome={nome}
                    descricao={descricao}
                    id={integracao?.id}
                    status={integracao?.status ?? false}
                />
            );
        })
    );

    return (
        <div className="flex flex-col p-6 gap-4 items-end">
            <div
                className={`w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] ${isFetching ? "opacity-60" : ""
                    }`}
            >
                {conteudoRenderizado}
            </div>
        </div>
    );
}

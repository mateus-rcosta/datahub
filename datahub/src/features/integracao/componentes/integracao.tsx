"use client";

import { Spinner } from "@/components/ui/spinner";
import CardIntegracao from "./card-integracao";
import { useRetornaIntegracoes } from "../api/retorna-integracoes-api";
import { INTEGRACOES } from "../integracoes";


export default function Integracao() {
    const { data, isLoading, isFetching } = useRetornaIntegracoes();

    if (isLoading) {
        return <Spinner className="size-8 animate-spin m-4" />
    }
    
    if (!data) return (
        <div>
            <p className="text-destructive text-lg">Não foi possível retornar as integrações configuradas</p>
            <p className="text-muted text-md">Reporte ao administrador do sistema para validação.</p>
        </div>
    );

    const conteudoRenderizado = isLoading ? <Spinner className="size-8 animate-spin m-4" /> :
        data.map((integracao) => {
            const meta = INTEGRACOES[integracao.nome];

            return (
                <CardIntegracao
                    key={integracao.nome}
                    codigo={integracao.nome}
                    nome={meta.label}
                    descricao={meta.descricao}
                    status={integracao.status}
                    configurada={integracao.configurada}
                />
            );
        })

    return (
        <div className="flex flex-col p-6 gap-4 items-end">
            <div className={`w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] ${isFetching ? "opacity-60" : ""}`} >
                {conteudoRenderizado}
            </div>
        </div>
    );
}

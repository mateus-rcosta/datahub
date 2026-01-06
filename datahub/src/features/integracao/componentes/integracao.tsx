"use client";
import { Spinner } from "@/components/ui/spinner";
import CardIntegracao from "./card-integracao";
import type { Integracao, IntegracaoDados } from "@/types/types";
import { useRetornaIntegracoes } from "../api/retornar-integracoes-api";

const descricaoIntegracoes: Record<string, string> = {
    "Upchat": "Plataforma OmniChannel e CRM",
}
export default function Integracao() {
    const { data, isLoading, isFetching } = useRetornaIntegracoes();
    const conteudoRenderizado = isLoading ? <Spinner className="size-8 animate-spin m-4" /> :
        data && data.sucesso ?
            data.dados.map((integracao: Integracao<IntegracaoDados>) =>
                <CardIntegracao key={integracao.id} nome={integracao.nome} status={integracao.status} descricao={descricaoIntegracoes[integracao.nome]} id={integracao.id} />
            ) : 'Erro ao carregar os dados';

    return (
        <div className="flex flex-col p-6 gap-4 items-end">
            <div className={`w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] ${isFetching ? "opacity-60" : ""}`}>
                {conteudoRenderizado}
            </div>
        </div>
    );
}
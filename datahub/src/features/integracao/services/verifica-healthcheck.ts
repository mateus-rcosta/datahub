"use server";

import { prisma } from "@/lib/database";
import { IntegracaoError, IntegracaoErrorType } from "../exceptions/integracao-error";
import { IntegracaoHealthcheck } from "@/types/types";
import { INTEGRACOES } from "../integracoes";

export const verificaHealthcheck = async (nome: string) => {
    const strategy = INTEGRACOES[nome as keyof typeof INTEGRACOES];

    if (!strategy) {
        throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_NAO_ENCONTRADA, 'Integração não configurada.');
    }

    const integracao = await prisma.integracao.findFirst({
        where: { nome },
        select: {
            nome: true,
            config: true
        }
    });

    if (!integracao) {
        throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_CONFIG_INVALIDA, 'Integração ainda não configurada.');
    }

    const resultado = await strategy.healthcheck({ config: integracao.config });
    
    if (resultado === IntegracaoHealthcheck.HEALTHY) {
        await prisma.integracao.updateMany({ where: { nome }, data: { status: true } });
        return { status: IntegracaoHealthcheck.HEALTHY, mensagem: "Integração ativa." };
    }

    return { status: IntegracaoHealthcheck.UNHEALTHY, mensagem: "Integração nao ativa." };
}
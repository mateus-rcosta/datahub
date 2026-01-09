import { prisma } from "@/lib/database";
import { IntegracaoError, IntegracaoErrorType } from "../exceptions/integracao-error";
import { INTEGRACOES } from "@/types/types";

export const retornaIntegracao = async (id: number) => {
    const integracao = await prisma.integracao.findUnique({
        where: { id },
        select: {
            id: true,
            status: true,
            nome: true,
            config: true,
            updatedAt: true
        }
    });

    if (!integracao) {
        throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_NAO_ENCONTRADA, 'Integração não encontrada');
    }

    const strategy = INTEGRACOES[integracao.nome];

    if (!strategy) {
        throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_NAO_SUPORTADA, `Integração "${integracao.nome}" não suportada`);
    }
    const parsed = strategy.schema.safeParse(integracao.config);

    if (!parsed.success) {
        throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_CONFIG_INVALIDA, 'Configuração inválida da integração');
    }

    const config = parsed.data as Record<string, unknown>;
    
    for (const campo of strategy.camposSensiveis) {
        delete config[campo];
    }

    return { id: integracao.id, nome: integracao.nome, config, status: integracao.status, updatedAt: integracao.updatedAt };
}
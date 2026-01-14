import { prisma } from "@/lib/database";
import { IntegracaoError, IntegracaoErrorType } from "../exceptions/integracao-error";
import { IntegracaoNome } from "@/types/types";
import { INTEGRACOES } from "../integracoes";

export const retornaIntegracao = async (nome: string) => {
    const strategy = INTEGRACOES[nome as IntegracaoNome];

    if (!strategy){
        throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_NAO_ENCONTRADA, 'Integração não encontrada');
    }

    let integracao = await prisma.integracao.findFirst({
        where: { nome },
        select: {
            id: true,
            status: true,
            nome: true,
            config: true,
            updatedAt: true
        }
    });


    if (!integracao) {
        return {
            nome,
            status: false,
            config: null,
            updatedAt: null,
        };
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
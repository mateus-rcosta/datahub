"use server";

import { prisma } from "@/lib/database";
import { IntegracaoError, IntegracaoErrorType } from "../exceptions/integracao-error";
import { IntegracaoHealthcheckUpchat, IntegracaoJSONBUpchat } from "@/types/types";
import { apiRequest } from "@/lib/api";
import { upchatSchema } from "../schema/integracao";
import { desencriptografa } from "@/lib/crypto";

export const verificaHealthcheck = async (id: number) => {

    const integracao = await prisma.integracao.findFirst({
        where: { id },
        select: {
            nome: true,
            config: true
        }
    });

    if (!integracao) throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_NAO_ENCONTRADA, 'Integração nao encontrada.');

    if (integracao.nome === 'Upchat') {
        const config = upchatSchema.parse(integracao.config);

        if (!config.apiKey) throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_CONFIG_INVALIDA, 'Configuração inválida da integração.');
        console.log(desencriptografa(config.apiKey));
        console.log(config.queueId);
        console.log(config.url);
        const resultado = await apiRequest<IntegracaoHealthcheckUpchat>({
            path: `${config.url}/int/getQueueStatus`,
            method: 'POST',
            body: { queueId: config.queueId, apiKey: desencriptografa(config.apiKey) },
            credentials: 'omit',
        });

        if (resultado.connected && resultado.authenticated && resultado.enabled) {
            await prisma.integracao.update({
                where: { id },
                data: {
                    status: true,
                    updatedAt: new Date()
                }
            });
            return "healthy";
        }
        return "unhealthy";
    }

    return "unhealthy";
}
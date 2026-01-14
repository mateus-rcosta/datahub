"use server";
import { apiRequest } from "@/lib/api";
import { desencriptografa } from "@/lib/crypto";
import { upchatSchema } from "../../schema/integracao";
import { IntegracaoHealthcheck, IntegracaoHealthcheckContexto, IntegracaoHealthcheckUpchat } from "@/types/types";
import { IntegracaoError, IntegracaoErrorType } from "../../exceptions/integracao-error";

export const upchatHealthcheck = async ({ config }: IntegracaoHealthcheckContexto): Promise<IntegracaoHealthcheck> => {
    const configParsed = upchatSchema.parse(config);

    if (!configParsed.apiKey) throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_CONFIG_INVALIDA, 'Configuração inválida da integração.');

    try {
        const resultado = await apiRequest<IntegracaoHealthcheckUpchat>({
            path: `${configParsed.url}/int/getQueueStatus`,
            method: 'POST',
            body: { queueId: configParsed.queueId, apiKey: desencriptografa(configParsed.apiKey) },
            credentials: 'omit',
        });

        if (resultado.connected && resultado.authenticated && resultado.enabled) {
            return IntegracaoHealthcheck.HEALTHY;
        }
        
        return IntegracaoHealthcheck.UNHEALTHY;

    } catch (error: unknown) {
        return IntegracaoHealthcheck.UNHEALTHY;
    }
}


"use server";
import { apiRequest } from "@/lib/api";
import { desencriptografa } from "@/lib/crypto";
import { wifeedSchema } from "../../schema/integracao";
import {  IntegracaoHealthcheck, IntegracaoHealthcheckContexto, IntegracaoHealthcheckWifeed } from "@/types/types";
import { IntegracaoError, IntegracaoErrorType } from "../../exceptions/integracao-error";
import z from "zod";
import { ApiError } from "@/lib/api-error";
import { insereCache } from "@/lib/pg-cache";

export const wifeedHealthcheck = async ({ config }: IntegracaoHealthcheckContexto): Promise<IntegracaoHealthcheck> => {
    try {
        const configParsed = wifeedSchema.parse(config);

        const resultado = await apiRequest<IntegracaoHealthcheckWifeed>({
            path: `${configParsed.url}/auth/api/login`,
            method: 'POST',
            body: { clientId: configParsed.clientId, clientSecret: desencriptografa(configParsed.clientSecret) },
            credentials: 'omit',
        });
        
        if (resultado.response.token) {
            await insereCache(`integracao:wifeed:token`, { token: resultado.response.token }, {ttlSegundos: resultado.response.expire});
            return IntegracaoHealthcheck.HEALTHY;
        }

        return IntegracaoHealthcheck.UNHEALTHY;

    } catch (error: unknown) {
        
        if (error instanceof z.ZodError) {
            throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_CONFIG_INVALIDA, 'Configuração inválida da integração.');
        }

        if (error instanceof ApiError) {
            console.log(error.data);
        }
        return IntegracaoHealthcheck.UNHEALTHY;
    }
}

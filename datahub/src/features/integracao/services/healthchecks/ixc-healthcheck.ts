"use server";

import { ixcSchema } from "../../schema/integracao";
import {  IntegracaoHealthcheck, IntegracaoHealthcheckContexto } from "@/types/types";
import { IntegracaoError, IntegracaoErrorType } from "../../exceptions/integracao-error";
import z from "zod";
import { ApiError } from "@/lib/api-error";

export const ixcHealthcheck = async ({ config }: IntegracaoHealthcheckContexto): Promise<IntegracaoHealthcheck> => {
    try {
        const configParsed = ixcSchema.parse(config);
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

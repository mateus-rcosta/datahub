"use server";

import { prisma } from "@/lib/database";
import { authenticatedAction } from "@/lib/safe-action";
import { JsonObject } from "@prisma/client/runtime/client";
import { integracaoSchemaId } from "../schema/integracao";
import z from "zod";
import { IntegracaoError, IntegracaoErrorType } from "../exceptions/integracao-error";
import { criptografa } from "@/lib/crypto";
import { INTEGRACOES } from "@/types/types";

type IntegracaoInput = z.infer<typeof integracaoSchemaId>;

export default async function editaIntegracao({ id, config }: IntegracaoInput) {
    const integracao = await prisma.integracao.findUnique({
        where: { id },
        select: {
            id: true,
            nome: true,
            config: true
        }
    });

    if (!integracao)
        throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_NAO_ENCONTRADA, 'Integração não encontrada');


    const strategy = INTEGRACOES[integracao.nome];

    if (!strategy) {
        throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_NAO_SUPORTADA, `Integração "${integracao.nome}" não suportada`);
    }

    const resultado = strategy.schema.safeParse(config);

    if (!resultado.success) {
        const errorMessages = resultado.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new IntegracaoError(IntegracaoErrorType.VALIDACAO_FALHOU, `Erro de validação: ${errorMessages}`);
    }

    const inputConfig = resultado.data as Record<string, unknown>;

    const configAtual =
        integracao.config && typeof integracao.config === 'object'
            ? (integracao.config as Record<string, unknown>)
            : {};

    const configFinal: Record<string, unknown> = {
        ...configAtual,
        ...inputConfig,
    };

    for (const campo of strategy.camposSensiveis) {
        if (inputConfig[campo] !== "") {
            console.log(campo, inputConfig[campo]);
            configFinal[campo] = criptografa(String(inputConfig[campo]));
        } else{
            configFinal[campo] = configAtual[campo];
        }
    }

    await prisma.integracao.update({
        where: { id },
        data: {
            config: configFinal as JsonObject,
            updatedAt: new Date(),
        },
    });

}

export const editaIntegracaoAction = authenticatedAction
    .inputSchema(integracaoSchemaId)
    .action(async ({ parsedInput }) => editaIntegracao(parsedInput));
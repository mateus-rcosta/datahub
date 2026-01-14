"use server";

import { prisma } from "@/lib/database";
import { authenticatedAction } from "@/lib/safe-action";
import { JsonObject } from "@prisma/client/runtime/client";
import { integracaoSchema } from "../schema/integracao";
import z from "zod";
import { IntegracaoError, IntegracaoErrorType } from "../exceptions/integracao-error";
import { criptografa } from "@/lib/crypto";
import { IntegracaoNome } from "@/types/types";
import { INTEGRACOES } from "../integracoes";

type IntegracaoInput = z.infer<typeof integracaoSchema>;

export default async function editaIntegracao({ nome, config }: IntegracaoInput) {
    const strategy = INTEGRACOES[nome as IntegracaoNome];

    if (!strategy) {
        throw new IntegracaoError(IntegracaoErrorType.INTEGRACAO_NAO_ENCONTRADA, `Integração "${nome}" não suportada`);
    }

    const resultado = strategy.schema.safeParse(config);

    if (!resultado.success) {
        const errorMessages = resultado.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new IntegracaoError(IntegracaoErrorType.VALIDACAO_FALHOU, `Erro de validação: ${errorMessages}`);
    }

    const inputConfig = resultado.data as Record<string, unknown>;

    for (const campo of strategy.camposSensiveis) {
        if (inputConfig[campo] !== "") {
            inputConfig[campo] = criptografa(String(inputConfig[campo]));
        } 
    }

    const integracao = await prisma.integracao.findFirst({
        where: { nome },
        select: {
            id: true,
            nome: true,
            config: true
        }
    });

    if (!integracao) {
        await prisma.integracao.create({
            data: {
                nome,
                config: inputConfig as JsonObject,
                updatedAt: new Date(),
            },
        });
        return;
    }

    const configAtual =
        integracao.config && typeof integracao.config === 'object'
            ? (integracao.config as Record<string, unknown>)
            : {};

    const configFinal: Record<string, unknown> = {
        ...configAtual,
        ...inputConfig,
    };

    await prisma.integracao.updateMany({
        where: { nome },
        data: {
            config: configFinal as JsonObject,
            updatedAt: new Date(),
        },
    });

}

export const editaIntegracaoAction = authenticatedAction
    .inputSchema(integracaoSchema)
    .action(async ({ parsedInput }) => editaIntegracao(parsedInput));
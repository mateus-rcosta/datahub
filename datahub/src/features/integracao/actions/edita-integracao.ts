"use server";

import { prisma } from "@/lib/database";
import { authenticatedAction } from "@/lib/safe-action";
import { JsonObject } from "@prisma/client/runtime/client";
import { integracaoSchemaId } from "../schema/integracao";
import z from "zod";


// Infira o tipo do schema
type IntegracaoInput = z.infer<typeof integracaoSchemaId>;

export default async function editaIntegracao({ id, config }: IntegracaoInput) {
    const resultado = await prisma.integracao.update({
        where: { id },
        data: {
            config: config as unknown as JsonObject,
            updatedAt: new Date()
        },
        select: {
            id: true
        }
    });

    if (!resultado) {
        throw new Error('Integração não encontrada');
    }
}

export const editaIntegracaoAction = authenticatedAction
    .inputSchema(integracaoSchemaId)
    .action(async ({ parsedInput }) => editaIntegracao(parsedInput));
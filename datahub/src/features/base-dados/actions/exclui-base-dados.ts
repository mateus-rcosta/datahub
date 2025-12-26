"use server";

import { prisma } from "@/lib/database";
import { BaseDadosError, BaseDadosErrorType } from "../exceptions/base-dados-error";
import { authenticatedAction } from "@/lib/safe-action";
import { baseDadosExcluiSchema } from "../schema/base-de-dados-schema";

interface ExcluiBaseDadosParams {
    id: string;
}
async function excluiBaseDados({ id }: ExcluiBaseDadosParams){
    const resultado = await prisma.baseDeDados.update({where: {id}, data: {deletedAt: new Date()}, select: {id: true}});
    if (!resultado) {
        throw new BaseDadosError(BaseDadosErrorType.BASE_DE_DADOS_NAO_ENCONTRADA, 'Base de dados nao encontrada.');
    }
}

export const excluiBaseDadosAction = authenticatedAction
    .inputSchema(baseDadosExcluiSchema)
    .action(async ({ parsedInput: { id } }) => excluiBaseDados({id }));
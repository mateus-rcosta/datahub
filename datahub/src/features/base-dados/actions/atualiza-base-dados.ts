"use server";

import { prisma } from "@/lib/database";
import { BaseDadosError, BaseDadosErrorType } from "../exceptions/base-dados-error";
import { authenticatedAction } from "@/lib/safe-action";
import { baseDadosVisualizacaoSchema } from "../schema/base-de-dados-schema";

interface AtualizaBaseDadosParams {
    id: string;
    nome: string;
}
async function atualizaBaseDados({ id, nome }: AtualizaBaseDadosParams){
    const resultado = await prisma.baseDeDados.update({where: {id}, data: {nome}, select: {id: true}});
    if (!resultado) {
        throw new BaseDadosError(BaseDadosErrorType.BASE_DE_DADOS_NAO_ENCONTRADA, 'Base de dados nao encontrada.');
    }
}

export const atualizaBaseDadosAction = authenticatedAction
    .inputSchema(baseDadosVisualizacaoSchema)
    .action(async ({ parsedInput: { id, nome} }) => atualizaBaseDados({id, nome}));
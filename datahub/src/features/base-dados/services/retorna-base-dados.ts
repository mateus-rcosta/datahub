import { prisma } from "@/lib/database"
import { BaseDadosError, BaseDadosErrorType } from "../exceptions/base-dados-error";
import { BaseDados } from "@/types/types";

export const retornaBaseDados = async ({ id }: { id: string }): Promise<BaseDados> => {
    const dados = await prisma.baseDeDados.findUnique({
        where: {
            id,
            deletedAt: null
        },
        select: {
            id: true,
            nome: true,
            estrutura: true,
            usuario: {
                select: {
                    nome: true
                }
            },
            createdAt: true
        }
    })

    if (!dados) throw new BaseDadosError(BaseDadosErrorType.BASE_DE_DADOS_NAO_ENCONTRADA, 'Base de dados nao encontrada.');

    const baseDeDados = {
        id,
        nome: dados.nome,
        estrutura: dados.estrutura as string[],
        usuarioNome: dados.usuario?.nome || undefined,
        createdAt: dados.createdAt
    }

    return baseDeDados;
}
import { prisma } from "@/lib/database";

export const retornaIntegracao = async (id: number) => {
    const integracao = await prisma.integracao.findUnique({
        where: { id },
        select: {
            id: true,
            status: true,
            nome: true,
            config: true,
            updatedAt: true
        }
    });

    if (!integracao) {
        throw new Error('Integração não encontrada');
    }
    


    return { id: integracao.id, nome: integracao.nome, config: integracao.config, status: integracao.status, updatedAt: integracao.updatedAt };
}
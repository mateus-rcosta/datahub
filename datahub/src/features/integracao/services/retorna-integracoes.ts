import { prisma } from "@/lib/database";

export const retornaIntegracoes = async () => {
    const integracoes = await prisma.integracao.findMany({
        orderBy: {
            status: 'asc'
        },
        select: {
            id: true,
            status: true,
            nome: true,
            updatedAt: true
        }
    });

    return { integracoes };
}
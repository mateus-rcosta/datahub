import { prisma } from "@/lib/database";
import { INTEGRACOES } from "../integracoes";

export const retornaIntegracoes = async () => {
    const configuradas = await prisma.integracao.findMany({
        select: {
            id: true,
            nome: true,
            status: true,
            updatedAt: true,
        }
    });

    const porNome = Object.fromEntries(
        configuradas.map(i => [i.nome, i])
    );

    const integracoes = Object.keys(INTEGRACOES).map((nome) => {
        const existente = porNome[nome];

        return {
            nome,
            id: existente?.id ?? null,
            status: existente?.status ?? false,
            configurada: !!existente,
            updatedAt: existente?.updatedAt ?? null,
        };
    });

    return { integracoes };
};

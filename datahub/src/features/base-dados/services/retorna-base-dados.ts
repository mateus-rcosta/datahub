import { Prisma } from "@prisma/client";
import { ApiPagination, BaseDados, PageParams } from "@/types/types";
import { prisma } from "@/lib/database";

export const retornaBaseDados = async ({ pesquisa, page, limit }: PageParams):Promise<ApiPagination<BaseDados>> => {
    const where: Prisma.baseDeDadosWhereInput = {
        nome: { contains: pesquisa, mode: "insensitive" },
    };

    const [total, data] = await prisma.$transaction([
        prisma.baseDeDados.count({ where }),
        prisma.baseDeDados.findMany({
            where,
            take: limit,
            skip: (page - 1) * limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                nome: true,
                estrutura: true,
                _count: {
                    select: {
                        clientes: true
                    }
                },
                updatedAt: true,
                createdAt: true
            }
        })
    ])

    const hasNext = page * limit < total;
    const hasPrevious = page > 1;

    const resultado = data.map((baseDeDados) => ({
        id: baseDeDados.id,
        nome: baseDeDados.nome,
        estrutura: baseDeDados.estrutura,
        clientes: baseDeDados._count.clientes,
        createdAt: baseDeDados.createdAt,
        updatedAt: baseDeDados.updatedAt ?? undefined,
    }));

    return { total, dados: resultado, hasNext, hasPrevious, page, limit };
}
"use server";
import { prisma } from "@/lib/database";
import { ApiPagination, RetornarUsuarios, Usuario } from "@/types/types";

export default async function retornarUsuarios({ pesquisa, page = 1, limit = 10 }: RetornarUsuarios): Promise<ApiPagination<Usuario>> {
  
  const take = limit;
  const skip = (page - 1) * limit;

  const [usuarios, total] = await Promise.all([
    prisma.funcionario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        admin: true,
        ativo: true,
        permissoes: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take,
      where: { deletedAt: null, nome: { contains: pesquisa, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.funcionario.count({
      where: { deletedAt: null, nome: { contains: pesquisa, mode: "insensitive" } },
    }),
  ]);

  const hasNext = page * limit < total;
  const hasPrevious = page > 1;

  const usuariosFormatted = usuarios.map(u => {
    const permissoesObj = (u.permissoes as Partial<Usuario["permissoes"]>) ?? {};

    return {
      ...u,
      permissoes: {
        editar_base_dados: !!permissoesObj.editar_base_dados,
        visualizar_relatorios: !!permissoesObj.visualizar_relatorios,
        editar_campanhas: !!permissoesObj.editar_campanhas,
        editar_integracoes: !!permissoesObj.editar_integracoes,
      },
    };
  });

  return {
    data: usuariosFormatted,
    hasNext,
    hasPrevious,
    limit: limit,
    page: page,
    total: total,
  };
}


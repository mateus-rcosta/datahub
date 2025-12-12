"use server";
import { prisma } from "@/lib/database";
import { ApiPagination, RetornarUsuarios, Usuario } from "@/types/types";
import { Prisma } from "@prisma/client";

export default async function retornaUsuarios({ pesquisa, page = 1, limit = 10 }: RetornarUsuarios): Promise<ApiPagination<Usuario>> {

  const take = limit;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.usuarioWhereInput = {
    deletedAt: null,
    nome: { contains: pesquisa, mode: "insensitive" },
    permissoes: { path: ["super_admin"], equals: false },

  };

  const [Usuarios, total]:[Usuario[], number] = await Promise.all([
    await prisma.$queryRaw`
      SELECT
        id,
        nome,
        email,
        admin,
        ativo,
        permissoes - 'super_admin' AS permissoes
      FROM usuario
      WHERE "deletedAt" IS NULL
        AND nome ILIKE ${'%' + pesquisa + '%'}
        AND permissoes ->> 'super_admin' = 'false'
      ORDER BY "createdAt" DESC
      OFFSET ${skip}
      LIMIT ${take};
    `,
    prisma.usuario.count({ where: whereClause }),
  ]);

  const hasNext = page * limit < total;
  const hasPrevious = page > 1;

  const UsuariosFormatado = Usuarios.map(u => {
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
    data: UsuariosFormatado,
    hasNext,
    hasPrevious,
    limit: limit,
    page: page,
    total: total,
  };
}


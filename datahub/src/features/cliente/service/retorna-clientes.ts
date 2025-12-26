"use server";
import { prisma } from "@/lib/database";
import { ApiPagination, Cliente, PageParams } from "@/types/types";
import { Prisma } from "@prisma/client";

export default async function retornaClientes({ pesquisa, page = 1, limit = 10, campoPesquisa, campos }: PageParams, baseDadosid: string): Promise<ApiPagination<Cliente>> {

  const take = limit;
  const skip = (page - 1) * limit;

  const wherePesquisa = pesquisa ?
    Prisma.sql` AND dados ->> ${campoPesquisa} ILIKE ${'%' + pesquisa + '%'}` : Prisma.sql``;

  const [clientes, totalResultado]: [Cliente[], { total: number; }[]] = await Promise.all([
    await prisma.$queryRaw`
    SELECT
      id,
      dados,
      validacao,
      "createdAt",
      "updatedAt",
      "baseDeDadosId"
    FROM clientes
    WHERE "deletedAt" IS NULL
      AND "baseDeDadosId" = ${baseDadosid}
      ${wherePesquisa}
    ORDER BY id DESC
    OFFSET ${skip}
    LIMIT ${take};
    `,
    await prisma.$queryRaw<{ total: number }[]>`
    SELECT COUNT(id)::int AS total
    FROM clientes
    WHERE "deletedAt" IS NULL
      AND "baseDeDadosId" = ${baseDadosid}
      ${wherePesquisa}
  `,
  ]);

  const total = totalResultado[0]?.total ?? 0;
  const hasNext = page * limit < total;
  const hasPrevious = page > 1;

  return {
    dados: clientes,
    hasNext,
    hasPrevious,
    limit,
    page,
    total,
  };
}


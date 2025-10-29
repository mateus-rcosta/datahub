"use server";

import { prisma } from "@/lib/database";
import { Usuario } from "../type/types";

export default async function retornarUsuarios(): Promise<Usuario[]> {
  const usuarios = await prisma.funcionario.findMany({
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
    where: { deletedAt: null },
    orderBy: { createdAt: "desc"}
  });

  return usuarios.map(u => {
    const permissoesObj = (u.permissoes as Partial<Usuario["permissoes"]>) ?? {};

    return {
      ...u,
      permissoes: {
        editar_base_dados: !!permissoesObj.editar_base_dados,
        visualizar_relatorios: !!permissoesObj.visualizar_relatorios,
        editar_campanhas: !!permissoesObj.editar_campanhas,
        editar_integracoes: !!permissoesObj.editar_integracoes,
      }
    };
  });
}

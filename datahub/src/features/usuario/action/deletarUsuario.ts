"use server";

import { prisma } from "@/lib/database";

export default async function deletarUsuario(id: number) {
  try {
    if (id === 1) {
      throw new Error("Usuário ADMIN não pode ser excluído");
    }
    const data = Date.now();
    await prisma.$executeRawUnsafe(`
      UPDATE public.funcionario
      SET email = CONCAT('deleted_${data}_', email), "deletedAt" = NOW()
      WHERE id = ${id} AND "deletedAt" IS NULL AND id != 1;
    `);
  } catch (error: unknown) {
    throw new Error("Erro ao deletar usuário");
  }
}


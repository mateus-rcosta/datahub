"use server";

import { prisma } from "@/lib/database";

export default async function mudarStatusUsuario(id: number) {
  try {
    if (id === 1) {
      throw new Error("Usuário ADMIN não pode ser inativo");
    }

    await prisma.$executeRaw`
      UPDATE funcionario
      SET ativo = NOT ativo, "updatedAt" = NOW()
      WHERE id = ${id};
    `;
  } catch (error: any) {
    throw new Error(error.message || "Erro ao mudar status de acesso do usuário.");
  }
}
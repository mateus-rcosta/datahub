"use server";

import { prisma } from "@/lib/database";
import { toast } from "sonner";

export default async function deletarUsuario(id: number) {
  try {
    if(id === 1){
      throw new Error("Usuário ADMIN não pode ser excluído");
    }
    await prisma.funcionario.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } catch (error: any) {
    throw new Error(error.message || "Erro ao deletar usuário");
  }
}

"use server";

import { prisma } from "@/lib/database";
import {verifySession } from "@/lib/session";
import { UserError, UserErrorType } from "../exceptions/UserError";
import { SessionError, SessionErrorType } from "@/lib/SessionError";

export default async function deletarUsuario(id: number) {

  try {

    const user = await verifySession().then((payload) => payload?.userId);
    
    if (!user) throw new SessionError(SessionErrorType.USUARIO_NAO_LOGADO, "Usuário não autenticado.");

    if (id === 1) {
      throw new UserError(UserErrorType.ADMIN_NAO_PODE_SER_ALTERADO, "Usuário admin não pode ser deletado.");
    }

    if (id === user) {
      throw new UserError(UserErrorType.USUARIO_NAO_PODE_SE_EXCLUIR, "Usuário autenticado nao pode ser deletado.");
    }

    const data = Date.now();
    await prisma.$executeRawUnsafe(`
      UPDATE public.funcionario
      SET email = CONCAT('deleted_${data}_', email), "deletedAt" = NOW()
      WHERE id = ${id} AND "deletedAt" IS NULL AND id != 1;
    `);
  } catch (error: unknown) {
    if (error instanceof UserError || error instanceof SessionError) {
      throw error;
    }
    throw new Error("Erro ao deletar usuário");
  }
}


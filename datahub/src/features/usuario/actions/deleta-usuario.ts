"use server";

import { prisma } from "@/lib/database";
import { UsuarioError, UsuarioErrorType } from "../exceptions/usuario-error";
import { SessaoError, SessaoErrorType } from "@/lib/sessao-error";
import { uuidSchema } from "../schema/usuario-schema";
import { authenticatedAction } from "@/lib/safe-action";
async function deletaUsuario(id: string, usuarioId: string) {
  try {
    if (id === usuarioId) {
      throw new UsuarioError(UsuarioErrorType.USUARIO_NAO_PODE_SE_EXCLUIR, "Usuário autenticado nao pode ser deletado.");
    }

    const data = Date.now();

    const updated = await prisma.$executeRaw`
      UPDATE usuarios
      SET email = CONCAT('deleted_', ${data}::text, '_', email), "deletedAt" = NOW()
      WHERE id = ${id} AND "deletedAt" IS NULL AND COALESCE(permissoes ->> 'super_admin', 'false') = 'false'
      RETURNING id;
    ` ;

    if (updated === 0) throw new UsuarioError(UsuarioErrorType.USUARIO_NAO_ENCONTRADO, "Usuário nao encontrado.");

  } catch (error: unknown) {
    console.log("aparece aqui no topo")
    if (error instanceof UsuarioError) {
      throw error;
    }

    if(error instanceof SessaoError) {
      console.log("aparece aqui")
      throw new SessaoError(SessaoErrorType.USUARIO_NAO_LOGADO, "Usuário não autenticado.");
    }

    throw new Error("Erro ao deletar usuário");
  }
}

export const deletaUsuarioAction = authenticatedAction
  .inputSchema(uuidSchema)
  .action(async ({ parsedInput: { id }, ctx: { usuarioId }}) => deletaUsuario(id, usuarioId));
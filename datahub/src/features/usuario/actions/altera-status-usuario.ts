"use server";

import { prisma } from "@/lib/database";
import { UsuarioError, UsuarioErrorType } from "../exceptions/usuario-error";
import { SessaoError } from "@/lib/sessao-error";
import { authenticatedAction } from "@/lib/safe-action";
import { uuidSchema } from "../schema/usuario-schema";


export default async function alteraStatusUsuario(id: string, usuarioId: string) {
  try {

    if (id === usuarioId) {
      throw new UsuarioError(UsuarioErrorType.USUARIO_NAO_PODE_SE_EXCLUIR, "Usuário autenticado nao pode ser deletado.");
    }

    const updated = await prisma.$executeRaw`
      UPDATE usuarios
      SET ativo = NOT ativo, "updatedAt" = NOW()
      WHERE id = ${id} AND "deletedAt" IS NULL AND COALESCE(permissoes ->> 'super_admin', 'false') = 'false'
      RETURNING id;
    ` ; 

    if(updated === 0) throw new UsuarioError(UsuarioErrorType.USUARIO_NAO_ENCONTRADO, "Usuário nao encontrado.");
    
  } catch (error: unknown) {
    if (error instanceof UsuarioError || error instanceof SessaoError) {
      throw error;
    }
    throw new Error("Erro ao deletar usuário");
  }
}

export const alteraStatusUsuarioAction = authenticatedAction
  .inputSchema(uuidSchema)
  .action(async ({ parsedInput: { id }, ctx: { usuarioId }}) => alteraStatusUsuario(id, usuarioId));


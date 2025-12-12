"use server";

import bcrypt from "bcrypt";
import { criaSessao } from "@/lib/sessao";
import { prisma } from "@/lib/database";
import { formSchema, PermissoesSchema } from "../_schemas/schema";
import { AuthError, AuthErrorType } from "@/app/(nao_autenticado)/_exception/AuthError";
import { actionClient } from "@/lib/safe-action";

export const loginAction = actionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput: { email, senha } }) => {
    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
        ativo: true,
        deletedAt: null,
      },
    });

    if (!usuario) {
      throw new AuthError(AuthErrorType.CREDENCIAIS_INVALIDAS);
    }

    // Valida a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new AuthError(AuthErrorType.CREDENCIAIS_INVALIDAS);
    }

    // Processa permissões
    const permissoes = PermissoesSchema.parse(usuario.permissoes);
    const permissoesLista: string[] = [];

    for (const [key, value] of Object.entries(permissoes)) {
      if (value) {
        permissoesLista.push(key);
      }
    }

    // Cria a sessão
    await criaSessao({
      usuarioId: usuario.id,
      email: usuario.email,
      admin: usuario.admin,
      permissoes: permissoesLista,
    });

    return {
      success: true,
      message: "Login realizado com sucesso",
    };
  });
"use server"

import { prisma } from "@/lib/database"
import { usuarioSchema } from "../schema/UsuarioSchema"
import { gerarHash } from "@/lib/bcrypt"
import { Prisma } from "@prisma/client"
import { CriarUsuarioInput } from "../type/types"
import { UserError, UserErrorType } from "../exceptions/UserError"


export default async function criarUsuario(usuario: CriarUsuarioInput) {
  try {

    // validação com Zod
    const parsed = usuarioSchema.safeParse(usuario);

    if (!parsed.success) {
      const validacao = parsed.error.issues.map((issue) => issue.message);
      throw new UserError(UserErrorType.DADOS_INVALIDOS, "Dados inválidos", validacao);
    }

    const {
      nome,
      email,
      senha,
      admin,
      editar_base_dados,
      visualizar_relatorios,
      editar_campanhas,
      editar_integracoes,
    } = parsed.data


    await prisma.funcionario.create({
      data: {
        nome,
        email,
        senha: await gerarHash(senha),
        admin,
        permissoes: {
          editar_base_dados,
          visualizar_relatorios,
          editar_campanhas,
          editar_integracoes,
        },
      },
    })
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new UserError(UserErrorType.EMAIL_EM_USO, "E-mail ja cadastrado");
      }
    }

    if (error instanceof UserError) {
      throw error;
    }


    throw new Error("Erro ao criar usuário");
  }
}

"use server"

import { prisma } from "@/lib/database"
import { usuarioSchema } from "../schema/UsuarioSchema"
import { gerarHash } from "@/lib/bcrypt"

export default async function criarUsuario(input: unknown) {
  // validação com Zod
  const parsed = usuarioSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error("Dados inválidos: " + JSON.stringify(parsed.error.format()))
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


  try {
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
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("E-mail ja cadastrado");
    }

    throw new Error("Erro ao criar usuário");
  }
}

"use server"

import { prisma } from "@/lib/database"
import { gerarHash } from "@/lib/bcrypt"
import { Prisma } from "@prisma/client"
import { UsuarioError, UsuarioErrorType } from "../exceptions/usuario-error"
import { usuarioSchema } from "../schema/usuario-schema"
import { authenticatedAction } from "@/lib/safe-action"
import z from "zod"


export default async function criaUsuario(usuario:z.infer<typeof usuarioSchema>) {
  try {

    const {
      nome,
      email,
      senha,
      admin,
      permissoes
    } = usuario;


    await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: await gerarHash(senha),
        admin,
        permissoes: {
          super_admin: false,
          editar_base_dados: permissoes.editar_base_dados,
          visualizar_relatorios: permissoes.visualizar_relatorios,
          editar_campanhas: permissoes.editar_campanhas,
          editar_integracoes: permissoes.editar_integracoes
        },
      },
    })
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new UsuarioError(UsuarioErrorType.EMAIL_EM_USO, "E-mail ja cadastrado");
      }
    }

    if (error instanceof UsuarioError) {
      throw error;
    }

    console.log("erro ao criar usuário:" + error);
    throw new Error("Erro ao criar usuário");
  }
}

export const criaUsuarioAction = authenticatedAction
    .inputSchema(usuarioSchema)
    .action(async ({ parsedInput }) => criaUsuario({ ...parsedInput }));

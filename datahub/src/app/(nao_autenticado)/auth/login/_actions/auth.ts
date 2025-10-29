"use server";

import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/database";
import z from "zod";

const PermissoesSchema = z.object({
  editar_base_dados: z.boolean().optional().default(false),
  visualizar_relatorios: z.boolean().optional().default(false),
  editar_campanhas: z.boolean().optional().default(false),
  editar_integracoes: z.boolean().optional().default(false),
});


export async function loginAction(email: string, senha: string) {

  const user = await prisma.funcionario.findUnique({ where: { email, ativo: true, deletedAt: null } });
  if (!user) throw new Error("Usuário ou senha inválida.");

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) throw new Error("Usuário ou senha inválida.");

  const permissoes = PermissoesSchema.parse(user.permissoes);

  await createSession({
    userId: user.id,
    email: user.email,
    admin: user.admin,
    editar_campanhas: permissoes.editar_campanhas,
    editar_base_dados: permissoes.editar_base_dados,
    editar_integracoes: permissoes.editar_integracoes,
    visualizar_relatorios: permissoes.visualizar_relatorios,
  });

  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    admin: user.admin,
  };
}

"use server";

import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { prisma } from "@/lib/database";

export async function loginAction(email: string, senha: string) {
  const user = await prisma.funcionario.findUnique({ where: { email } });
  if (!user) throw new Error("Usuário ou senha inválida.");

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) throw new Error("Usuário ou senha inválida.");

  await createSession({
    userId: user.id,
    email: user.email,
    admin: user.admin,
  });

  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    admin: user.admin,
  };
}

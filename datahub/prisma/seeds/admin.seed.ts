import bcrypt from "bcrypt";
import { prisma } from "@/lib/database";
import { env } from "@/lib/env";

export async function seedAdmin() {
  const senha = "admin123";
  const hash = await bcrypt.hash(senha, env.SALT_ROUNDS);

  await prisma.usuario.upsert({
    where: { email: "admin@empresa.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@empresa.com",
      senha: hash,
      admin: true,
      ativo: true,
      permissoes: {
        super_admin: true,
        editar_base_dados: true,
        visualizar_relatorios: true,
        editar_campanhas: true,
        editar_integracoes: true,
      },
    },
  });

  console.log("✔ Usuário admin criado / já existente");
}

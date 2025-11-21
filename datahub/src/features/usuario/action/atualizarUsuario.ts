"use server";

import { prisma } from "@/lib/database";
import { gerarHash } from "@/lib/bcrypt";
import z from "zod";
import { usuarioEditarSchema } from "../schema/UsuarioSchema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";

interface AtualizarUsuarioInput extends Partial<z.infer<typeof usuarioEditarSchema>> {
    id: number;
}

export default async function atualizarUsuario(input: AtualizarUsuarioInput) {
    const { id, ...rest } = input;

    const parsed = usuarioEditarSchema.safeParse(rest);

    if (!parsed.success) {
        throw new Error("Dados inválidos: " + JSON.stringify(parsed.error.message));
    }

    let {
        nome,
        senha,
        admin,
        editar_base_dados,
        visualizar_relatorios,
        editar_campanhas,
        editar_integracoes,
    } = parsed.data;
    
    if (id === 1) {
        admin = true;
        senha = undefined;
    }

    try {
        await prisma.funcionario.update({
            where: { id },
            data: {
                nome,
                senha: senha ? await gerarHash(senha) : undefined, // só atualiza se houver senha
                admin,
                permissoes: admin
                    ? {
                        editar_base_dados: true,
                        visualizar_relatorios: true,
                        editar_campanhas: true,
                        editar_integracoes: true,
                    }
                    : {
                        editar_base_dados,
                        visualizar_relatorios,
                        editar_campanhas,
                        editar_integracoes,
                    },
                updatedAt: new Date(),
            },

        });

    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
              if (error.code === "P2002") {
                throw new Error("E-mail ja cadastrado");
              }
            }
        
        
            throw new Error("Erro ao atualizar usuário.");
    }
}

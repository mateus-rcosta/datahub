"use server";

import { gerarHash } from "@/lib/bcrypt";
import z from "zod";
import { prisma } from "@/lib/database";
import { UsuarioError } from "../exceptions/usuario-error";
import { authenticatedAction } from "@/lib/safe-action";
import { editarSchema, usuarioSchema } from "../schema/usuario-schema";

export default async function atualizaUsuario(dados: z.infer<typeof editarSchema>) {

    let {
        id,
        nome,
        senha,
        admin,
        permissoes
    } = dados;

    try {
        await prisma.usuario.update({
            where: {
                id,
                NOT: {
                    permissoes: { path: ["super_admin"], equals: "false" },
                }
            },
            data: {
                nome,
                senha: senha ? await gerarHash(senha) : undefined,
                admin,
                permissoes: admin
                    ? {
                        super_admin: false,
                        editar_base_dados: true,
                        visualizar_relatorios: true,
                        editar_campanhas: true,
                        editar_integracoes: true,
                    }
                    : {
                        super_admin: false,
                        editar_base_dados: permissoes.editar_base_dados,
                        visualizar_relatorios: permissoes.visualizar_relatorios,
                        editar_campanhas: permissoes.editar_campanhas,
                        editar_integracoes: permissoes.editar_integracoes,
                    },
                updatedAt: new Date(),
            },

        });

    } catch (error: unknown) {
        if (error instanceof UsuarioError) {
            throw error;
        }


        throw new Error("Erro ao atualizar usuário.");
    }
}

export const atualizaUsuarioAction = authenticatedAction
    .inputSchema(editarSchema)
    .action(async ({ parsedInput }) => atualizaUsuario({ ...parsedInput }));

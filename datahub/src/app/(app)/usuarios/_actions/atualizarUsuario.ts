"use server";

import { prisma } from "@/lib/database";
import { gerarHash } from "@/lib/bcrypt";
import z from "zod";
import { usuarioEditarSchema } from "../_schemas/UsuarioSchema";

interface AtualizarUsuarioInput extends Partial<z.infer<typeof usuarioEditarSchema>> {
    id: number;
}

export default async function atualizarUsuario(input: AtualizarUsuarioInput) {
    const { id, ...rest } = input;

    const parsed = usuarioEditarSchema.safeParse(rest);

    if (!parsed.success) {
        throw new Error("Dados inválidos: " + JSON.stringify(parsed.error.message));
    }

    const {
        nome,
        senha,
        admin,
        editar_base_dados,
        visualizar_relatorios,
        editar_campanhas,
        editar_integracoes,
    } = parsed.data;

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
            },
        });
    } catch (error: any) {
        if (error.code === "P2002") {
            throw new Error("E-mail já cadastrado");
        }
        throw new Error(error.message || "Erro ao atualizar usuário");
    }
}

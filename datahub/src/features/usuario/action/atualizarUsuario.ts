"use server";

import { gerarHash } from "@/lib/bcrypt";
import z from "zod";
import { usuarioEditarSchema } from "../schema/UsuarioSchema";
import { prisma } from "@/lib/database";
import { UserError, UserErrorType } from "../exceptions/UserError";

export interface AtualizarUsuarioInput extends Partial<z.infer<typeof usuarioEditarSchema>> {
    id: number;
}

export default async function atualizarUsuario(input: AtualizarUsuarioInput) {
    const { id, ...rest } = input;

    const parsed = usuarioEditarSchema.safeParse(rest);

    if (!parsed.success) {
        const validacao = parsed.error.issues.map((issue) => issue.message);
        throw new UserError(UserErrorType.DADOS_INVALIDOS, "Dados inválidos", validacao);
    }

    if (id === 1) {
        throw new UserError(UserErrorType.ADMIN_NAO_PODE_SER_ALTERADO, "Usuário admin não pode ser deletado.");
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

    } catch (error: unknown) {
        if (error instanceof UserError) {
            throw error;
        }


        throw new Error("Erro ao atualizar usuário.");
    }
}

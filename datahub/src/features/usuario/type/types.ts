import { JsonValue } from "@prisma/client/runtime/library";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string | null;
    admin: boolean;
    ativo: boolean;
    permissoes: {
        editar_base_dados: boolean;
        visualizar_relatorios: boolean;
        editar_campanhas: boolean;
        editar_integracoes: boolean;
    } & JsonValue;
    createdAt: Date | null;
    updatedAt: Date | null;
}


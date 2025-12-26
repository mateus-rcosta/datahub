"use server";

import { prisma } from "@/lib/database";
import { authenticatedAction } from "@/lib/safe-action";
import { clienteSchemaEdicao } from "../schema/cliente-schema";
import { ClienteError, ClienteErrorType } from "../exceptions/cliente-error";

interface EditarClienteParams {
    id: string;
    dados: {
        telefone?: string;
        whatsapp?: string;
        email?: string;
        [x: string]: string | undefined;
    }
}

export default async function editarCliente({ id, dados }: EditarClienteParams) {

    const resultado = await prisma.$executeRaw`
        UPDATE clientes
        SET dados = dados || ${JSON.stringify(dados)}::jsonb ,
        "updatedAt" = NOW()
        WHERE id = ${id}
          AND "deletedAt" IS NULL
        RETURNING id;
    `;

    if (resultado === 0) {
        throw new ClienteError(ClienteErrorType.CLIENTE_NAO_ENCONTRADO, "Cliente não encontrado.");
    }
}

export const editaClienteAction = authenticatedAction
    .inputSchema(clienteSchemaEdicao)
    .action(async ({ parsedInput: { id, dados } }) => editarCliente({id, dados}));
"use server";

import { prisma } from "@/lib/database";
import { authenticatedAction } from "@/lib/safe-action";
import { ClienteError, ClienteErrorType } from "../exceptions/cliente-error";
import z from "zod";


export default async function excluiCliente(id:string) {

    const resultado = await prisma.cliente.update(
        {
            where: { id, deletedAt: null },
            data: { deletedAt: new Date() },
            select: { id: true },
        }
    );

    if (!resultado) {
        throw new ClienteError(ClienteErrorType.CLIENTE_NAO_ENCONTRADO, "Cliente não encontrado.");
    }
}

export const editaClienteAction = authenticatedAction
    .inputSchema(z.uuidv7("ID do cliente inválido"))
    .action(async ({ parsedInput: id }) => excluiCliente(id));
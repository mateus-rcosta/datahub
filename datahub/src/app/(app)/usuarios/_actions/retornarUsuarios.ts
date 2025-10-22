"use server";

import { prisma } from "@/lib/database";

export default async function retornarUsuarios() {
    return await prisma.funcionario.findMany({
        select: {
            id: true,
            nome: true,
            email: true,
            admin: true,
            permissoes: true,
            createdAt: true,
            updatedAt: true,
        }, where:{
            deletedAt: null
        }
    });
}

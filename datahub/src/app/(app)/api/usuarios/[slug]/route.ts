import atualizarUsuario from "@/features/usuario/action/atualizarUsuario";
import deletarUsuario from "@/features/usuario/action/deletarUsuario";
import { UserError, UserErrorType } from "@/features/usuario/exceptions/UserError";
import { NextResponse } from "next/server";


export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
    const { slug } = await params;

    try {
        await deletarUsuario(Number(slug));
        return new NextResponse(null, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof UserError) {
            if (error.code === UserErrorType.ADMIN_NAO_PODE_SER_ALTERADO || error.code === UserErrorType.USUARIO_NAO_PODE_SE_EXCLUIR) {
                return NextResponse.json(
                    {
                        message: error.message,
                        code: error.code,
                    },
                    { headers: { 'Content-Type': 'application/json' }, status: 400 },
                )
            }

            return NextResponse.json(
            {
                message: "Erro ao criar o usuário.",
                code: "ERROR",
            },
            { headers: { 'Content-Type': 'application/json' }, status: 500 },
        )
        }
    }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
    const { slug } = await params;

    try {
        const body = await request.json();
        await atualizarUsuario({id: Number(slug), ...body});
        return new NextResponse(null, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof UserError) {
            if (error.code === UserErrorType.ADMIN_NAO_PODE_SER_ALTERADO || error.code === UserErrorType.DADOS_INVALIDOS) {
                return NextResponse.json(
                    {
                        message: error.message,
                        validacao: error.validacao ? error.validacao : null,
                        code: error.code,
                    },
                    { headers: { 'Content-Type': 'application/json' }, status: 400 },
                )
            }

            return NextResponse.json(
            {
                message: "Erro ao criar o usuário.",
                code: "ERROR",
            },
            { headers: { 'Content-Type': 'application/json' }, status: 500 },
        )
        }
    }
}
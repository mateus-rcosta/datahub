import criarUsuario from '@/features/usuario/action/criarUsuario';
import retornarUsuarios from '@/features/usuario/action/retornarUsuarios';
import { UserError, UserErrorType } from '@/features/usuario/exceptions/UserError';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const path = process.env.APP_URL!;
    const from = request.headers.get("x-requested-by");

    if (from !== "nextjs-client") {
        return NextResponse.redirect(`${path}/usuarios`, 303);
    }

    const searchParams = request.nextUrl.searchParams;
    let pesquisa = searchParams.get('pesquisa');
    let limit = Number(searchParams.get('limit'));
    let page = Number(searchParams.get('page'));

    if (!pesquisa) {
        pesquisa = "";
    }

    if (!limit) {
        limit = 10;
    }

    if (!page) {
        page = 1;
    }

    const usuarios = await retornarUsuarios({ pesquisa, page, limit });

    return new NextResponse(
        JSON.stringify({ data: usuarios.data, hasNext: usuarios.hasNext, hasPrevious: usuarios.hasPrevious, limit: usuarios.limit, page: usuarios.page, total: usuarios.total }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 },
    );
}

export async function POST(request: NextRequest) {
    try {
        await criarUsuario(await request.json());
        return new NextResponse(null, { headers: { 'Content-Type': 'application/json' }, status: 201 });

    } catch (error: unknown) {
        if (error instanceof UserError) {
            if (error.code === UserErrorType.DADOS_INVALIDOS || error.code === UserErrorType.SENHA_INVALIDA) {
                return NextResponse.json(
                    {
                        message: error.message,
                        validacao: error.validacao? error.validacao : null,
                        code: error.code,
                    },
                    { headers: { 'Content-Type': 'application/json' }, status: 400 },
                )
            }
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
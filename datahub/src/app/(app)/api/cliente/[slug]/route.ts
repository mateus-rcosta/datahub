import retornaClientes from '@/features/cliente/service/retorna-clientes';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const path = env.APP_URL;
    const from = request.headers.get("x-requested-by");

    if (from !== "nextjs-client") {
        return NextResponse.redirect(`${path}/dashboard`, 303);
    }

    const { slug } = await params;

    const searchParams = request.nextUrl.searchParams;
    let pesquisa = searchParams.get('pesquisa');
    let campoPesquisa = searchParams.get('campoPesquisa');
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

    if (!campoPesquisa) {
        campoPesquisa = "";
    }

    const usuarios = await retornaClientes({ pesquisa, page, limit, campoPesquisa }, slug);

    return new NextResponse(
        JSON.stringify({ dados: usuarios.dados, hasNext: usuarios.hasNext, hasPrevious: usuarios.hasPrevious, limit: usuarios.limit, page: usuarios.page, total: usuarios.total }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 },
    );
}

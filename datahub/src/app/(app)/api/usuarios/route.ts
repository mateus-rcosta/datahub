import retornarUsuarios from '@/features/usuario/action/retornarUsuarios';
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


import { IntegracaoError } from '@/features/integracao/exceptions/integracao-error';
import { retornaIntegracao } from '@/features/integracao/services/retorna-integracao';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const path = env.APP_URL;
    const from = request.headers.get("x-requested-by");

    if (from !== "nextjs-client") {
        return NextResponse.redirect(`${path}/dashboard`, 303);
    }

    const { slug } = await params;


    try {
        const integracao = await retornaIntegracao(Number(slug));
        return new NextResponse(JSON.stringify(integracao));
    }catch (error: unknown) {
        if (error instanceof IntegracaoError) {
            return NextResponse.json({ code_error: error.code, mensagem: error.message }, { status: 400 });
        }

        return NextResponse.json({ code_error: 'SERVER_ERROR', mensagem: "Erro interno de servidor" }, { status: 500 });
    }
}

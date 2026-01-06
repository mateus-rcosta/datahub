
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

    
    const integracao = await retornaIntegracao(Number(slug));
    return new NextResponse(JSON.stringify(integracao));
}

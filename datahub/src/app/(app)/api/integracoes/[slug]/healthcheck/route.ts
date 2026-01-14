import { IntegracaoError, IntegracaoErrorType } from "@/features/integracao/exceptions/integracao-error";
import { verificaHealthcheck } from "@/features/integracao/services/verifica-healthcheck";
import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const path = env.APP_URL;
    const from = request.headers.get("x-requested-by");

    if (from !== "nextjs-client") {
        return NextResponse.redirect(`${path}/dashboard`, 303);
    }

    const { slug } = await params;

    try {
        const resultado = await verificaHealthcheck(slug);
        return NextResponse.json(resultado);
    } catch (error: unknown) {
        if (error instanceof IntegracaoError) {
            console.log(error.code)
            if (error.code === IntegracaoErrorType.INTEGRACAO_NAO_ENCONTRADA) {
                return NextResponse.json({ code_error: error.code, mensagem: error.message, validacao: error.validacao }, { status: 404 });
            }
            return NextResponse.json({ code_error: error.code, mensagem: error.message, validacao: error.validacao }, { status: 400 });
        }
    }
}
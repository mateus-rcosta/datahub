import { IntegracaoError } from "@/features/integracao/exceptions/integracao-error";
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
        const resultado = await verificaHealthcheck(Number(slug));
        if (resultado === "healthy") {
          return NextResponse.json({ status: "healthy", mensagem: "Integração ativa." });  
        } 
        return NextResponse.json({ status: "unhealthy", mensagem: "Integração não ativa." });
    } catch (error: unknown) {
        if (error instanceof IntegracaoError) {
            return NextResponse.json({ code_error: error.code, mensagem: error.message, validacao: error.validacao }, { status: 400 });
        }
    }
}
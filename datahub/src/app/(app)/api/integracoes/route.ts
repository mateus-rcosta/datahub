import { retornaIntegracoes } from "@/features/integracao/services/retorna-integracoes";
import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const path = env.APP_URL;
    const from = request.headers.get("x-requested-by");

    if (from !== "nextjs-client") {
        return NextResponse.redirect(`${path}/dashboard`, 303);
    }

    const integracoes = await retornaIntegracoes();

    return NextResponse.json(integracoes.integracoes);
}
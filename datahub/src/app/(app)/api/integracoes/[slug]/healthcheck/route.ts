import { apiRequest } from "@/lib/api";
import { prisma } from "@/lib/database";
import { env } from "@/lib/env";
import { IntegracaoHealthcheckUpchat, IntegracaoJSONBUpchat } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const path = env.APP_URL;
    const from = request.headers.get("x-requested-by");

    // if (from !== "nextjs-client") {
    //     return NextResponse.redirect(`${path}/dashboard`, 303);
    // }

    const { slug } = await params;

    const integracao = await prisma.integracao.findFirst({
        where: { id: Number(slug) },
        select: {
            nome: true,
            config: true
        }
    });

    if (!integracao) throw new Error('Integração nao encontrada.');

    if (integracao.nome === 'Upchat') {
        const config = integracao.config as unknown as IntegracaoJSONBUpchat;

        const resultado = await apiRequest<IntegracaoHealthcheckUpchat>({
            path: `${env.UPCHAT_URL}/int/getQueueStatus`,
            method: 'PATCH',
            body: { queueId: config.queueId, apiKey: config.apiKey },
            credentials: 'omit',
        });
        
        if(resultado.sucesso){
            if (resultado.dados.connected && resultado.dados.authenticated && resultado.dados.enabled) {
                await prisma.integracao.update({
                    where: { id: Number(slug) },
                    data: {
                        status: true,
                        updatedAt: new Date()
                    }
                });
            }
            return NextResponse.json({status: "healthy", message: "Integração ativa."});
        } 

        return NextResponse.json({status:"unhealthy", message: "Integração inativa."}, {status: 503});
    }
}
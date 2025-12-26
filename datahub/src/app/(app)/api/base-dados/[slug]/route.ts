import { BaseDadosError } from "@/features/base-dados/exceptions/base-dados-error";
import { retornaBaseDados } from "@/features/base-dados/services/retorna-base-dados";
import { NextResponse } from "next/server";

export const GET = async (request: Request, { params }: { params: { slug: string } }) => {

    const path = process.env.APP_URL!;
    const from = request.headers.get("x-requested-by");

    if (from !== "nextjs-client") {
        return NextResponse.redirect(`${path}/base-dados`, 303);
    }

    const { slug } = await params;

    try{
        const baseDados = await retornaBaseDados({ id: slug });
        return NextResponse.json(baseDados);
    }catch(error: unknown){
        if(error instanceof BaseDadosError){
            return NextResponse.json({ status: error.code, message: error.message, validacao: error.validacao }, { status: 400 });
        }

        return NextResponse.json({ status: 'ERROR', message: "Erro interno de servidor" }, { status: 500 });

    }
};
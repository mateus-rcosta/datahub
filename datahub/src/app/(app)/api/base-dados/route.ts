import { NextRequest, NextResponse } from 'next/server';

//lib
import { retornaPayloadSemDescriptografar } from '@/lib/sessao';

//types
import { retornaBasesDados } from '@/features/base-dados/services/retorna-bases-dados';
import { criaBaseDeDados } from '@/features/base-dados/services/cria-base-dados';
import { BaseDadosError, BaseDadosErrorType } from '@/features/base-dados/exceptions/base-dados-error';
import { SessaoErrorType } from '@/lib/sessao-error';
import { env } from '@/lib/env';

const TIPOS_PERMITIDOS = ['text/csv', 'application/vnd.ms-excel', 'text/comma-separated-values', 'application/csv'];

export async function POST(request: NextRequest) {
    request.headers.values().map(h => console.log(h))
    const form = await request.formData();
    const csv = form.get('arquivo') as File;

    const usuarioId = await retornaPayloadSemDescriptografar().then((payload) => payload?.usuarioId);

    if (!usuarioId) {
        return NextResponse.json({ status: SessaoErrorType.USUARIO_NAO_LOGADO, message: 'Usuário não logado.' }, { status: 401 });
    }

    if (!csv || csv.size === 0) {
        return NextResponse.json({ status: BaseDadosErrorType.CSV_INVALIDO, message: 'Arquivo inválido.' }, { status: 400 });
    }

    if (!TIPOS_PERMITIDOS.includes(csv.type)) {
        return NextResponse.json({ status: BaseDadosErrorType.CSV_INVALIDO, message: 'Apenas arquivos CSV são permitidos.' }, { status: 400 });
    }

    try {
        await criaBaseDeDados({ csv, nome: form.get('nome') as string, usuarioId });
        return NextResponse.json({ status: 'ok' });

    } catch (error: unknown) {
        if (error instanceof BaseDadosError){
            if(error.code === BaseDadosErrorType.CSV_INVALIDO || error.code === BaseDadosErrorType.CSV_SEM_COLUNAS_OBRIGATORIAS) {
                return NextResponse.json({ status: error.code, message: error.message, validacao: error.validacao }, { status: 400 });
            }
        }else if(error instanceof Error){
            return NextResponse.json({ status: 'ERROR', message: "Erro interno de servidor" }, { status: 500 });
        }else{
            return NextResponse.json({ status: 'ERROR', message: "Erro interno de servidor" }, { status: 500 });
        }
    }

}

export async function GET(request: NextRequest) {
    const path = env.APP_URL;
    const from = request.headers.get("x-requested-by");

    if (from !== "nextjs-client") {
        return NextResponse.redirect(`${path}/base-dados`, 303);
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

    const resultado = await retornaBasesDados({ pesquisa, page, limit });

    return new NextResponse(
        JSON.stringify({ dados: resultado.dados, hasNext: resultado.hasNext, hasPrevious: resultado.hasPrevious, limit, page, total: resultado.total }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 },
    );
}

import { apenasNumeros, formataTelefone } from "@/helper/formatador";
import { prisma } from "@/lib/database";
import { LinhaCsv, PostCliente } from "@/types/types";
import { InputJsonValue } from "@prisma/client/runtime/client";
import Papa from "papaparse";
import z from "zod";
import { BaseDadosError, BaseDadosErrorType } from "../exceptions/base-dados-error";

interface CriaBaseDeDadosProps {
    csv: File;
    nome: string;
    usuarioId: string;
}
export const criaBaseDeDados = async ({ csv, nome, usuarioId}: CriaBaseDeDadosProps) => {
    const text = await csv.text();

    // parse do cabeçalho
    const parsedHeader = Papa.parse(text, {
        header: true,
        preview: 1,
        skipEmptyLines: true,
    });

    const colunasObrigatorias: string[] = [];
    const mapaColunas = new Map<'telefone' | 'whatsapp' | 'email', string>();

    const colunas = parsedHeader.meta.fields?.map((coluna) => {
        const normalizada = coluna.toLowerCase().trim();

        if (normalizada === 'telefone' || normalizada === 'whatsapp' || normalizada === 'email') {
            colunasObrigatorias.push(normalizada);
            mapaColunas.set(normalizada, coluna);
            return normalizada;
        }

        return coluna;
    }) ?? [];

    if (colunasObrigatorias.length === 0) {
        throw new BaseDadosError(BaseDadosErrorType.CSV_SEM_COLUNAS_OBRIGATORIAS, 'O CSV nao possui colunas obrigatorias para validacao.');
        //return NextResponse.json({ status: "error", message: 'O CSV não possui colunas obrigatórias para validação.' }, { status: 400 });
    }

    // cria a base de dados
    const baseDeDadosId = await prisma.baseDeDados.create({
        data: {
            nome,
            estrutura: colunas,
            usuarioId,
        },
        select: { id: true },
    });

    // faz o parse completo
    const clientes = Papa.parse<LinhaCsv>(text, {
        header: true,
        skipEmptyLines: true,
    });

    if (clientes.errors.length > 0) {
        throw new BaseDadosError(BaseDadosErrorType.CSV_INVALIDO, 'O CSV esta invalido, verifique-o e tente novamente.');
        //return NextResponse.json({ status: 500 });
    }

    // Valida e normaliza os dados
    const clientesValidados: PostCliente[] = [];

    clientes.data.forEach((linha) => {
        const validacao: Record<string, boolean> = {};
        const dadosNormalizados: Record<string, unknown> = { ...linha };

        // TELEFONE
        const colunaTelefone = mapaColunas.get('telefone');
        if (colunaTelefone && colunaTelefone in linha) {
            const telefone = formataTelefone(linha[colunaTelefone]);
            validacao.telefone = telefone !== null;
            delete dadosNormalizados[colunaTelefone];
            dadosNormalizados.telefone = telefone ? telefone : linha[colunaTelefone];
        }

        // WHATSAPP
        const colunaWhatsapp = mapaColunas.get('whatsapp');
        if (colunaWhatsapp && colunaWhatsapp in linha) {
            const whatsapp = apenasNumeros(linha[colunaWhatsapp]);
            validacao.whatsapp = whatsapp.length > 0;
            delete dadosNormalizados[colunaWhatsapp];
            dadosNormalizados.whatsapp = whatsapp ? whatsapp : linha[colunaWhatsapp];
        }

        // EMAIL
        const colunaEmail = mapaColunas.get('email');
        if (colunaEmail && colunaEmail in linha) {
            const emailValido = z.email().safeParse(linha[colunaEmail]).success;
            delete dadosNormalizados[colunaEmail];
            dadosNormalizados.email = linha[colunaEmail];
            validacao.email = emailValido;
        }

        clientesValidados.push({
            dados: dadosNormalizados as InputJsonValue,
            validacao: Object.keys(validacao).length ? validacao as InputJsonValue : undefined,
            baseDeDadosId: baseDeDadosId.id,
        });
    });

    await prisma.cliente.createMany({
        data: clientesValidados,
    });
}
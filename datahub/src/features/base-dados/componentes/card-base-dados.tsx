"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarData } from "@/helper/formatador";
import CardVisualizaBaseDados from "./card-visualiza-base-dados";
import { Badge } from "@/components/ui/badge";
import CardEditaBaseDados from "./card-edita-base-dados";
import { PageParams } from "@/types/types";

interface CardBaseDadosProps {
    id: string;
    nome: string;
    clientesCount?: number;
    estrutura: string[];
    updatedAt?: string | Date;
    createdAt: string | Date;
    pageParams: PageParams;
}

export default function CardBaseDados({ id, nome, clientesCount, updatedAt, createdAt, estrutura, pageParams }: CardBaseDadosProps) {
    return (
        <Card className="h-full flex flex-col border-2 border-transparent hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            <CardHeader>
                <CardTitle className="flex flex-col gap-2 justify-between truncate">
                    <div className="flex w-full justify-between items-center gap-2">
                        <p className="font-bold truncate">{nome}</p>
                        <CardEditaBaseDados baseDadosId={id} pageParams={pageParams}/>
                    </div>
                    <Badge className="text-sm self-end" variant={"outline"} >WiFeed</Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-1">
                <p>
                    <span className="font-medium">{clientesCount ?? 0}</span> registros
                </p>

                {updatedAt && (
                    <p className="text-sm text-muted-foreground">
                        Atualizado em: {formatarData(updatedAt)}
                    </p>
                )}

                <p className="text-sm text-muted-foreground">
                    Inserido em: {formatarData(createdAt)}
                </p>
            </CardContent>

            <CardFooter>
                <CardVisualizaBaseDados baseDadosId={id} nome={nome} estrutura={estrutura} />
            </CardFooter>
        </Card>
    );
}
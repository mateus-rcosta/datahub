"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface CardBaseDadosProps{
    nome:string;
    clientesCount?:number;
    updatedAt?:Date;
    createdAt:Date;
}
export default function CardBaseDados({ nome, clientesCount, updatedAt, createdAt }: CardBaseDadosProps) {
    return (
        <Card className="h-full flex flex-col border-2 border-transparent hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            <CardHeader>
                <CardTitle className="truncate">{nome}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 space-y-1">
                <p>
                    <span className="font-medium">{clientesCount ?? 0}</span> registros
                </p>

                {updatedAt && (
                    <p className="text-sm text-muted-foreground">
                        Atualizado em: {updatedAt.toLocaleString('pt-BR')}
                    </p>
                )}

                <p className="text-sm text-muted-foreground">
                    Inserido em: { createdAt.toLocaleString('pt-BR')}
                </p>
            </CardContent>

            <CardFooter>
                <Button className="w-full" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                </Button>
            </CardFooter>
        </Card>
    );
}
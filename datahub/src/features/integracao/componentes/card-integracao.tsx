"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check,  X } from "lucide-react";
import CardConfigurar from "./card-configurar";

interface CardIntegracaoProps {
    nome: string;
    status: boolean;
    descricao: string;
    id: number
}

export default function CardIntegracao({ nome, status, descricao, id }: CardIntegracaoProps) {
    return (
        <Card className="h-full flex flex-col border-2 border-transparent hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
            <CardHeader>
                <CardTitle className="flex flex-col gap-2 justify-between">
                    <div className="flex flex-col w-full items-center gap-2">
                        <h3 className="font-bold text-xl truncate leading-relaxed">{nome}</h3>
                        <p className="text-muted-foreground text-sm">{descricao}</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex w-full items-center">
                <div className="w-full h-full flex items-center justify-center">
                    {status ?
                        <>
                            <Check className="mr-2 h-4 w-4 text-verde" />
                            <span className="text-sm font-semibold bg-verde/20 px-2 rounded-md border-verde border text-verde">
                                Conectado
                            </span>
                        </>
                        :
                        <>
                            <X className="mr-2 h-4 w-4 text-destructive" />
                            <span className="text-sm font-semibold bg-destructive/20 px-2 rounded-md border-destructive border text-destructive">
                                Desconectado
                            </span>
                        </>
                    }
                </div>
            </CardContent>
            <CardFooter>
                <CardConfigurar id={id} />
            </CardFooter>
        </Card>
    );
}
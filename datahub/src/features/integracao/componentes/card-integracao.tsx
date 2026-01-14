"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Wrench, X } from "lucide-react";
import CardConfigurar from "./card-configurar";
import { IntegracaoNome } from "@/types/types";

interface CardIntegracaoProps {
    codigo: IntegracaoNome;
    nome: string;
    status: boolean;
    descricao: string;
    configurada: boolean;
}

export default function CardIntegracao({ nome, status, descricao, configurada, codigo }: CardIntegracaoProps) {
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
            <CardContent className="flex w-full items-center justify-center min-h-12">
                <div className="flex flex-col items-center gap-2">
                    {!configurada && (
                        <div className="flex items-center text-sm font-semibold text-muted-foreground">
                            <Wrench className="mr-2 h-4 w-4" />
                            A configurar
                        </div>
                    )}
                    {status ? (
                        <div className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-verde" />
                            <span className="text-sm font-semibold bg-verde/20 px-2 rounded-md border border-verde text-verde">
                                Conectado
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <X className="mr-2 h-4 w-4 text-destructive" />
                            <span className="text-sm font-semibold bg-destructive/20 px-2 rounded-md border border-destructive text-destructive">
                                Desconectado
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <CardConfigurar nome={nome} codigo={codigo} />
            </CardFooter>
        </Card>
    );
}
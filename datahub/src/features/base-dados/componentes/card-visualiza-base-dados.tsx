"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { useState } from "react";
import TabelaClientes from "@/features/cliente/componentes/tabela-clientes";

interface CardVisualizaBaseDadosProps {
    baseDadosId: string;
    nome: string;
    estrutura: string[];
}

export default function CardVisualizaBaseDados({ baseDadosId, nome, estrutura }: CardVisualizaBaseDadosProps) {
    const [open, setOpen] = useState(false);


    return (
        <>
            <Button className="w-full" variant="outline" onClick={() => setOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] h-[90vh] sm:h-[85vh] md:h-[80vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle>
                            {nome}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <TabelaClientes
                            baseDadosId={baseDadosId}
                            estrutura={estrutura}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
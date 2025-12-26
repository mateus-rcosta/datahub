"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Columns } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";

interface SeletorColunasProps {
    colunas: string[];
    colunasSelecionadas: string[];
    onChange: (colunas: string[]) => void;
}

export default function SeletorColunas({ colunas, colunasSelecionadas, onChange }: SeletorColunasProps) {
    const [open, setOpen] = useState(false);

    const toggleColuna = (coluna: string) => {
        const novaSelecao = colunasSelecionadas.includes(coluna)
            ? colunasSelecionadas.filter(c => c !== coluna)
            : [...colunasSelecionadas, coluna];

        onChange(novaSelecao);
    };

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                <Columns className="w-4 h-auto" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Selecione as colunas</DialogTitle>
                        <DialogDescription>
                            Escolha quais colunas deseja que apareçam na tela
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-2">
                        {colunas.map(coluna => (
                            <label key={coluna}className="flex items-center gap-2">
                                <Checkbox
                                    checked={colunasSelecionadas.includes(coluna)}
                                    onCheckedChange={() => toggleColuna(coluna)}
                                />
                                {coluna}
                            </label>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

"use client";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface InputPesquisaProps {
    state: string;
    useState: (string: string) => void;
    total?: number;
    className?: string;
}
export function InputPesquisa({ state, useState, total = 0, className}: InputPesquisaProps) {
    return (
            <InputGroup className={cn("bg-white", className)}>
                <InputGroupInput placeholder="Pesquise por nome..." value={state} onChange={(e) => useState(e.target.value)} className="text-black  placeholder:text-gray-800 dark:text-white dark:placeholder:text-gray-300"/>
                <InputGroupAddon>
                    <Search className="text-black dark:text-white" />
                </InputGroupAddon>
                {total > 0 && <InputGroupAddon align="inline-end" className="text-gray-600 dark:text-gray-200">{total} resultados</InputGroupAddon>}
            </InputGroup>

    )
}
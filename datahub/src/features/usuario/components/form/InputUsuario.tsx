"use client";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";

interface InputUsuarioProps {
    state: string;
    useState: (string: string) => void;
    total?: number
}
export function InputUsuario({ state, useState, total = 0 }: InputUsuarioProps) {
    return (
            <InputGroup className="bg-white">
                <InputGroupInput placeholder="Pesquise por nome..." value={state} onChange={(e) => useState(e.target.value)} className="text-black  placeholder:text-gray-800"/>
                <InputGroupAddon>
                    <Search className="text-black" />
                </InputGroupAddon>
                {total > 0 && <InputGroupAddon align="inline-end" className="text-gray-600">{total} resultados</InputGroupAddon>}
            </InputGroup>

    )
}
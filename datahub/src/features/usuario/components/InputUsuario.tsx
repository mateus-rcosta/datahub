"use client";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";
import { useState } from "react";

interface InputUsuarioProps{
    contUsuarios?: number;
    contentUsuarios?: string;
}
export function InputUsuario({contUsuarios, contentUsuarios}:InputUsuarioProps){ 
    const[pesquisa, setPesquisa] = useState<string>('');
    return (
        <div className="">
            <InputGroup>
                <InputGroupInput placeholder="Pesquise..." value={pesquisa} onChange={(e)=>setPesquisa(e.target.value)}/>
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">{contUsuarios} resultados</InputGroupAddon>
            </InputGroup>
        </div>
    )
}
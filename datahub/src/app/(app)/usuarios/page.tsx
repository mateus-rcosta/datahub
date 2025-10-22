"use client";

import { useState } from "react";
import CardUsuario from "./_componentes/CardUsuario";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Overlay } from "@/components/layout/Overlay";
import TabelaUsuario from "./_componentes/TabelaUsuario";

export default function PageUsuarios() {
    const [abrirCard, setAbrirCard] = useState(false);

    return (
        <div className="p-6 w-full">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Usuários</h1>
                    <p className="text-sm text-gray-500">
                        Gerencie os usuários e suas permissões no sistema
                    </p>
                </div>
                <Button onClick={() => setAbrirCard(true)}>
                    <Plus className="h-4 w-4" /> Criar Usuário
                </Button>
            </div>

            <TabelaUsuario></TabelaUsuario>
            {abrirCard &&
                <Overlay onClose={() => setAbrirCard(false)}>
                    <CardUsuario onClose={() => setAbrirCard(false)}  />
                </Overlay>
            }
        </div>
    );
}

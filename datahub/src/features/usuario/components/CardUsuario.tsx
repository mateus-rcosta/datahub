"use client";

import { Button } from "@/components/ui/button";
import { Dialog,  DialogContent,  DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormUsuario from "@/features/usuario/components/FormUsuario";
import { Usuario } from "@/features/usuario/type/types";
import { PenBox, Plus } from "lucide-react";
import { useState } from "react";


interface CardUsuarioProps {
    usuario?: Usuario;
}

export default function CardUsuario({  usuario }: CardUsuarioProps) {
    const [open, setOpen] = useState(false);
    
    return (
        <>
            <Button onClick={() => setOpen(true)}>
                {!usuario && <><Plus className="h-4 w-4" /> <p>Criar Usuário</p></> || <PenBox />}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className=" max-h-[90vh] w-[90vw] md:max-w-[50vw] lg:max-w-[40vw] overflow-y-auto ">
                    <DialogHeader>
                        <DialogTitle>{usuario ? "Editar Usuário" : "Adicionar Novo Usuário"}</DialogTitle>
                    </DialogHeader>
                    <FormUsuario usuario={usuario} onClose={() => setOpen(false)}></FormUsuario>
                </DialogContent>
            </Dialog>
        </>
    );
};
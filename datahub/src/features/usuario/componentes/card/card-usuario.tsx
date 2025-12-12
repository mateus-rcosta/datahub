"use client";

import { Button } from "@/components/ui/button";
import { Dialog,  DialogContent,  DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Usuario } from "@/types/types";
import { PenBox, Plus } from "lucide-react";
import { useState } from "react";
import FormCriarUsuario from "../form/form-cria-usuario";
import FormEditarUsuario from "../form/form-edita-usuario";


interface CardUsuarioProps {
    usuario?: Usuario;
}

export default function CardUsuario({  usuario }: CardUsuarioProps) {
    const [open, setOpen] = useState(false);
    
    return (
        <>  
            {!usuario ? 
            <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" /> <p>Criar Usuário</p>
            </Button>
            :
            <Button onClick={() => setOpen(true)} variant="ghost">
                <PenBox />
            </Button>
            }
            
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className=" max-h-[90vh] w-[90vw] md:max-w-[50vw] lg:max-w-[40vw] overflow-y-auto ">
                    <DialogHeader>
                        <DialogTitle>{usuario ? "Editar Usuário" : "Adicionar Novo Usuário"}</DialogTitle>
                    </DialogHeader>
                    { !usuario ? 
                      <FormCriarUsuario onClose={() => setOpen(false)} />
                      :
                      <FormEditarUsuario onClose={() => setOpen(false)} usuario={usuario} />
                    }
                </DialogContent>
            </Dialog>
        </>
    );
};
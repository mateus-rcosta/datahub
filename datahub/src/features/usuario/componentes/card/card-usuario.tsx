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
                <DialogContent className="max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] max-h-[80vh] sm:max-h-[75vh] md:max-h-[70vh] flex flex-col h-full overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{usuario ? "Editar Usuário" : "Adicionar Novo Usuário"}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 overflow-auto py-1">
                        { !usuario ? 
                      <FormCriarUsuario onClose={() => setOpen(false)} />
                      :
                      <FormEditarUsuario onClose={() => setOpen(false)} usuario={usuario} />
                    }
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
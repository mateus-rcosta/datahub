"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usedeleteUsuario } from "../../api/deleteUsuario";
import { ApiFalha } from "@/types/types";
import { UserErrorType } from "../../exceptions/UserError";

interface ConfirmDeleteProps {
  itemName?: string;
  id: number; 
}

export default function ConfirmDelete({ itemName = "usuário", id }: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const {deleteUsuario, isPending} = usedeleteUsuario();

  

  const handleConfirm = async () => {
    const resultado = await deleteUsuario(id);
    if (resultado.success) {
      setOpen(false);
      toast.success(`Deletado com sucesso o usuário: ${itemName}`);
      return;
    }

    if (!resultado.success) {
      if(resultado.code === UserErrorType.ADMIN_NAO_PODE_SER_ALTERADO ) {
        toast.error("Erro ao deletar: usuário SUPERADMIN não pode ser deletado.");
        return;
      }
      if(resultado.code === UserErrorType.USUARIO_NAO_PODE_SE_EXCLUIR ) {
        toast.error("Erro ao deletar: você não pode se deletar.");
        return;
      }

      toast.error("Erro ao deletar: erro desconhecido.");
      return;
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <Trash2 className="h-6 w-auto text-red-500" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmação de Exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja deletar este usuário: <strong>{itemName}</strong>? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

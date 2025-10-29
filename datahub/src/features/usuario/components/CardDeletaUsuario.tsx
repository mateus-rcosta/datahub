"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deletarUsuario from "../action/deletarUsuario";

interface ConfirmDeleteProps {
  itemName?: string;
  id: number; 
}

export default function ConfirmDelete({ itemName = "usuário", id }: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Mutation para deletar usuário
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletarUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success(`${itemName} deletado com sucesso.`);
      setOpen(false);
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        toast.error(err.message || "Erro ao deletar o usuário.");
      }
    },
  });

  const handleConfirm = async () => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
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
            <Button variant="outline" onClick={() => setOpen(false)} disabled={deleteMutation.isPending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

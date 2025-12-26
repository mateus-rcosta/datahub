"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { UsuarioErrorType } from "../../exceptions/usuario-error";
import { deletaUsuarioAction } from "../../actions/deleta-usuario";
import { SessaoErrorType } from "@/lib/sessao-error";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";


interface CardDeletaUsuarioProps {
  usuarioNome?: string;
  id: string;
}

const MESSAGENS_ERRO: Partial<Record<UsuarioErrorType, string>> & Partial<Record<SessaoErrorType, string>> = {
  [UsuarioErrorType.ADMIN_NAO_PODE_SER_ALTERADO]: "Usuário SUPERADMIN não pode ser deletado.",
  [UsuarioErrorType.USUARIO_NAO_PODE_SE_EXCLUIR]: "você não pode se deletar.",
} as const;

export default function ConfirmDelete({ usuarioNome, id }: CardDeletaUsuarioProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    execute({ id });
  };

  const { execute, isExecuting } = useAcaoAutenticada(deletaUsuarioAction, {
    invalidateQueries: [["usuarios"]],
    onSuccess: () => {
      setOpen(false);
      toast.success(`Deletado com sucesso o usuário: ${usuarioNome}`);
    },
    onError: ({ serverError, validationErrors, thrownError: error }) => {
      if (validationErrors) {
        setOpen(false);
        toast.warning("Erro ao deletar o usuário. Tente novamente mais tarde.");
      }
      if (serverError) {
        const mensagemErro = MESSAGENS_ERRO[serverError as UsuarioErrorType] || "Erro desconhecido";
        setOpen(false);
        toast.warning("Erro ao deletar o usuário: " + mensagemErro);
      }
    }
  });

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
            Tem certeza que deseja deletar este funcionário: <strong>{usuarioNome}</strong>? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isExecuting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={isExecuting}>
              {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

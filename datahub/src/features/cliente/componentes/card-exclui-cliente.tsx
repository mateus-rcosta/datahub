import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";
import { toast } from "sonner";
import { ClienteErrorType } from "../exceptions/cliente-error";
import { PageParams } from "@/types/types";
import excluiCliente from "../actions/exclui-cliente";

interface CardExcluiProps {
    id: string;
    baseDeDadosId: string;
    pageParams: PageParams;
}

const MESSAGENS_ERRO: Partial<Record<ClienteErrorType, string>> = {
    [ClienteErrorType.CLIENTE_NAO_ENCONTRADO]: "Cliente não encontrado.",
} as const;

export default function CardExcluiCliente({ id, baseDeDadosId, pageParams }: CardExcluiProps) {
    const [open, setOpen] = useState(false);

    const handleConfirma = async () => {
        execute(id);
    };

    const { execute, isExecuting } = useAcaoAutenticada(excluiCliente, {
        invalidateQueries: [["clientes", pageParams.pesquisa, pageParams.page, pageParams.limit, baseDeDadosId]],
        onSuccess: () => {
            setOpen(false);
            toast.success(`Excluído com sucesso o cliente com ID: ${id}`);
        },
        onError: ({ serverError, validationErrors }) => {
            if (validationErrors) {
                console.log(validationErrors);
                setOpen(false);
                toast.warning("Erro ao excluir cliente.");
            }
            if (serverError) {
                const mensagemErro = MESSAGENS_ERRO[serverError.code as ClienteErrorType] || "Erro desconhecido";
                setOpen(false);
                toast.warning("Erro ao excluir cliente: " + mensagemErro);
            }
        }
    });

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] max-h-[80vh] sm:max-h-[75vh] md:max-h-[70vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle>ID Cliente: {id}</DialogTitle>
                    </DialogHeader>
                    <p>
                        Tem certeza que deseja deletar este cliente: <strong>{id}</strong>? Esta ação não pode ser desfeita.
                    </p>
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isExecuting}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={() => handleConfirma()} disabled={isExecuting}>
                            {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Deletar
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </>
    )
}
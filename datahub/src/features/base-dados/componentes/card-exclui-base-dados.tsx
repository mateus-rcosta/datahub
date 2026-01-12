import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";
import { toast } from "sonner";
import { PageParams } from "@/types/types";
import { BaseDadosErrorType } from "../exceptions/base-dados-error";
import { excluiBaseDadosAction } from "../actions/exclui-base-dados";

interface CardExcluiBaseDadosProps {
    id: string;
    nome: string;
    pageParams: PageParams;
    onClose: () => void;
}

const MESSAGENS_ERRO: Partial<Record<BaseDadosErrorType, string>> = {
    [BaseDadosErrorType.BASE_DE_DADOS_NAO_ENCONTRADA]: "Base de dados não encontrada.",
} as const;

export default function CardExcluiBaseDados({ id, nome, pageParams, onClose }: CardExcluiBaseDadosProps) {
    const [open, setOpen] = useState(false);

    const { execute, isExecuting } = useAcaoAutenticada(excluiBaseDadosAction, {
        invalidateQueries: [["baseDados", pageParams.pesquisa, pageParams.page, pageParams.limit]],
        onSuccess: () => {
            setOpen(false);
            onClose();
            toast.success(`Excluído com sucesso a base de dados: ${nome}`);
        },
        onError: ({ serverError, validationErrors }) => {
            if (validationErrors) {
                setOpen(false);
                onClose();
                toast.warning("Erro ao excluir base de dados.");
            }
            if (serverError) {
                const mensagemErro = MESSAGENS_ERRO[serverError.code as BaseDadosErrorType] || "Erro desconhecido";
                setOpen(false);
                onClose();
                toast.warning("Erro ao excluir base de dados: " + mensagemErro);
            }
        }
    });

    const handleConfirma = async () => {
        execute({id});
    };

    return (
        <>
            <Button type="button" variant="destructive" onClick={() => setOpen(true)} className="mr-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
            </Button>
            
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] max-h-[80vh] sm:max-h-[75vh] md:max-h-[70vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle>Base de dados: {nome}</DialogTitle>
                    </DialogHeader>
                    
                    <p>
                        Tem certeza que deseja deletar esta base de dados: <strong>{nome}</strong>? Esta ação não pode ser desfeita.
                    </p>
                    
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isExecuting}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleConfirma} disabled={isExecuting}>
                            {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Deletar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
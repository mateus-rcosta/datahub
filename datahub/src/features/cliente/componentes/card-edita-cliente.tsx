import { TextInput } from "@/components/layout/form/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { formatarData } from "@/helper/formatador";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PenBox } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { editaClienteAction } from "../actions/edita-cliente";
import { clienteSchemaEdicao } from "../schema/cliente-schema";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";
import { toast } from "sonner";
import { ClienteErrorType } from "../exceptions/cliente-error";
import { PageParams } from "@/types/types";

interface CardEditaClienteProps {
    id: string;
    baseDeDadosId: string;
    dados: Record<string, string>;
    updatedAt?: string;
    createdAt: string;
    pageParams: PageParams;
}

const MESSAGENS_ERRO: Partial<Record<ClienteErrorType, string>> = {
    [ClienteErrorType.CLIENTE_NAO_ENCONTRADO]: "Cliente não encontrado.",
} as const;

export default function CardEditaCliente({ id, dados, baseDeDadosId, updatedAt, createdAt, pageParams }: CardEditaClienteProps) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(clienteSchemaEdicao),
        defaultValues: {
            id,
            dados,
        },
    });

    const onSubmit = async (values: { id: string; dados: Record<string, string> }) => {
        execute(values);
    };

    const { execute, isExecuting } = useAcaoAutenticada(editaClienteAction, {
        invalidateQueries: [["clientes", pageParams.pesquisa, pageParams.page, pageParams.limit , baseDeDadosId]],
        onSuccess: () => {
            setOpen(false);
            toast.success(`Atualizado com sucesso o cliente com ID: ${id}`);
        },
        onError: ({ serverError, validationErrors }) => {
            if (validationErrors) {
                console.log(validationErrors);
                setOpen(false);
                toast.warning("Erro ao editar cliente.");
            }
            if (serverError) {
                const mensagemErro = MESSAGENS_ERRO[serverError.code as ClienteErrorType] || "Erro desconhecido";
                setOpen(false);
                toast.warning("Erro ao editar cliente: " + mensagemErro);
            }
        }
    });
    
    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                <PenBox className="w-4 h-4" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] max-h-[80vh] sm:max-h-[75vh] md:max-h-[70vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle>ID Cliente: {id}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-auto">
                        <div className="flex-1 min-h-0 overflow-auto px-1">
                            <FieldGroup className="flex flex-col gap-3 px-2">
                                {Object.entries(dados).map(([key]) => (
                                    <TextInput
                                        key={key}
                                        label={key}
                                        type="text"
                                        name={`dados.${key}`}
                                        control={form.control}
                                    />
                                ))}
                            </FieldGroup>
                        </div>

                        <DialogFooter className="shrink-0 border-t pt-3">
                            <div className="flex flex-col gap-2 md:flex-row w-full justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Criado em: {formatarData(createdAt)}
                                    {updatedAt && <p>Atualizado em: {formatarData(updatedAt)}</p>}
                                </div>

                                <div className="flex flex-col md:flex-row gap-2 md:w-2/3 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        className="md:w-[30%]"
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="md:w-[40%]"
                                        disabled={!form.formState.isValid || !form.formState.isDirty || isExecuting}
                                    >
                                        {isExecuting && <Loader2 className="mr-2 animate-spin" />}
                                        Salvar
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PenBox, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRetornaBaseDados } from "../api/retorna-base-dados";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldGroup } from "@/components/ui/field";
import { TextInput } from "@/components/layout/form/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseDadosVisualizacaoSchema } from "../schema/base-de-dados-schema";
import { formatarData } from "@/helper/formatador";
import { atualizaBaseDadosAction } from "../actions/atualiza-base-dados";
import { toast } from "sonner";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";
import { BaseDadosErrorType } from "../exceptions/base-dados-error";
import { PageParams } from "@/types/types";
import CardExcluiBaseDados from "./card-exclui-base-dados";

interface CardEditaBaseDadosProps {
    baseDadosId: string;
    pageParams: PageParams;
}

const MESSAGENS_ERRO: Partial<Record<BaseDadosErrorType, string>> = {
    [BaseDadosErrorType.BASE_DE_DADOS_NAO_ENCONTRADA]: "Base de dados não encontrada.",
} as const;

export default function CardEditaBaseDados({ baseDadosId, pageParams }: CardEditaBaseDadosProps) {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useRetornaBaseDados({ id: baseDadosId }, { enabled: open });

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(baseDadosVisualizacaoSchema),
        defaultValues: {
            id: baseDadosId,
            nome: "",
        },
    });

    useEffect(() => {
        if (data?.sucesso && data.dados) {
            form.reset({
                id: baseDadosId, 
                nome: data.dados.nome,
            });
        }
    }, [data, form, baseDadosId]);

   
    const nomeModificado = form.formState.dirtyFields.nome === true;

    const { execute, isExecuting } = useAcaoAutenticada(atualizaBaseDadosAction, {
        invalidateQueries: [["baseDados", pageParams.pesquisa, pageParams.page, pageParams.limit]],
        onSuccess: () => {
            toast.success("Base de dados atualizada com sucesso.");
            setOpen(false);
        },
        onError: ({ serverError, validationErrors }) => {
            if (validationErrors) {
                toast.error("Erro ao atualizar base de dados. Tente novamente mais tarde.");
            }
            if (serverError) {
                const mensagemErro = MESSAGENS_ERRO[serverError as BaseDadosErrorType] || "Erro desconhecido";
                toast.error("Erro ao atualizar base de dados: " + mensagemErro);
            }
        }
    });

    const handleSalvar = form.handleSubmit(async (formData) => {
        execute(formData);
    });

    const handleCancelar = () => {
        form.reset();
        setOpen(false);
    };

    const renderDialogContent = () => {
        if (isLoading) {
            return (
                <Skeleton className="flex w-full h-full items-center justify-center">
                    <Spinner className="size-8 animate-spin" />
                </Skeleton>
            );
        }

        if (!data?.sucesso) {
            return (
                <div className="flex flex-col w-full items-center justify-center h-full gap-4">
                    <p className="text-destructive font-semibold">
                        Erro ao carregar os dados, por favor tente novamente mais tarde.
                    </p>
                    <Button onClick={() => setOpen(false)}>Fechar</Button>
                </div>
            );
        }

        return (
            <>
                <div className="flex-1 overflow-y-auto px-2">
                    <FieldGroup className="flex flex-col gap-4">
                        <TextInput label="Nome" type="text" name="nome" control={form.control}/>

                        <div className="space-y-2 pt-4 border-t">
                            <h3 className="font-semibold text-sm">Informações</h3>
                            {data.dados.usuarioNome && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Criado por: </span>
                                    <span>{data.dados.usuarioNome}</span>
                                </div>
                            )}

                            {data.dados.clientes !== undefined && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Clientes: </span>
                                    <span>{data.dados.clientes}</span>
                                </div>
                            )}

                            <div className="text-sm">
                                <span className="text-muted-foreground">Criado em: </span>
                                <span>{formatarData(data.dados.createdAt)}</span>
                            </div>

                            {data.dados.updatedAt && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Atualizado em: </span>
                                    <span>{formatarData(data.dados.updatedAt)}</span>
                                </div>
                            )}
                        </div>

                        {data.dados.estrutura && data.dados.estrutura.length > 0 && (
                            <div className="space-y-2 pt-4 border-t">
                                <h3 className="font-semibold text-sm">Estrutura do CSV</h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.dados.estrutura.map((campo, index) => (
                                        <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                                            {campo}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </FieldGroup>
                </div>

                <DialogFooter className="shrink-0 flex-row justify-between items-center gap-2 pt-4 border-t">
                    <CardExcluiBaseDados id={data.dados.id} nome={data.dados.nome} pageParams={pageParams} onClose={() => setOpen(false)}/>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleCancelar}> 
                            Cancelar 
                        </Button>
                        <Button type="button" onClick={handleSalvar} disabled={!nomeModificado || !form.formState.isValid || isExecuting}> 
                            {isExecuting ? "Salvando..." : "Salvar Alterações"} 
                        </Button>
                    </div>
                </DialogFooter>
            </>
        );
    };

    return (
        <>
            <Button variant="ghost" onClick={() => setOpen(true)}>
                <PenBox className="h-4 w-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] h-[90vh] sm:h-[85vh] md:h-[80vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle>
                            {isLoading
                                ? "Carregando..."
                                : data?.sucesso
                                    ? data.dados.nome
                                    : "Erro ao Carregar"}
                        </DialogTitle>
                    </DialogHeader>

                    {renderDialogContent()}
                </DialogContent>
            </Dialog>
        </>
    );
}
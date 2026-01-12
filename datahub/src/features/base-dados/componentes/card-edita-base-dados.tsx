import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PenBox } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRetornaBaseDados } from "../api/retorna-base-dados";
import { Spinner } from "@/components/ui/spinner";
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
    const { data, isLoading, error, isError } = useRetornaBaseDados({ id: baseDadosId }, { enabled: open });

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(baseDadosVisualizacaoSchema),
        defaultValues: {
            id: baseDadosId,
            nome: "",
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                id: baseDadosId,
                nome: data.nome,
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
                const mensagemErro = MESSAGENS_ERRO[serverError.code as BaseDadosErrorType] || "Erro desconhecido";
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

    const conteudo = useMemo(() => {
        if (isLoading) {
            return <Spinner className="size-8 animate-spin" />;
        }

        if (isError) {
            return (
                <div className="flex flex-col items-center justify-center gap-4">
                    <p className="text-destructive font-semibold">
                        Erro ao carregar os dados
                    </p>
                    {error instanceof Error && (
                        <p className="text-sm text-muted-foreground">
                            {error.message}
                        </p>
                    )}
                    <Button onClick={() => setOpen(false)}>Fechar</Button>
                </div>
            );
        }

        if (!data) return null;

        return (
            <>
                <div className="flex-1 overflow-y-auto px-2">
                    <FieldGroup className="flex flex-col gap-4">
                        <TextInput
                            label="Nome"
                            type="text"
                            name="nome"
                            control={form.control}
                        />

                        <div className="space-y-2 pt-4 border-t">
                            <h3 className="font-semibold text-sm">Informações</h3>

                            {data.usuarioNome && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">
                                        Criado por:
                                    </span>{" "}
                                    {data.usuarioNome}
                                </div>
                            )}

                            {data.clientes !== undefined && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">
                                        Clientes:
                                    </span>{" "}
                                    {data.clientes}
                                </div>
                            )}

                            <div className="text-sm">
                                <span className="text-muted-foreground">
                                    Criado em:
                                </span>{" "}
                                {formatarData(data.createdAt)}
                            </div>

                            {data.updatedAt && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">
                                        Atualizado em:
                                    </span>{" "}
                                    {formatarData(data.updatedAt)}
                                </div>
                            )}
                        </div>

                        {data.estrutura?.length > 0 && (
                            <div className="space-y-2 pt-4 border-t">
                                <h3 className="font-semibold text-sm">
                                    Estrutura do CSV
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.estrutura.map((campo, index) => (
                                        <span key={index} className="px-3 py-1 bg-secondary rounded-md text-sm">
                                            {campo}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </FieldGroup>
                </div>

                <DialogFooter className="flex-row justify-between gap-2 pt-4 border-t">
                    <CardExcluiBaseDados
                        id={data.id}
                        nome={data.nome}
                        pageParams={pageParams}
                        onClose={() => setOpen(false)}
                    />

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancelar}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSalvar}
                            disabled={
                                !nomeModificado ||
                                !form.formState.isValid ||
                                isExecuting
                            }
                        >
                            {isExecuting ? "Salvando..." : "Salvar alterações"}
                        </Button>
                    </div>
                </DialogFooter>
            </>
        );
    }, [data, isLoading, isError, error, form, isExecuting, nomeModificado]);

    return (
        <>
            <Button variant="ghost" onClick={() => setOpen(true)}>
                <PenBox className="h-4 w-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95%] h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            {isLoading
                                ? "Carregando..."
                                : isError
                                    ? "Erro"
                                    : data?.nome}
                        </DialogTitle>
                    </DialogHeader>

                    {conteudo}
                </DialogContent>
            </Dialog>
        </>
    );
}
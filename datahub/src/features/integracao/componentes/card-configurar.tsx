"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Key, MessageSquare, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useRetornaIntegracao } from "../api/retornar-integracao-api";
import { Spinner } from "@/components/ui/spinner";
import { FieldGroup } from "@/components/ui/field";
import { TextInput } from "@/components/layout/form/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplatesUpchat } from "./templates-upchat";
import { cn } from "@/lib/utils";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { configSchema } from "../schema/integracao";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";
import { toast } from "sonner";
import editaIntegracaoUpchat from "../actions/edita-integracao";


interface CardConfigurarProps {
    id: number;
}

const nomeIntegracao = { "Upchat": "Upchat", "email": "email" };

export default function CardConfigurar({ id }: CardConfigurarProps) {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useRetornaIntegracao(id);

    const form = useForm({
        mode: "onChange",
        resolver: zodResolver(configSchema),
        defaultValues: {
            config: {},
        },
    });

    useEffect(() => {
        if (data?.sucesso) {
            form.reset({
                config: data.dados.config as unknown as Record<string, string>,
            });
        }
    }, [data, form]);

    const renderizaConteudo = () => {
        if (isLoading) {
            return (
                <Spinner className="size-8 animate-spin m-4" />
            );
        }

        if (data?.sucesso) {
            const integracao = data.dados;
            const config = integracao.config;

            const temTemplates = 'templates' in config && Array.isArray(config.templates);

            return (
                <Tabs defaultValue="api" className="flex-1 overflow-hidden flex flex-col w-full">
                    <TabsList className={cn("inline-flex w-full gap-1 bg-muted p-1 rounded-lg mb-4 ", !temTemplates && "hidden")}>
                        <TabsTrigger value="api" className="gap-2 px-3">
                            <Key className="h-4 w-4" />
                            API
                        </TabsTrigger>
                        <TabsTrigger value="templates" className="gap-2 px-3">
                            <MessageSquare className="h-4 w-4" />
                            Templates
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="api" className="flex-1 overflow-auto">
                        <FieldGroup className="flex flex-col gap-3">
                            {Object.entries(config).filter(([key]) => key !== 'templates').map(([key]) => (
                                <TextInput
                                    key={key}
                                    label={key}
                                    type="text"
                                    name={`config.${key}`}
                                    control={form.control}
                                />

                            ))}
                        </FieldGroup>
                    </TabsContent>

                    <TabsContent value="templates" className="flex-1 overflow-auto">
                        <FormProvider {...form}>
                            {nomeIntegracao.Upchat === integracao.nome ?
                                <TemplatesUpchat control={form.control} /> :
                                "aaa"
                            }
                        </FormProvider>

                    </TabsContent>
                </Tabs>
            )
        }
    }

    const { execute, isExecuting } = useAcaoAutenticada(editaIntegracaoUpchat,
        {
            onError: (error) => {
                if (error instanceof Error) {
                    toast.error(`Erro ao salvar configuração: ${error.message}`);
                }
                toast.error("Erro ao salvar configuração.");
            },
            onSuccess: () => {
                toast.success("Configuração salva com sucesso.");
            }
        }
    )

    const handleSalvar = form.handleSubmit(async (formData) => {
        try {
            console.log("Dados para salvar:", formData);
            execute({ id: Number(id), config: formData.config });
            setOpen(false);
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    });

    return (
        <>
            <Button className="w-full" variant="outline" onClick={() => setOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Configurar
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] h-[90vh] sm:h-[85vh] md:h-[80vh] flex flex-col">
                    <DialogHeader className="shrink-0 border-b pb-3">
                        <DialogTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-muted-foreground" />
                            {isLoading ? "Carregando..." : `Configurar: ${data?.sucesso ? data.dados.nome : "Erro ao carregar os dados"}`}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Ajuste os parâmetros da integração conforme necessário.
                        </p>
                    </DialogHeader>
                    {renderizaConteudo()}
                    <DialogFooter className="flex flex-col border-t pt-2 gap-3">
                        <span className="text-sm text-muted-foreground w-full">
                        </span>

                        <div className="flex flex-col w-full md:flex-row gap-2">
                            <Button type="button" variant="outline" className="w-full md:flex-5/12" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>

                            <Button type="button" onClick={handleSalvar} disabled={!form.formState.isDirty || isExecuting || !form.formState.isValid } className="w-full md:flex-6/12">
                                {isExecuting ? <Spinner className="mr-2 h-4 w-4 spin-in" /> : null}
                                Salvar
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
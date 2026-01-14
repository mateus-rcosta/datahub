"use client";

import { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { TextInput } from "@/components/layout/form/form";
import { upchatSchema } from "../../schema/integracao";
import { Integracao, IntegracaoDados } from "@/types/types";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";
import { editaIntegracaoAction } from "../../actions/edita-integracao";
import { BaseFormProps, FormHandle } from ".";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplatesUpchat } from "../templates/templates-upchat";
import { getQueryClient } from "@/lib/react-query";
import z from "zod";

export const UpchatForm = forwardRef<FormHandle, BaseFormProps>(
    ({ config, integracaoNome, onStatusChange }, ref) => {
        const queryClient = getQueryClient();
        
        const configTratada = config as z.input<typeof upchatSchema>;

        const form = useForm<z.input<typeof upchatSchema>>({
            mode: "onChange",
            resolver: zodResolver(upchatSchema),
            defaultValues: {
                url: configTratada?.url || "",
                queueId: configTratada?.queueId || 0,
                templates: configTratada?.templates || [],
                apiKey: "",
            },
        });

        const { execute, isExecuting } = useAcaoAutenticada(editaIntegracaoAction, {
            onError: (error) => {
                const mensagem = error.serverError?.message || "Erro ao atualizar configuração";
                toast.error(mensagem);
            },
            onSuccess: () => {
                toast.success("Configuração salva com sucesso.");
                const parsedConfig = upchatSchema.parse(form.getValues());
                queryClient.setQueryData<Integracao<IntegracaoDados>>(["integracoes", integracaoNome], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        config: parsedConfig,
                    }

                });
                queryClient.setQueryData<Integracao<IntegracaoDados>[]>(["integracoes"], (old) => {
                    if (!old) return old;
                    return old.map((integracao) => {
                        if (integracao.nome === integracaoNome) {
                            return {
                                ...integracao,
                                status: integracao.status,
                                configurada: true,
                            };
                        }
                        return integracao;
                    });
                });
            },
        });

        useEffect(() => {
            form.reset({
                ...config as z.input<typeof upchatSchema>,
                apiKey: ""
            }, {
                keepDirtyValues: true,
            });
        }, [config, form]);

        const { isDirty, isValid } = form.formState;

        useEffect(() => {
            onStatusChange({ isDirty, isValid, isExecuting });
        }, [isDirty, isValid, isExecuting, onStatusChange]);

        useImperativeHandle(ref, () => ({
            submit: form.handleSubmit((data) => {
                execute({ nome: integracaoNome, config: data });
            }),
        }));

        return (
            <FormProvider {...form}>
                <Tabs defaultValue="api" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="shrink-0 w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-4 mb-4">
                        <TabsTrigger value="api" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-2">
                            Configuração API
                        </TabsTrigger>
                        <TabsTrigger value="templates" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-2">
                            Templates
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="api" className="flex-1 overflow-auto focus-visible:ring-0 mt-0">
                        <FieldGroup className="flex flex-col gap-3 p-1">
                            <TextInput label="URL" type="text" name="url" control={form.control} />
                            <TextInput label="API Key" type="password" name="apiKey" placeholder="********" control={form.control} />
                            <TextInput label="Queue ID" type="number" name="queueId" control={form.control} />
                        </FieldGroup>
                    </TabsContent>

                    <TabsContent value="templates" className="flex-1 overflow-auto focus-visible:ring-0 mt-0">
                        <TemplatesUpchat control={form.control} />
                    </TabsContent>
                </Tabs>
            </FormProvider>
        );
    }
);

UpchatForm.displayName = "UpchatForm";
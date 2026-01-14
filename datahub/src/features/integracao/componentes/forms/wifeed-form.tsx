"use client";

import { forwardRef, useImperativeHandle, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { TextInput } from "@/components/layout/form/form";
import { wifeedSchema } from "../../schema/integracao";
import { Integracao, IntegracaoDados } from "@/types/types";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";
import { editaIntegracaoAction } from "../../actions/edita-integracao";
import { BaseFormProps, FormHandle } from ".";
import { getQueryClient } from "@/lib/react-query";
import z from "zod";

export const WifeedForm = forwardRef<FormHandle, BaseFormProps>(
    ({ config, integracaoNome, onStatusChange }, ref) => {
        const queryClient = getQueryClient();

        const configTratada = config as z.input<typeof wifeedSchema>;
        
        const form = useForm<z.input<typeof wifeedSchema>>({
            mode: "onChange",
            resolver: zodResolver(wifeedSchema),
            defaultValues: {
                clientId: configTratada?.clientId || "" ,
                url: configTratada?.url || "",
                clientSecret: "",
            },
        });

        const { execute, isExecuting } = useAcaoAutenticada(editaIntegracaoAction, {
            onError: (error) => {
                const mensagem = error.serverError?.message || "Erro ao atualizar configuração";
                toast.error(mensagem);
            },
            onSuccess: () => {
                toast.success("Configuração salva com sucesso.");
                const parsedConfig = wifeedSchema.parse(form.getValues());
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
                <FieldGroup className="flex flex-col gap-3 p-1">
                    <TextInput label="URL" type="text" name="url" control={form.control} />
                    <TextInput label="clientId" type="text" name="clientId" control={form.control} />
                    <TextInput label="clientSecret" type="password" name="clientSecret" placeholder="********" control={form.control} />
                </FieldGroup>
            </FormProvider >
        );
    }
);

WifeedForm.displayName = "WifeedForm";
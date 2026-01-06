"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { baseDeDadosSchema } from "../schema/base-de-dados-schema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { TextInput } from "@/components/layout/form/form";
import Papa from "papaparse";
import { cn } from "@/lib/utils";
import { useAdicionaBaseDados } from "../api/adiciona-base-dados";
import { toast } from "sonner";

const colunasObrigatorias = ['telefone', 'whatsapp', 'email'];
export default function FormCriaBaseDados() {
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof baseDeDadosSchema>>({
        resolver: zodResolver(baseDeDadosSchema),
        mode: "onChange",
        defaultValues: {
            nome: "",
            estrutura: [],
        },
    });

    useEffect(() => {
        form.reset();
    }, [open]);
    const { isDirty, isValid } = form.formState;

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | null) => void) {
        const file = event.target.files?.[0];
        if (!file) return;

        onChange(file);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            preview: 5,

            complete: (result) => {
                const colunas = result.meta.fields;

                if (!colunas || colunas.length === 0) {
                    form.setError("arquivo", {
                        type: "manual",
                        message: "O CSV não possui cabeçalho válido",
                    });
                    return;
                }
                const colunasEncontradas: string[] = [];

                for (const coluna of colunas) {
                    if (colunasObrigatorias.includes(coluna.toLowerCase().trim())) {
                        colunasEncontradas.push(coluna.toLowerCase().trim());
                    }
                }
                if (colunasEncontradas.length === 0) {
                    form.setError("arquivo", {
                        type: "manual",
                        message: "O CSV não possui colunas obrigatorias para validação.",
                    });
                    return;
                }

                form.clearErrors("arquivo");

                form.setValue("estrutura", colunas, {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            },

            error: () => {
                form.setError("arquivo", {
                    type: "manual",
                    message: "O arquivo não é um CSV válido",
                });
            },
        });
    }

    const { adicionaBaseDados, isPending } = useAdicionaBaseDados();

    const handleSubmit = form.handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            formData.append('nome', data.nome);
            formData.append('arquivo', data.arquivo);

            const { sucesso } = await adicionaBaseDados(formData);
            if (sucesso) {
                toast.success('Base de dados criada com sucesso!');
                setOpen(false);

            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error('Erro ao criar a base de dados: ' + error.message);
            }
        }
    });

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" /> <p>Criar Base de Dados</p>
            </Button>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogContent className=" max-h-[90vh] w-[90vw] md:max-w-[50vw] lg:max-w-[40vw] overflow-y-auto " >
                    <DialogHeader>
                        <DialogTitle>Criar Base de Dados </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <FieldSet>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-black dark:text-gray-300">Informações Básicas</h3>
                            </div>
                            <FieldGroup className="flex-col">
                                <TextInput
                                    label="Nome da base"
                                    type="text"
                                    name="nome"
                                    control={form.control}
                                />

                                <Controller name="arquivo" control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel htmlFor={field.name} className="text-lg">Selecione o arquivo</FieldLabel>
                                            <Input id={field.name} onChange={(e) => handleFileChange(e, field.onChange)} aria-invalid={fieldState.invalid} placeholder="Selecione o arquivo" type="file" accept=".csv" className={cn("w-full")} />
                                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                        </Field>

                                    )}
                                />
                            </FieldGroup>
                        </FieldSet>
                        <div className="flex gap-2 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 bg-white"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex-1 font-semibold" disabled={!isDirty || !isValid}>
                                {isPending && <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando</>}
                                {!isPending && <p>Enviar</p>}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
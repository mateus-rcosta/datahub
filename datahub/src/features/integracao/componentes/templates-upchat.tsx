"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { IntegracaoJSONBUpchatTemplate } from "@/types/types";

interface TemplatesUpchatProps {
    control: Control<any>;
}

export function TemplatesUpchat({ control }: TemplatesUpchatProps) {
    const { register, formState, setValue, watch } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "config.templates",
    });

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="shrink-0 flex items-center justify-between px-2 pb-4">
                <div>
                    <h3 className="font-semibold">Templates de Mensagem</h3>
                    <p className="text-sm text-muted-foreground">
                        Configure os templates disponíveis para envio
                    </p>
                </div>

                <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                        append({
                            id: "",
                            nome: "",
                            texto: "",
                            tipo: "UTILITY",
                        } as IntegracaoJSONBUpchatTemplate)
                    }
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                </Button>
            </div>

            <div className="flex-1 min-h-0 overflow-auto px-1">
                {fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg mx-2">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                            Nenhum template configurado
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                append({
                                    id: "",
                                    nome: "",
                                    texto: "",
                                    tipo: "UTILITY",
                                })
                            }
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Template
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 px-2">
                        {fields.map((field, index) => {
                            const configErrors = formState.errors?.config as any;
                            const errors = configErrors?.templates?.[index];

                            return (
                                <div
                                    key={field.id}
                                    className="p-4 border rounded-lg space-y-4 relative"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge variant="outline">Template</Badge>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>ID do Template</Label>
                                            <Input {...register(`config.templates.${index}.id`)} placeholder="template_id"/>
                                            {errors?.id && (
                                                <p className="text-sm text-destructive">
                                                    {errors.id.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Nome</Label>
                                            <Input
                                                {...register(`config.templates.${index}.nome`)}
                                                placeholder="Nome do template"
                                            />
                                            {errors?.nome && (
                                                <p className="text-sm text-destructive">
                                                    {errors.nome.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tipo</Label>
                                        <Select
                                            value={watch(`config.templates.${index}.tipo`)}
                                            onValueChange={(value) => {
                                                setValue(
                                                    `config.templates.${index}.tipo`,
                                                    value as 'MARKETING' | 'UTILITY',
                                                    { shouldValidate: true, shouldDirty: true }
                                                );
                                            }}
                                        >
                                            <SelectTrigger className="bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UTILITY">Utilidade</SelectItem>
                                                <SelectItem value="MARKETING">Marketing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Texto do Template</Label>
                                        <Textarea
                                            {...register(`config.templates.${index}.texto`)}
                                            placeholder="Digite o conteúdo do template..."
                                            rows={4}
                                            className="resize-none bg-white"
                                        />
                                        {errors?.texto && (
                                            <p className="text-sm text-destructive">
                                                {errors.texto.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
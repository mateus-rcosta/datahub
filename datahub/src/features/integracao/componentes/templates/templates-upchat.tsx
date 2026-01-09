"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { IntegracaoJSONBUpchatTemplate } from "@/types/types";
import { TextInput } from "@/components/layout/form/form";

interface TemplatesUpchatProps {
    control: Control<any>;
}

export function TemplatesUpchat({ control }: TemplatesUpchatProps) {
    const { register, formState, setValue, watch } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "templates",
    });

    return (
        <div className="h-full flex flex-col">
            <div className="shrink-0 flex items-center justify-between px-2 pb-4">
                <div>
                    <h3 className="font-semibold text-lg">Templates de Mensagem</h3>
                    <p className="text-sm text-muted-foreground">Configure os templates disponíveis para envio</p>
                </div>
                <Button type="button" size="sm" onClick={() => append({ nome: "",  texto: "",  tipo: "UTILITY" } as IntegracaoJSONBUpchatTemplate)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                </Button>
            </div>

            {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg mx-2 bg-muted/10">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                        Nenhum template configurado
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ nome: "", texto: "", tipo: "UTILITY" })}>
                        <Plus className="h-4 w-4 mr-2" />
                        Começar agora
                    </Button>
                </div>
            ) : (
                <div className="space-y-6 px-2 pb-6">
                    {fields.map((field, index) => {
                        const errors = (formState.errors?.templates as any)?.[index];
                        
                        return (
                            <div key={field.id} className="p-4 border rounded-xl space-y-4 relative bg-card shadow-md">
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="font-mono">
                                        #{index + 1}
                                    </Badge>
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextInput
                                        label="ID do Template"
                                        name={`templates.${index}.id`}
                                        control={control}
                                        placeholder="ex: boas_vindas_v1"
                                        className="bg-background"
                                    />
                                    <TextInput
                                        label="Nome de Exibição"
                                        name={`templates.${index}.nome`}
                                        control={control}
                                        placeholder="ex: Boas Vindas"
                                        className="bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tipo de Conteúdo</Label>
                                    <Select
                                        value={watch(`templates.${index}.tipo`)}
                                        onValueChange={(value) => {
                                            setValue(
                                                `templates.${index}.tipo`,
                                                value as 'MARKETING' | 'UTILITY',
                                                { shouldValidate: true, shouldDirty: true }
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UTILITY">
                                                Utilidade (Transacional)
                                            </SelectItem>
                                            <SelectItem value="MARKETING">
                                                Marketing (Promocional)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Mensagem</Label>
                                    <Textarea
                                        {...register(`templates.${index}.texto`)}
                                        placeholder="Digite a mensagem do template"
                                        rows={3}
                                        className="resize-none bg-background focus-visible:ring-1"
                                    />
                                    {errors?.texto && (
                                        <p className="text-[0.8rem] font-medium text-destructive">
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
    );
}
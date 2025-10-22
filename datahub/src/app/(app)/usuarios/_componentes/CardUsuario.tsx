"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usuarioEditarSchema, usuarioSchema } from "../_schemas/UsuarioSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Database, File, KeySquare, Loader2, Send, Settings, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import criarUsuario from "../_actions/criarUsuario";
import { JsonValue } from "@prisma/client/runtime/library";
import atualizarUsuario from "../_actions/atualizarUsuario";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    admin: boolean;
    permissoes: JsonValue;
    createdAt: Date | null;
    updatedAt: Date | null;
}
interface CardUsuarioProps {
    usuario?: Usuario;
    onClose: () => void;
}

export default function CardUsuario({ onClose, usuario }: CardUsuarioProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState<string>("");

    const permissoes = usuario?.permissoes as {
        editar_base_dados?: boolean;
        visualizar_relatorios?: boolean;
        editar_campanhas?: boolean;
        editar_integracoes?: boolean;
    } | undefined;

    const form = useForm<z.infer<typeof usuarioEditarSchema>>({
        resolver: zodResolver(usuario ? usuarioEditarSchema : usuarioSchema),
        defaultValues: {
            nome: usuario?.nome || "",
            email: usuario?.email || "",
            senha: "", 
            admin: usuario?.admin || false,
            editar_base_dados: permissoes?.editar_base_dados || false,
            visualizar_relatorios: permissoes?.visualizar_relatorios || false,
            editar_campanhas: permissoes?.editar_campanhas || false,
            editar_integracoes: permissoes?.editar_integracoes || false,
        },
    });

    useEffect(() => {
        form.setValue("editar_base_dados", form.watch("admin"));
        form.setValue("editar_campanhas", form.watch("admin"));
        form.setValue("editar_integracoes", form.watch("admin"));
        form.setValue("visualizar_relatorios", form.watch("admin"));
    }, [form.watch("admin")])


    const onSave = async (data: z.infer<typeof usuarioEditarSchema>) => {
        setIsLoading(true);
        try {
            if (usuario) {
                // edição
                await atualizarUsuario({
                    id: usuario.id,
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha || undefined, 
                    admin: data.admin,
                    editar_base_dados: data.editar_base_dados,
                    visualizar_relatorios: data.visualizar_relatorios,
                    editar_campanhas: data.editar_campanhas,
                    editar_integracoes: data.editar_integracoes,
                });
            } else {
                await criarUsuario({
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha!,
                    admin: data.admin,
                    editar_base_dados: data.editar_base_dados,
                    visualizar_relatorios: data.visualizar_relatorios,
                    editar_campanhas: data.editar_campanhas,
                    editar_integracoes: data.editar_integracoes,
                });
            }
            onClose();
        } catch (error: any) {
            setErro(error.message || "Erro ao salvar usuário");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className=" max-h-[90vh] max-w-[80vw] md:max-w-[50vw] lg:max-w-[40vw] overflow-y-auto">
            <CardHeader>
                <CardTitle>
                    <h2 className="text-xl font-semibold">
                        {usuario ? "Editar Usuário" : "Adicionar Novo Usuário"}
                    </h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSave)} className="space-y-2">
                            <div className="flex flex-row items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-black m-0 p-0" />
                                <h3 className="text-lg font-medium text-black self-center">Informações Básicas</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome" {...field} />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-sm text-red-600" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="admin"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Administrador</FormLabel>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage className="mt-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormItem className="flex flex-col">
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="E-mail"
                                            value={usuario ? usuario.email : form.watch("email")}
                                            disabled={!!usuario}
                                            {...(!usuario ? form.register("email") : {})}
                                        />
                                    </FormControl>
                                    <FormMessage className="mt-1 text-sm text-red-600" />
                                </FormItem>
                                <FormField
                                    control={form.control}
                                    name="senha"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Senha" {...field} type="password" />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-sm text-red-600" />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <Separator />
                            {/* Permissões do Sistema */}
                            <div className="flex flex-row items-center gap-2 mb-2">
                                <KeySquare className="h-5 w-5 text-black m-0 p-0" />
                                <h3 className="text-lg font-medium text-black self-center">Permissões do Sistema</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                {/* Permissão para criar, editar e excluir dados na base de dados do sistema */}
                                <div className="flex flex-col gap-4 bg-background rounded-lg p-4 ">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-row items-center gap-2">
                                            <Database className="h-4 w-4 text-black m-0 p-0" />
                                            <h4 className="text-md font-medium text-black self-center">Editar Base de Dados</h4>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="editar_base_dados"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={form.watch("admin")} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Permissão para criar, editar e excluir dados na base de dados do sistema
                                    </p>
                                </div>
                                {/* Permissão para criar, editar e excluir dados na base de dados do sistema */}
                                <div className="flex flex-col gap-4 bg-background rounded-lg p-4 ">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-row items-center gap-2">
                                            <File className="h-4 w-4 text-black m-0 p-0" />
                                            <h4 className="text-md font-medium text-black self-center">Visualizar Relatórios</h4>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="visualizar_relatorios"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={form.watch("admin")} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Permite acessar e gerar relatórios do sistema
                                    </p>
                                </div>
                                {/* Permissão para criar, editar e excluir campanhas */}
                                <div className="flex flex-col gap-4 bg-background rounded-lg p-4 ">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-row items-center gap-2">
                                            <Send className="h-4 w-4 text-black m-0 p-0" />
                                            <h4 className="text-md font-medium text-black self-center">Editar Campanhas</h4>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="editar_campanhas"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={form.watch("admin")} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Permite criar, editar e gerenciar campanhas
                                    </p>
                                </div>
                                {/* Permissão para criar, editar e excluir campanhas */}
                                <div className="flex flex-col gap-4 bg-background rounded-lg p-4 ">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-row items-center gap-2">
                                            <Settings className="h-4 w-4 text-black m-0 p-0" />
                                            <h4 className="text-md font-medium text-black self-center">Editar Integrações</h4>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="editar_integracoes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={form.watch("admin")} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Permite configurar e gerenciar integrações com sistemas externos
                                    </p>
                                </div>
                            </div>
                            {/* Aviso de admin*/}
                            {form.watch("admin") && (
                                <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        <strong>Administradores</strong> possuem acesso total ao sistema e não podem ter suas permissões individuais modificadas.
                                    </p>
                                </div>
                            )}
                            <div className="w-full flex gap-2 mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-black text-black flex-1"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" className="flex-1">
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Salvar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardDescription>
            </CardContent>
        </Card>
    );
};
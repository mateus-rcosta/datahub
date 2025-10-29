"use client";

import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import CardUsuario from "@/features/usuario/components/CardUsuario";
import ConfirmDelete from "./CardDeletaUsuario";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import retornarUsuarios from "../action/retornarUsuarios";
import { Usuario } from "../type/types";
import { Database, File, Send, Settings, Shield, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import mudarStatusUsuario from "../action/mudarStatusUsuario";
import { toast } from "sonner";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { InputUsuario } from "./InputUsuario";

export default function TabelaUsuario() {

    const queryClient = useQueryClient();

    // Query para buscar usuários
    const { data: usuarios = [], isLoading } = useQuery<Usuario[]>({
        queryKey: ["usuarios"],
        queryFn: () => retornarUsuarios(),
    });

    const atualizarStatus = useMutation({
        mutationFn: (id: number) => mudarStatusUsuario(id),

        onError: (err: unknown, id: number) => {
            toast.error(
                err instanceof Error
                    ? err.message
                    : `Erro ao mudar status de acesso do usuário com id: ${id}.`
            );
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        },

        onSuccess: (_, id: number) => {
            toast.success(`Status alterado com sucesso do usuário com id: ${id}.`);
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        },
    });

    return (
        <div className="flex flex-col gap-4 px-6 py-4">
            <div className="flex flex-row justify-end gap-2">
                <InputUsuario />
                <CardUsuario />
            </div>
            <Table className="border-1 rounded-lg">
                <TableCaption>Lista de Usuários</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[5%] font-semibold">Id</TableHead>
                        <TableHead className="w-[30%] font-semibold">Nome</TableHead>
                        <TableHead className="w-[30%] font-semibold">E-mail</TableHead>
                        <TableHead className="w-[15%] font-semibold">Função</TableHead>
                        <TableHead className="w-[10%] font-semibold">Permissões</TableHead>
                        <TableHead className="w-[5%] font-semibold">Ativo</TableHead>
                        <TableHead className="w-[10%] font-semibold">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={3}>Carregando...</TableCell>
                        </TableRow>
                    ) : (
                        usuarios.map((usuario: Usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.id}</TableCell>
                                <TableCell><span>{usuario.nome.length > 20 ? `${usuario.nome.substring(0, 20)}...` : usuario.nome}</span></TableCell>
                                <TableCell><span>{usuario.email.length > 20 ? `${usuario.email.substring(0, 20)}...` : usuario.email}</span></TableCell>
                                <TableCell>
                                    {usuario.admin ?
                                        <div className="flex w-full gap-2 bg-primary text-white font-semibold items-center  px-1 pt-0.5 pb-1 justify-center rounded-lg ">
                                            <Shield className="h-5 w-5" />
                                            <span>Administrador</span>
                                        </div>
                                        :
                                        <div className="flex w-full gap-2 bg-transparent text-black font-semibold items-center  px-1 pt-0.5 pb-1 justify-center rounded-lg ">
                                            <User className="h-5 w-5" />
                                            <span>Usuário</span>
                                        </div>
                                    }
                                </TableCell>
                                <TableCell className="flex gap-1">
                                    {usuario.permissoes.editar_base_dados &&
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Database className="h-full w-auto text-blue-600" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Editar base de dados</span>
                                            </TooltipContent>
                                        </Tooltip>

                                    }
                                    {usuario.permissoes.editar_campanhas &&
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <File className="h-full w-auto text-green-600" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Visualizar relatórios</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    }
                                    {usuario.permissoes.editar_integracoes &&
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Send className="h-full w-auto text-purple-600" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Editar campanhas</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    }
                                    {usuario.permissoes.visualizar_relatorios &&
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Settings className="h-full w-auto text-orange-600" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>Editar integrações</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    }
                                </TableCell>
                                <TableCell>
                                    <Switch checked={usuario.ativo} onCheckedChange={() => { atualizarStatus.mutate(usuario.id) }} className="max-w-8 data-[state=unchecked]:bg-black" />
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <CardUsuario usuario={usuario} />
                                    <ConfirmDelete itemName={usuario.nome} id={usuario.id} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

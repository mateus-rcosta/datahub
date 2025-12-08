"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Database, File, Send, Settings, Shield, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import CardUsuario from "../card/CardUsuario";
import ConfirmDelete from "../card/CardDeletaUsuario";
import SwitchUsuario from "../form/SwitchUsuario";
import { Usuario } from "@/types/types";


const permissoes = [
    {
        key: "editar_base_dados",
        label: "Editar base de dados",
        icon: Database,
        className: "h-full text-black",
    },
    {
        key: "editar_campanhas",
        label: "Editar campanhas",
        icon: File,
        className: "h-full text-black",
    },
    {
        key: "editar_integracoes",
        label: "Editar integrações",
        icon: Send,
        className: "h-full text-black",
    },
    {
        key: "visualizar_relatorios",
        label: "Visualizar relatórios",
        icon: Settings,
        className: "h-full text-black",
    },
];


export const columns: ColumnDef<Usuario>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="w-full inline-flex items-center justify-center gap-2 cursor-pointer font-bold">
                    <span>ID</span>
                    <ArrowUpDown className="h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) => <span className="flex justify-center text-black font-semibold">{row.original.id}</span>,
    },
    {
        accessorKey: "nome",
        header: ({ column }) => {
            return (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex gap-2 cursor-pointer font-bold">
                    <span>Nome</span>
                    <ArrowUpDown className="h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) =>
            <span className="flex justify-start">
                {row.original.nome.length > 20
                    ? `${row.original.nome.substring(0, 20)}...`
                    : row.original.nome}
            </span>
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex gap-2 cursor-pointer font-bold">
                    <span>E-mail</span>
                    <ArrowUpDown className="h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) =>
            <span className="flex justify-start">
                {row.original.email.length > 20
                    ? `${row.original.email.substring(0, 20)}...`
                    : row.original.email}
            </span>
    },
    {
        accessorKey: "admin",
        header: ({ column }) => {
            return (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex gap-2 cursor-pointer font-bold">
                    <span>Função</span>
                    <ArrowUpDown className="h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) => {
            if (row.original.admin) {
                return (
                    <div className="flex w-full justify-start">
                        <div className="flex gap-2 bg-primary text-white font-semibold pr-3 pl-2 pt-0.5 pb-1 rounded-lg w-fit">
                            <Shield className="h-5 w-5" />
                            <span>Administrador</span>
                        </div>
                    </div>
                )
            }
            return (
                <div className="flex w-full justify-start">
                    <div className="flex gap-2 bg-transparent text-black font-semibold pr-3 pl-2 pt-0.5 pb-1 rounded-lg  w-fit">
                        <User className="h-5 w-5" />
                        <span>Usuário</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "permissoes",
        header: ({ column }) => {
            return (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex gap-2 cursor-pointer font-bold">
                    <span>Permissões</span>
                    <ArrowUpDown className="h-4 w-4" />
                </div>
            )
        },
        cell: ({ row }) => {
            {
                const permissoesUsuario = permissoes.filter((p) => row.original.permissoes[p.key as keyof typeof row.original.permissoes])

                return (
                    <div className="flex flex-row gap-1 w-full justify-start">
                        {permissoesUsuario.map((p) => (
                            <Tooltip key={p.key}>
                                <TooltipTrigger asChild>
                                    <p.icon className={p.className} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span>{p.label}</span>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                );
            }
        }
    },
    {
        accessorKey: "ativo",
        header: ({ column }) => {
            return (
                <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="w-full inline-flex items-center justify-center gap-2 cursor-pointer font-bold">
                    <span>Ativo</span>
                    <ArrowUpDown className="h-4 w-4" />
                </div>
                    
                    
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">
                    <SwitchUsuario id={row.original.id} ativo={row.original.ativo} nome={row.original.nome}/>
                </div>
            )
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <div className="flex gap-2">
                    <CardUsuario usuario={row.original} />
                    <ConfirmDelete itemName={row.original.nome} id={row.original.id} />
                </div>
            )
        }
    }
]
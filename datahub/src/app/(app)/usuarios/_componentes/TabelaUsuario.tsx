"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
} from "@/components/ui/table";
import retornarUsuarios from "../_actions/retornarUsuarios";
import { JsonValue } from "@prisma/client/runtime/library";
import { Button } from "@/components/ui/button";
import { PenBox, Trash2, Plus } from "lucide-react";
import CardUsuario from "./CardUsuario";
import { Overlay } from "@/components/layout/Overlay";
import ConfirmDelete from "./ConfirmDelete";
import deletarUsuario from "../_actions/deletarUsuario";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    admin: boolean;
    permissoes: JsonValue;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export default function TabelaUsuario() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | undefined>(undefined);
    const [abrirCard, setAbrirCard] = useState(false);

    const getUsuarios = async () => {
        const data = await retornarUsuarios();
        setUsuarios(data);
    };

    const handleOpenCard = (usuario?: Usuario) => {
        // Se passar usuario, é edição, se não, é criação
        setUsuarioSelecionado(usuario || undefined);
        setAbrirCard(true);
    };

    const handleCloseCard = () => {
        setAbrirCard(false);
        setUsuarioSelecionado(undefined);
        getUsuarios(); // Atualiza a tabela após criar/editar
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    return (
        <>
            <Table>
                <TableCaption>Lista de Usuários</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell className="w-[10%]">{usuario.id}</TableCell>
                            <TableCell className="w-[80%]">
                                <div className="flex flex-col">
                                    <span>{usuario.nome}</span>
                                    <span className="text-xs text-muted-foreground">{usuario.email}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {usuario.admin ? "Administrador" : "Usuário"}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="w-[10%] flex gap-2">
                                <Button onClick={() => handleOpenCard(usuario)}><PenBox /></Button>
                                <ConfirmDelete
                                    itemName={usuario.nome}
                                    onConfirm={async () => {
                                        await deletarUsuario(usuario.id);
                                        getUsuarios(); 
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {abrirCard && (
                <Overlay onClose={handleCloseCard}>
                    <CardUsuario usuario={usuarioSelecionado} onClose={handleCloseCard} />
                </Overlay>
            )}
        </>
    );
}

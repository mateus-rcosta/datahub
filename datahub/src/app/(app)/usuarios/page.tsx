import TabelaUsuario from "../../../features/usuario/components/TabelaUsuario";
import CardUsuario from "@/features/usuario/components/CardUsuario";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { InputUsuario } from "@/features/usuario/components/InputUsuario";
import { Cabecalho } from "@/components/layout/Cabecalho";

export default async function PageUsuarios() {
    const usuario = await verifySession();
    if (!usuario) {
        redirect("/auth/login");
    }

    if (!usuario.admin) {
        redirect("/dashboard");
    }


    return (
        <div className="w-full">
            {/* Cabeçalho */}
            <Cabecalho titulo="Usuários" descricao="Gerencie os usuários e suas permissões no sistema" />
            {/* Tabela de usuário */}
            <TabelaUsuario />

        </div>
    );
}

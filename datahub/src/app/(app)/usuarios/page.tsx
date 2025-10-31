import { redirect } from "next/navigation";
import { verifySession } from "@/lib/session";
import { Cabecalho } from "@/components/layout/Cabecalho";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/reactQuery";
import retornarUsuarios from '@/features/usuario/action/retornarUsuarios';
import TabelaUsuario from "@/features/usuario/components/tabela/TabelaUsuario";

export default async function PageUsuarios() {
  const queryClient = getQueryClient();
  const usuario = await verifySession();
  if (!usuario) redirect("/auth/login");
  if (!usuario.admin) redirect("/dashboard");

  const usuarios = await retornarUsuarios({ pesquisa: "", page: 1, limit: 10 });
  queryClient.setQueryData(["usuarios", "", 1, 10], usuarios);

  return (
    <div className="w-full">
      <Cabecalho titulo="Usuários" descricao="Gerencie os usuários e suas permissões no sistema" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TabelaUsuario />
      </HydrationBoundary>
    </div>
  );
}

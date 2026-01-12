import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import retornaUsuarios from "@/features/usuario/services/retorna-usuarios";
import { Cabecalho } from "@/components/layout/cabecalho";
import TabelaUsuario from "@/features/usuario/componentes/tabela/tabela-usuario";

export const dynamic = 'force-dynamic';
export default async function PageUsuarios() {
  const queryClient = getQueryClient();

  const pesquisa = "";
  const page = 1;
  const limit = 10;

  // Pre-fetch dos dados
  const usuarios = await retornaUsuarios({ pesquisa, page, limit });
  
  queryClient.setQueryData(["usuarios", pesquisa, page, limit ], usuarios);
  
  return (
    <div className="w-full">
      <Cabecalho 
        titulo="Usuários" 
        descricao="Gerencie os usuários e suas permissões no sistema" 
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TabelaUsuario />
      </HydrationBoundary>
    </div>
  );
}

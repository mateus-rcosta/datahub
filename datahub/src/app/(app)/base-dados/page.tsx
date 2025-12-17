import { Cabecalho } from "@/components/layout/cabecalho";
import BasesDados from "@/features/base-dados/componentes/bases-dados";
import { retornaBaseDados } from "@/features/base-dados/services/retorna-base-dados";

import { getQueryClient } from "@/lib/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = 'force-dynamic';
export default async function page() {

    const queryClient = getQueryClient();

    const pesquisa = "";
    const page = 1;
    const limit = 10;

    // Pre-fetch dos dados
    const baseDados = await retornaBaseDados({pesquisa, page, limit});

    queryClient.setQueryData(["baseDados", pesquisa, page, limit], { sucesso: true, dados: baseDados });

    return (
        <div className="w-full">
            <Cabecalho
                titulo="Bases de dados"
                descricao="Gerencie suas bases de dados e importe novas bases de dados"
            />
            {/* desativado o hydration boundary até ser implementado uma forma de pegar o tamanho de tela do usuário para não carregar duas vezes a tela */}
            {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
                <BasesDados />
            {/* </HydrationBoundary> */}
        </div>
    )
}
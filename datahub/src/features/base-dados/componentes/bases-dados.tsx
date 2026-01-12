"use client";

import { useRetornaBasesDados } from "../api/retorna-bases-dados";
import CardBaseDados from "./card-base-dados";
import FormCriaBaseDados from "./form-cria-base-dados";
import { useState, useEffect } from "react";
import { InputPesquisa } from "@/components/layout/form/input-pesquisa";
import { useDebounce } from "use-debounce";
import { Paginacao } from "@/components/layout/pagination";
import { useLimiteResponsivo } from "@/hooks/use-limite-responsivo";
import { Spinner } from "@/components/ui/spinner";

export default function BasesDados() {
  const [page, setPage] = useState(1);
  const limit = useLimiteResponsivo();
  const [pesquisa, setPesquisa] = useState("");
  const [pesquisaDebouncing] = useDebounce(pesquisa, 500);

  // reseta ao digitar
  useEffect(() => {
    setPage(1);
  }, [pesquisaDebouncing, limit]);

  const { data, isLoading, isFetching, isError, error } = useRetornaBasesDados({ pesquisa: pesquisaDebouncing, page, limit }, { enabled: limit !== undefined });


  if (isLoading || limit === undefined) return (
    <Spinner className="size-8 animate-spin m-4" />
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-6 gap-2">
        <p className="text-destructive font-semibold">
          Erro ao carregar os dados
        </p>
        {error instanceof Error && (
          <p className="text-sm text-muted-foreground">
            {error.message}
          </p>
        )}
      </div>
    );
  }

  const { dados = [], total = 0 } = data ?? {};

  return (
    <div className="flex flex-col p-6 gap-4 items-end">
      <div className="flex flex-col-reverse md:flex-row w-full md:w-fit justify-end right gap-2">
        <InputPesquisa
          state={pesquisa}
          useStatePesquisa={setPesquisa}
          campoPesquisa="nome"
          total={total}
        />
        <FormCriaBaseDados />
      </div>

      <div className={`w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] ${isFetching ? "opacity-60" : ""}`}>
        {dados && dados.map((baseDados) =>
          <CardBaseDados
            key={baseDados.id}
            id={baseDados.id}
            createdAt={baseDados.createdAt}
            nome={baseDados.nome}
            clientesCount={baseDados.clientes}
            updatedAt={baseDados.updatedAt}
            estrutura={baseDados.estrutura}
            pageParams={{ pesquisa: pesquisaDebouncing, page, limit }}
          />)}
      </div>

      {/* Paginação */}
      <Paginacao
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        className="self-center"
      />
    </div>
  );
}

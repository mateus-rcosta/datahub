"use client";

import { useRetornaBaseDados } from "../api/retorna-base-dados";
import CardBaseDados from "./card-base-dados";
import FormCriaBaseDados from "./form-cria-base-dados";
import { useState, useEffect } from "react";
import { InputPesquisa } from "@/components/layout/form/input-usuario";
import { useDebounce } from "use-debounce";
import { Paginacao } from "@/components/layout/pagination";
import { useLimiteResponsivo } from "@/hooks/use-limite-responsivo";

export default function BasesDados() {
  const [page, setPage] = useState(1);
  const limit = useLimiteResponsivo();

  const [pesquisa, setPesquisa] = useState("");
  const [pesquisaDebouncing] = useDebounce(pesquisa, 500);

  // sempre que o limit mudar, volta para página 1
  useEffect(() => { setPage(1); }, [limit]);

  const { data, isLoading, isFetching } = useRetornaBaseDados({ pesquisa: pesquisaDebouncing, page, limit });

  if (isLoading) return <p className="text-black">Carregando...</p>;

  if (!data || !data.sucesso) return <p className="text-black">Erro ao carregar os dados</p>;

  const pagination = data.dados;
  console.log(pagination);
  return (
    <div className="flex flex-col p-6 gap-4">
      {/* Header */}
      <div className="flex w-full justify-end gap-2">
        <InputPesquisa
          state={pesquisa}
          useState={setPesquisa}
          total={pagination.total}
          className="w-fit"
        />
        <FormCriaBaseDados />
      </div>

      {/* Grid */}
      <div className={`w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] ${isFetching ? "opacity-60" : ""}`}>
        {pagination.dados && pagination.dados.map((baseDados) => 
        <CardBaseDados
            key={baseDados.id}
            createdAt={baseDados.createdAt}
            nome={baseDados.nome}
            clientesCount={baseDados.clientes}
            updatedAt={baseDados.updatedAt}
          /> )}
      </div>

      {/* Paginação */}
      <Paginacao
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        onPageChange={setPage}
      />
    </div>
  );
}

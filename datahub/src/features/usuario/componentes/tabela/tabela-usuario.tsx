"use client";
import { useEffect, useState } from "react";
import { Tabela } from "@/components/layout/table/tabela";
import { columns } from "./coluna";
import CardUsuario from "../card/card-usuario";
import { Spinner } from "@/components/ui/spinner"
import { useDebounce } from 'use-debounce';
import { InputPesquisa } from "@/components/layout/form/input-pesquisa";
import { useRetornaUsuarios } from "../../api/retorna-usuario";
import { da } from "zod/v4/locales";

export default function TabelaUsuario() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [pesquisaDebouncing] = useDebounce(pesquisa, 500);

  const { data, isFetching, isLoading, error, isError, initialData } = useRetornaUsuarios({
    pesquisa: pesquisaDebouncing,
    page,
    limit
  });

  // reseta ao digitar
  useEffect(() => {
    setPage(1);
  }, [pesquisaDebouncing, pesquisa]);

  if (isLoading ) {
    return (
      <div className="flex items-center justify-center p-6">
        <Spinner className="size-10" />
      </div>
    );
  }

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

  const { dados = [], total = 0 } = data ?? initialData;
  const pageCount = Math.ceil(total / limit);

  return (
    <div className="flex flex-col w-full justify-between px-6 py-3 gap-4">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-1">
          {isFetching && <Spinner className="size-10" />}
        </div>
        <div className="flex flex-col-reverse md:flex-row w-full md:w-fit gap-2">
          <InputPesquisa state={pesquisa} useStatePesquisa={setPesquisa} total={total} campoPesquisa="nome" />
          <CardUsuario />
        </div>
      </div>
      <Tabela
        columns={columns}
        data={dados}
        page={page}
        limit={limit}
        pageCount={pageCount}
        totalItems={total}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
}
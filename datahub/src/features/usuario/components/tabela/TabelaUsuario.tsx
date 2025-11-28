"use client";

import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "@/components/layout/table/DataTable";
import { columns } from "./Columns";
import { useQuery } from "@tanstack/react-query";
import { retornaUsuariosQueryOptions } from "../../service/queryOptions";
import { InputUsuario } from "../form/InputUsuario";
import CardUsuario from "../card/CardUsuario";
import { Spinner } from "@/components/ui/spinner"
import { Usuario } from "../../type/types";
import { useDebounce } from 'use-debounce';

export default function TabelaUsuario() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [pesquisaDebouncing] = useDebounce(pesquisa, 500);

  const options = retornaUsuariosQueryOptions({ pesquisa: pesquisaDebouncing, page, limit });
  const { data: usuarios, isFetching } = useQuery(options);

  // guarda o último conjunto de dados válidos
  const prevDataRef = useRef<Usuario[] | null>(null);
  const prevTotalRef = useRef<number | null>(null);

  useEffect(() => {
    if (usuarios?.data && usuarios.data.length > 0) {
      prevDataRef.current = usuarios.data;
    }
    if (typeof usuarios?.total === "number") {
      prevTotalRef.current = usuarios.total;
    }
  }, [usuarios]);



  // mostra os dados atuais, ou os anteriores se estiver carregando e dados atuais não existirem
  const displayedData = usuarios?.data ?? prevDataRef.current ?? [];
  const total = typeof usuarios?.total === "number" ? usuarios.total : prevTotalRef.current ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <>

      <div className="flex flex-col w-full justify-between px-6 py-3 gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-1">
            {isFetching && <Spinner className="size-10" />}
          </div>

          <div className="flex flex-row gap-2">
            <InputUsuario state={pesquisa} useState={setPesquisa} total={total} />
            <CardUsuario />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={displayedData}
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
    </>
  );
}

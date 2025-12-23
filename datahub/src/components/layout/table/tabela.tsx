"use client";

import React from "react";
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable, } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TabelaProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  limit: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (limit: number) => void;
  totalItems?: number;
}

export function Tabela<TData, TValue>({
  columns,
  data,
  page,
  limit,
  pageCount,
  onPageChange,
  onPageSizeChange,
  totalItems,
}: TabelaProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // React Table usa pageIndex zero-based
  const pageIndexZeroBased = Math.max(0, page - 1);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination: {
        pageIndex: pageIndexZeroBased,
        pageSize: limit,
      },
    },
    manualFiltering: true,
    manualPagination: true,
    pageCount,
  });

  function handlePrev() {
    if (page > 1) onPageChange?.(page - 1);
  }
  function handleNext() {
    if (page < pageCount) onPageChange?.(page + 1);
  }

  function handlePageSizeChange(newSize: number) {
    onPageSizeChange?.(newSize);
  }

  return (
    <div className="flex flex-col h-full rounded-md border min-h-0">
      {/* ÁREA SCROLLÁVEL */}
      <div className="flex-1 min-h-0 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem dados até o momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER FIXO */}
      <div className="shrink-0 flex flex-col px-4 py-4 border-t bg-background gap-3">
        {/* Mobile: 2 linhas compactas */}
        <div className="flex md:hidden flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            {typeof totalItems === "number" && (
              <Badge variant="outline" className="text-sm">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </Badge>
            )}

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">
                Por página:
              </label>
              <Select
                value={limit.toString()}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={page <= 1}
            >
              Anterior
            </Button>

            <div className="text-sm text-muted-foreground">
              Página <strong className="text-foreground">{totalItems === 0 ? 0 : page}</strong> de <strong className="text-foreground">{pageCount}</strong>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={page >= pageCount}
            >
              Próximo
            </Button>
          </div>
        </div>

        {/* Desktop: layout original */}
        <div className="hidden md:flex md:flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={page >= pageCount}
              >
                Próximo
              </Button>
            </div>

            <div className="text-sm">
              Página <strong>{totalItems === 0 ? 0 : page}</strong> de <strong>{pageCount}</strong>
            </div>

            {typeof totalItems === "number" && (
              <Badge variant="outline" className="text-sm">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">
              Por página:
            </label>
            <Select
              value={limit.toString()}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

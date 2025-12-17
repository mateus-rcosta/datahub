"use client";

import React from "react";
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable, } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  limit: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (limit: number) => void;
  totalItems?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  limit,
  pageCount,
  onPageChange,
  onPageSizeChange,
  totalItems,
}: DataTableProps<TData, TValue>) {
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
    <div className=" w-full rounded-md border">

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
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

      <div className="flex-row px-4 items-center justify-between space-x-2 py-4">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={page <= 1}
            className="bg-white"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={page >= pageCount}
            className="bg-white"
          >
            Próximo
          </Button>

          <div className="ml-4">
            Página <strong>{page}</strong>/<strong>{pageCount}</strong>
          </div>

          {typeof totalItems === "number" && (
            <div className="ml-4 text-sm text-muted-foreground">
              {totalItems} itens
            </div>
          )}
        </div>

        <div className="flex-row self-end justify-self-end justify-end space-x-2 bg-white dark:bg-secondary pl-2 w-fit rounded-md">
          <label className="text-sm">Por página:</label>
          <select
            value={limit}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="rounded px-2 py-1 dark:bg-secondary dark:text-white"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

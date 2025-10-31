import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "../ui/button-group";


export function getVisiblePages(current: number, total: number, maxVisible = 3): number[] {
  if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);

  const side = Math.floor(maxVisible / 2);

  if (current <= side + 1) {
    return Array.from({ length: maxVisible }, (_, i) => i + 1);
  }

  if (current >= total - side) {
    return Array.from({ length: maxVisible }, (_, i) => total - (maxVisible - 1) + i);
  }

  return Array.from({ length: maxVisible }, (_, i) => current - side + i);
}

type PaginationProps = {
  pagination: ApiPagination<any>;
  onPageChange: (page: number) => void;
  maxVisibleButtons?: number;
  showSummary?: boolean;
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  ellipsis?: React.ReactNode;
};

export default function Pagination({
  pagination,
  onPageChange,
  maxVisibleButtons = 3,
  showSummary = true,
  className,
  buttonClassName,
  activeButtonClassName,
}: PaginationProps) {
  const { page, limit, total } = pagination;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const visiblePages = useMemo(
    () => getVisiblePages(page, totalPages, maxVisibleButtons),
    [page, totalPages, maxVisibleButtons]
  );

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
  };

  const showLeft = page > 1;
  const showRight = page < totalPages;

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <ButtonGroup className="self-center">
        {showLeft && (
          <Button variant={"outline"} onClick={() => goTo(page - 1)} aria-label="Página anterior">
            &lt;
          </Button>
        )}

        {/* Primeira (opcional: se primeira pagina não está nas visíveis e não é 1) */}
        {visiblePages[0] > 1 && (
          <>
            <Button variant={"outline"} onClick={() => goTo(1)} className={buttonClassName}>
              1
            </Button>
            {visiblePages[0] > 2 && <Button variant={"outline"} disabled>...</Button>}
          </>
        )}

        {/* Paginas visiveis */}
        {visiblePages.map((p) => (
          <Button
            key={p}
            variant={"outline"}
            onClick={() => goTo(p)}
            aria-current={p === page ? "page" : undefined}
            className={p === page ? activeButtonClassName ?? "bg-primary text-white" : buttonClassName}
          >
            {p}
          </Button>
        ))}

        {/* Ultima */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && <Button variant={"outline"} disabled>...</Button>}
            <Button variant={"outline"} onClick={() => goTo(totalPages)} className={buttonClassName}>
              {totalPages}
            </Button>
          </>
        )}

        {/* Proxima */}
        {showRight && (
          <Button variant={"outline"} onClick={() => goTo(page + 1)} aria-label="Próxima página">
            &gt;
          </Button>
        )}
      </ButtonGroup>

      {showSummary && (
        <div className="ml-2 text-sm select-none">
          <span>{`${page} / ${totalPages}`}</span>
        </div>
      )}
    </div>
  );
}

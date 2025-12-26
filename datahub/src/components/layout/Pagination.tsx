import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PaginacaoProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Paginacao({
  page,
  limit,
  total,
  onPageChange,
  className
}: PaginacaoProps) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-2 mt-6", className)}>
      <Button
        variant={"outline"}
        className="shadow-md font-semibold"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Anterior
      </Button>

      <span className="text-sm">
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <Button
        variant={"outline"}
        className="shadow-md font-semibold"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Próxima
      </Button>
    </div>
  );
}
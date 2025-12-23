"use client";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, Search } from "lucide-react";

interface InputPesquisaProps {
    state: string;
    useStatePesquisa: (string: string) => void;
    total?: number;
    className?: string;
    campoPesquisa?: string;
    useCampoPesquisa?: (campo: string) => void;
    campos?: string[];
}

export function InputPesquisa({ 
    state, 
    useStatePesquisa, 
    total = 0, 
    className, 
    campoPesquisa, 
    useCampoPesquisa,
    campos 
}: InputPesquisaProps) {
    return (
        <div className="flex w-full md:w-full flex-col gap-2 ">
            {/* Linha do input */}
            <InputGroup className={cn("bg-white w-full", className)}>
                <InputGroupInput 
                    placeholder={`Pesquise por ${campoPesquisa || 'campo'}...`} 
                    value={state} 
                    onChange={(e) => useStatePesquisa(e.target.value)} 
                    className="text-black placeholder:text-gray-800 dark:text-white dark:placeholder:text-gray-300"
                />
                <InputGroupAddon>
                    <Search className="text-black dark:text-white" />
                </InputGroupAddon>
                
                {campos && campos.length > 0 && useCampoPesquisa && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <InputGroupButton variant="ghost" className="pr-1.5 text-xs hidden md:flex">
                                {campoPesquisa || 'Selecione'} <ChevronDownIcon className="size-3 ml-1" />
                            </InputGroupButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                            align="end" 
                            className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-1 min-w-[150px] z-50"
                        >
                            {campos.map((campo) => (
                                <DropdownMenuItem 
                                    key={campo} 
                                    onClick={() => useCampoPesquisa(campo)}
                                    className={cn(
                                        "px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700 outline-none",
                                        campoPesquisa === campo && "bg-gray-100 dark:bg-gray-700 font-semibold"
                                    )}
                                >
                                    {campo}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </InputGroup>

            {/* Linha dos controles em mobile */}
            <div className="flex-col items-center justify-between gap-2 md:hidden">
                {campos && campos.length > 0 && useCampoPesquisa && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs border rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                Campo: <span className="font-semibold">{campoPesquisa || 'Selecione'}</span>
                                <ChevronDownIcon className="size-3" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                            align="start" 
                            className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-1 min-w-[150px] z-50"
                        >
                            {campos.map((campo) => (
                                <DropdownMenuItem 
                                    key={campo} 
                                    onClick={() => useCampoPesquisa(campo)}
                                    className={cn(
                                        "px-3 py-2 text-sm cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-700 outline-none",
                                        campoPesquisa === campo && "bg-gray-100 dark:bg-gray-700 font-semibold"
                                    )}
                                >
                                    {campo}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                
                {total > 0 && (
                    <span className="flex w-full text-xs text-center items-center text-gray-600 dark:text-gray-200 whitespace-nowrap">
                        {total} resultados
                    </span>
                )}
            </div>

            {/* Total em desktop (inline) */}
            {total > 0 && (
                <div className="hidden md:block -mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-200">
                        {total} resultados
                    </span>
                </div>
            )}
        </div>
    );
}
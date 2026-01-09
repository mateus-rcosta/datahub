"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRetornaIntegracao } from "../api/retorna-integracao-api";
import { useVerificaHealthcheck } from "../api/verifica-healthchek-api";
import { IntegracaoErrorType } from "../exceptions/integracao-error";
import { FormHandle, FormStatus, integrationForms } from "./forms";

interface CardConfigurarProps {
    id: number;
}

export default function CardConfigurar({ id }: CardConfigurarProps) {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useRetornaIntegracao(id, open);
    const formRef = useRef<FormHandle>(null);

    const [formStatus, setFormStatus] = useState<FormStatus>({
        isDirty: false,
        isValid: false,
        isExecuting: false,
    });

    const { verificaHealthcheck } = useVerificaHealthcheck();

    const handleSalvar = () => {
        formRef.current?.submit();
    };

    const handleStatusChange = useCallback((status: FormStatus) => {
        setFormStatus(status);
    }, []);

    const handleVerificaHealthcheck = async () => {
        const resultado = await verificaHealthcheck(id);
        if (resultado.sucesso) {
            if (resultado.dados.status === "healthy") {
                toast.success("Healthcheck realizado: integração respondeu com sucesso.");
                return;
            }
            toast.warning("Healthcheck realizado: integração não respondeu com sucesso.");
            return;
        }
        toast.error(resultado.code_error === IntegracaoErrorType.INTEGRACAO_NAO_ENCONTRADA ? "Integração não encontrada." : "Erro interno ao validar healthcheck.");
    };


    const FormComponent = data?.sucesso ? integrationForms[data.dados.nome as keyof typeof integrationForms] : null;

    return (
        <>
            <Button className="w-full" variant="outline" onClick={() => setOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Configurar
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] h-[90vh] flex flex-col">
                    <DialogHeader className="shrink-0 border-b pb-3">
                        <DialogTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-muted-foreground" />
                            {isLoading ? "Carregando..." : `Configurar: ${data?.sucesso ? data.dados.nome : "Erro ao carregar os dados"}`}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground text-left">
                            Ajuste os parâmetros da integração conforme necessário.
                        </p>
                    </DialogHeader>

                    <div className={`flex-1 overflow-y-auto ${isLoading ? "pointer-events-none opacity-60" : ""}`}>
                        {data?.sucesso && FormComponent ? (
                            <FormComponent
                                ref={formRef}
                                config={data.dados.config}
                                integracaoId={id}
                                onStatusChange={handleStatusChange}
                            />
                        ) : isLoading ? (
                            <Spinner className="spin-in" />
                        ) : (
                            <p>Integração não suportada.</p>
                        )}
                    </div>
                    <DialogFooter className="flex flex-col border-t pt-4 gap-3">
                        <div className="flex flex-col w-full md:flex-row gap-2">
                            <Button type="button" variant="default" className="w-full md:w-1/2 bg-verde hover:bg-verde/70" onClick={handleVerificaHealthcheck}>
                                Testar Conexão
                            </Button>
                        </div>
                        <div className="flex flex-col w-full md:flex-row gap-2">
                            <Button type="button" variant="outline" className="w-full md:w-1/2 bg-white" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={handleSalvar} disabled={!formStatus.isDirty || !formStatus.isValid || formStatus.isExecuting} className="w-full md:w-1/2">
                                {formStatus.isExecuting ?
                                    <>
                                        <Spinner className="mr-2 spin-in" />
                                        Salvando
                                    </>
                                    : "Salvar"}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
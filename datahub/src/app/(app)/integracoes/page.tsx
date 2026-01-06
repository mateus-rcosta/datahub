import { Cabecalho } from "@/components/layout/cabecalho";
import Integracao from "@/features/integracao/componentes/integracao";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Datahub | Integrações",
    description: "Página de integrações da aplicação DataHub",
};

export default function Page() {
    return (
        <div className="w-full">
            <Cabecalho
                titulo="Integrações"
                descricao="Configure suas integrações com sistemas externos"
            />
            <Integracao />
        </div>
    )
}
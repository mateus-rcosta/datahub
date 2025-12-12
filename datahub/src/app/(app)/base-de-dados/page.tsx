import { Cabecalho } from "@/components/layout/cabecalho";

export default function page() {
    return (
        <div className="w-full">
            <Cabecalho
                titulo="Bases de dados"
                descricao="Gerencie suas bases de dados e importe novas bases de dados"
            />
            {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
            {/* </HydrationBoundary> */}
        </div>
    )
}
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datahub | Bases de Dados",
  description: "Página de bases de Dados da aplicação DataHub",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
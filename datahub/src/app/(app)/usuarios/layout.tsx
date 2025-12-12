import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datahub | Usuários",
  description: "Página de usuários da aplicação DataHub",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
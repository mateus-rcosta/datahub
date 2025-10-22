import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Página de login da aplicação DataHub",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className={`flex justify-center items-center h-screen min-h-screen min-w-screen mx-auto`}>
      {children}
    </main>
  );
}
import { verificaSessao } from "@/lib/sessao";
import { AuthProvider } from "./auth-client-provider";
import { ReactNode } from "react";

export const AuthServerProvider = async ({
  children
}: {
  children: ReactNode
}) => {
  const session = await verificaSessao();

  return (
    <AuthProvider session={session}>
      {children}
    </AuthProvider>
  );
};
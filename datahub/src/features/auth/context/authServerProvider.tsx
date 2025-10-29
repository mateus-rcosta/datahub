import { verifySession } from "@/lib/session";
import { AuthProvider } from "./authClientProvider";
import { ReactNode } from "react";

export const AuthServerProvider = async ({
  children
}: {
  children: ReactNode
}) => {
  const session = await verifySession();

  return (
    <AuthProvider session={session}>
      {children}
    </AuthProvider>
  );
};
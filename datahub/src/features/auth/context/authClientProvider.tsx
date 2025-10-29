"use client";

import { SessionPayload } from "@/lib/session";
import { createContext, useContext } from "react";
import { ReactNode } from "react";

export const AuthContext = createContext<SessionPayload | null>(null);

// Client Component que só gerencia o contexto
export const AuthProvider = ({ children, session }:
  { children: ReactNode; session: SessionPayload | null; }
) => {
  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
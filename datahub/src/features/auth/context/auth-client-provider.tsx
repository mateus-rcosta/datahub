"use client";

import { AuthPayload } from "@/types/types";
import { createContext, useContext } from "react";
import { ReactNode } from "react";

export const AuthContext = createContext<AuthPayload | null>(null);

// Client Component que só gerencia o contexto
export const AuthProvider = ({ children, session }:
  { children: ReactNode; session: AuthPayload | null; }
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
"use client";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { getQueryClient } from "@/lib/react-query";

export default function AppProvider({children}: {children: ReactNode}) {
    const queryClient = getQueryClient();
    
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            {children}

        </QueryClientProvider>
    );
};
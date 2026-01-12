"use client";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { getQueryClient } from "@/lib/react-query";
import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { envClient } from "@/lib/env-client";

export default function AppProvider({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient} >
            {envClient.NODE_ENV === "development" && <ReactQueryDevtools />}
            <ThemeProvider attribute="class" storageKey="app-theme" enableSystem={true}>
                <Toaster />
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    );
};
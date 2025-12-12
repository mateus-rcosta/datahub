"use server";

import { ClientSideNavigation } from "@/components/layout/client-side-navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/features/auth/context/auth-client-provider";
import { retornaSessaoUsuario } from "@/lib/sessao";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const user = await retornaSessaoUsuario();
    if (!user) return redirect("/auth/login");

    return (
        <AuthProvider session={user}>
            <SidebarProvider>
                <ClientSideNavigation />
                <main className="w-full h-full overflow-y-auto overflow-x-hidden">
                    <div className="sticky top-0 z-10 pt-2 pl-2 lg:hidden">
                        <SidebarTrigger />
                    </div>
                    {children}
                </main>
            </SidebarProvider>
        </AuthProvider>
    );
};
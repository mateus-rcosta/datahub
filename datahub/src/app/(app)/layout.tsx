"use server";

import { ClientSideNavigation } from "@/components/layout/ClientSideNavigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/features/auth/context/authClientProvider";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const user = await verifySession();
    if (!user) return redirect("/auth/login");

    return (
        <>
            <AuthProvider session={user}>
                <SidebarProvider>
                    <ClientSideNavigation />
                    <main className="w-full h-full">
                        <div className="sticky top-0 z-10 pt-2 pl-2 lg:hidden">
                            <SidebarTrigger />
                        </div>
                        {children}
                    </main>
                </SidebarProvider>
            </AuthProvider>
        </>
    );
};
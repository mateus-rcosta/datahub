import { ClientSideNavigation } from "@/components/layout/ClientSideNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarProvider>
                <ClientSideNavigation />
                <main className="w-full h-full">
                    {children}
                </main>
            </SidebarProvider>
        </>
    );
};
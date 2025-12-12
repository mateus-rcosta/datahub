"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { deletaSessao } from "@/lib/sessao";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export function ClientSideNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const [currentPage, setCurrentPage] = useState("dashboard");

    useEffect(() => {
        const page = pathname.split('/')[1] || 'dashboard';
        setCurrentPage(page);
    }, [pathname]);

    const handleNavigate = (page: string) => {
        router.push(`/${page}`);
    };

    async function handleLogout() {
        await deletaSessao();
        router.push("/auth/login");
    }

    return (
        <AppSidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
        />
    );
}
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarTrigger, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/context/authClientProvider";
import { Users, Database, FileText, BarChart3, Settings, Send, LogOut, Menu } from "lucide-react";
import { redirect } from "next/navigation";

interface AppSidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

export function AppSidebar({ currentPage, onNavigate, onLogout }: AppSidebarProps) {

    const user = useAuth();
    if (user === null) {
        redirect("/auth/login");
    }

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: BarChart3, permissao: true },
        { id: "relatorios", label: "Relatórios", icon: FileText, permissao: user.visualizar_relatorios },
        { id: "base-dados", label: "Base de dados", icon: Database, permissao: user.editar_base_dados  },
        { id: "campanhas", label: "Campanhas", icon: Send, permissao: user.editar_campanhas },
        { id: "integracoes", label: "Integrações", icon: Settings, permissao: user.editar_integracoes },
        { id: "usuarios", label: "Usuários", icon: Users, permissao: user.admin},
    ];
    
    const { toggleSidebar, open } = useSidebar();

    const handleNavigate = (id: string) => {
        if(open){
            toggleSidebar();
        }
        onNavigate(id);
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarContent className="bg-primary">
                {/* Header */}
                <SidebarGroup className="border-b border-white rounded-b-none">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => toggleSidebar()}
                                className="flex items-center gap-2 text-white font-medium"
                            >
                                <Menu className="h-4 w-4" />
                                <span>DataHub</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                
                {/* Menu principal */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.filter(item => item.permissao === true).map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            isActive={currentPage === item.id}
                                            onClick={() => handleNavigate(item.id)}
                                            className="text-white font-medium"
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            
            {/* Footer com logout */}
            <SidebarFooter className="bg-primary border-t-1 rounded-b-none border-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={onLogout} className="text-red-500">
                            <LogOut className="h-4 w-4" />
                            <span>Sair</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            
            {/* Rail = quando colapsado */}
            <SidebarRail />
        </Sidebar>
    );
}
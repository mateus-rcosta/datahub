import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarTrigger, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { Users, Database, FileText, BarChart3, Settings, Send, LogOut, Menu } from "lucide-react";

interface AppSidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

export function AppSidebar({ currentPage, onNavigate, onLogout }: AppSidebarProps) {
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "relatorios", label: "Relatórios", icon: FileText },
        { id: "base-dados", label: "Base de dados", icon: Database },
        { id: "campanhas", label: "Campanhas", icon: Send },
        { id: "integracoes", label: "Integrações", icon: Settings },
        { id: "usuarios", label: "Usuários", icon: Users },
    ];
    
    const { open, setOpen } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            <SidebarContent className="bg-primary">
                {/* Header */}
                <SidebarGroup className="border-b border-white rounded-b-none">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => setOpen(!open)}
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
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            isActive={currentPage === item.id}
                                            onClick={() => onNavigate(item.id)}
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
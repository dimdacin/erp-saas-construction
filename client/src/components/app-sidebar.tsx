import { LayoutDashboard, Building2, Users, Wrench, Calendar, BarChart3, ShoppingCart, Wallet, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

const menuItems = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Chantiers",
    url: "/chantiers",
    icon: Building2,
  },
  {
    title: "Salariés",
    url: "/salaries",
    icon: Users,
  },
  {
    title: "Équipements",
    url: "/equipements",
    icon: Wrench,
  },
  {
    title: "Planning",
    url: "/planning",
    icon: Calendar,
  },
  {
    title: "Achats",
    url: "/achats",
    icon: ShoppingCart,
  },
  {
    title: "Finances/Trésorerie",
    url: "/finances",
    icon: Wallet,
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: BarChart3,
  },
  {
    title: "Documentation",
    url: "/documentation",
    icon: FileText,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ERP Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <a href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

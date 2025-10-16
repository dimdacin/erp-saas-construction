import { LayoutDashboard, Building2, Users, Wrench, Calendar, BarChart3, ShoppingCart, Wallet, FileText, Upload } from "lucide-react";
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
import { useTranslation } from "react-i18next";

export function AppSidebar() {
  const [location, navigate] = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('nav.dashboard'),
      url: "/",
      icon: LayoutDashboard,
      key: "dashboard"
    },
    {
      title: t('nav.chantiers'),
      url: "/chantiers",
      icon: Building2,
      key: "chantiers"
    },
    {
      title: t('nav.salaries'),
      url: "/salaries",
      icon: Users,
      key: "salaries"
    },
    {
      title: t('nav.equipements'),
      url: "/equipements",
      icon: Wrench,
      key: "equipements"
    },
    {
      title: t('nav.planning'),
      url: "/planning",
      icon: Calendar,
      key: "planning"
    },
    {
      title: t('nav.achats'),
      url: "/achats",
      icon: ShoppingCart,
      key: "achats"
    },
    {
      title: t('nav.finances'),
      url: "/finances",
      icon: Wallet,
      key: "finances"
    },
    {
      title: t('nav.budgets'),
      url: "/budgets",
      icon: BarChart3,
      key: "budgets"
    },
    {
      title: t('nav.documentation'),
      url: "/documentation",
      icon: FileText,
      key: "documentation"
    },
  ];

  const adminItems = [
    {
      title: "Import Excel",
      url: "/admin/import",
      icon: Upload,
      key: "admin-import"
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.erpGestion')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    onClick={() => navigate(item.url)}
                  >
                    <button data-testid={`link-${item.key}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    onClick={() => navigate(item.url)}
                  >
                    <button data-testid={`link-${item.key}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
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

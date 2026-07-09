import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import {
  LayoutDashboard, Building2, PlusCircle, CalendarCheck, Calendar,
  MessageSquare, Bell, User, Settings, HelpCircle, LogOut,
  Menu, X, ChevronRight, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type DashboardTab =
  | "overview" | "biens" | "ajouter-bien" | "reservations"
  | "calendrier" | "messages" | "notifications"
  | "profil" | "parametres" | "support" | "agents";

interface NavItem {
  path: DashboardTab;
  label: string;
  icon: React.ElementType;
  agenceOnly?: boolean;
}

const navItems: NavItem[] = [
  { path: "overview", label: "Dashboard", icon: LayoutDashboard },
  { path: "biens", label: "Mes biens", icon: Building2 },
  { path: "ajouter-bien", label: "Ajouter un bien", icon: PlusCircle },
  { path: "reservations", label: "Mes réservations", icon: CalendarCheck },
  { path: "calendrier", label: "Calendrier des visites", icon: Calendar },
  { path: "messages", label: "Messages", icon: MessageSquare },
  { path: "notifications", label: "Notifications", icon: Bell },
  { path: "agents", label: "Agents", icon: Users, agenceOnly: true },
  { path: "profil", label: "Profil", icon: User },
  { path: "parametres", label: "Paramètres", icon: Settings },
  { path: "support", label: "Aide / Support", icon: HelpCircle },
];

const roleLabels: Record<string, string> = {
  proprietaire: "Propriétaire",
  locataire: "Locataire",
  agent: "Agent",
  agence: "Agence",
};
const roleColors: Record<string, string> = {
  proprietaire: "bg-primary/10 text-primary border-primary/20",
  locataire: "bg-slate-100 text-slate-700 border-slate-200",
  agent: "bg-accent/10 text-accent border-accent/20",
  agence: "bg-purple-100 text-purple-700 border-purple-200",
};
const verifColors: Record<string, string> = {
  verifie: "bg-green-100 text-green-700",
  en_attente: "bg-yellow-100 text-yellow-700",
  non_verifie: "bg-gray-100 text-gray-600",
  refuse: "bg-red-100 text-red-700",
};
const verifLabels: Record<string, string> = {
  verifie: "Vérifié", en_attente: "En attente", non_verifie: "Non vérifié", refuse: "Refusé",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export default function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();

  const notificationsQuery = useQuery({
    queryKey: ["notifications", currentUser?.id],
    queryFn: () => api.notifications.list(),
    enabled: !!currentUser,
    staleTime: 30_000,
  });

  const notificationItems = Array.isArray(notificationsQuery.data)
    ? notificationsQuery.data
    : notificationsQuery.data?.results ?? [];
  const unreadNotifs = notificationItems.filter((n: any) => !n.read).length;
  const verStatus = currentUser?.verificationStatus ?? "non_verifie";

  const handleLogout = () => { logout(); setLocation("/"); };

  const filteredNavItems = navItems.filter((item) => {
    if (item.agenceOnly && currentUser?.role !== "agence") return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Log<span className="text-primary">Civ</span></span>
          </Link>
          <button className="lg:hidden text-sidebar-foreground/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User */}
        <div className="px-5 py-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              {currentUser?.logo ? (
                <img src={currentUser.logo} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-primary font-bold text-sm">{currentUser?.prenom?.charAt(0)}{currentUser?.nom?.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">{currentUser?.prenom} {currentUser?.nom}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {currentUser?.role && (
              <Badge className={`text-xs ${roleColors[currentUser.role]}`}>{roleLabels[currentUser.role]}</Badge>
            )}
            <Badge className={`text-xs ${verifColors[verStatus]}`}>
              {verifLabels[verStatus]}
            </Badge>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.path;
            const showBadge = item.path === "notifications" && unreadNotifs > 0;
            return (
              <button key={item.path} type="button"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left group ${isActive ? "bg-primary text-white" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"}`}
                onClick={() => { onTabChange(item.path); setSidebarOpen(false); }}
                data-testid={`sidebar-${item.path}`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span className="ml-auto bg-destructive text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">{unreadNotifs}</span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-sidebar-border shrink-0">
          <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent"
            onClick={handleLogout} data-testid="sidebar-logout">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground text-sm lg:text-base">
                Bonjour, {currentUser?.prenom} {currentUser?.nom}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {currentUser?.role && roleLabels[currentUser.role]}
                {currentUser?.nomAgence && ` — ${currentUser.nomAgence}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => onTabChange("notifications")}
              data-testid="header-notifications"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{currentUser?.prenom?.charAt(0)}{currentUser?.nom?.charAt(0)}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

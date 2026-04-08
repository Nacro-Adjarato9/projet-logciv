import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/lib/store";
import DashboardLayout, { type DashboardTab } from "@/components/DashboardLayout";
import OverviewTab from "@/components/dashboard/OverviewTab";
import BiensTab from "@/components/dashboard/BiensTab";
import AjouterBienTab from "@/components/dashboard/AjouterBienTab";
import ReservationsTab from "@/components/dashboard/ReservationsTab";
import CalendrierTab from "@/components/dashboard/CalendrierTab";
import MessagesTab from "@/components/dashboard/MessagesTab";
import FavorisTab from "@/components/dashboard/FavorisTab";
import NotificationsTab from "@/components/dashboard/NotificationsTab";
import AgentsTab from "@/components/dashboard/AgentsTab";
import ProfilTab from "@/components/dashboard/ProfilTab";
import ParametresTab from "@/components/dashboard/ParametresTab";
import SupportTab from "@/components/dashboard/SupportTab";

interface DashboardProps {
  role: string;
}

export default function Dashboard({ role }: DashboardProps) {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const seedMockData = useStore((s) => s.seedMockData);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  useEffect(() => {
    if (!currentUser) {
      setLocation("/connexion");
      return;
    }
    if (currentUser.role !== role) {
      setLocation(`/dashboard/${currentUser.role}`);
    }
  }, [currentUser, role, setLocation]);

  if (!currentUser) return null;

  const handleTabChange = (tab: string) => setActiveTab(tab as DashboardTab);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {activeTab === "overview" && <OverviewTab onTabChange={handleTabChange} />}
      {activeTab === "biens" && <BiensTab onTabChange={handleTabChange} />}
      {activeTab === "ajouter-bien" && <AjouterBienTab onSuccess={() => setActiveTab("biens")} />}
      {activeTab === "reservations" && <ReservationsTab />}
      {activeTab === "calendrier" && <CalendrierTab />}
      {activeTab === "messages" && <MessagesTab />}
      {activeTab === "favoris" && <FavorisTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "agents" && <AgentsTab />}
      {activeTab === "profil" && <ProfilTab />}
      {activeTab === "parametres" && <ParametresTab />}
      {activeTab === "support" && <SupportTab />}
    </DashboardLayout>
  );
}

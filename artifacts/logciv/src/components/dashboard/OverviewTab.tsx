import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { Building2, CalendarCheck, MessageSquare, TrendingUp, CheckCircle, Clock, Bell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { PRICING_PLANS } from "@/types/pricing";

const statusColors: Record<string, string> = {
  en_attente: "bg-yellow-100 text-yellow-700 border-yellow-200",
  acceptee: "bg-green-100 text-green-700 border-green-200",
  refusee: "bg-red-100 text-red-700 border-red-200",
  disponible: "bg-green-100 text-green-700 border-green-200",
  reserve: "bg-yellow-100 text-yellow-700 border-yellow-200",
  indisponible: "bg-gray-100 text-gray-600 border-gray-200",
};
const statusLabels: Record<string, string> = {
  en_attente: "En attente", acceptee: "Acceptée", refusee: "Refusée",
  disponible: "Disponible", reserve: "Réservé", indisponible: "Indisponible",
};

export default function OverviewTab({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const { properties, reservations, threads, notifications, messages, getUserSubscription, getUserPropertiesCount } = useStore();

  const subscription = currentUser ? getUserSubscription(currentUser.id) : null;
  const propertiesCount = currentUser ? getUserPropertiesCount(currentUser.id) : 0;
  const plan = subscription ? PRICING_PLANS[subscription.planId] : null;

  const myProps = properties.filter((p) => p.ownerId === currentUser?.id);
  const myReservations = reservations.filter((r) => r.ownerId === currentUser?.id);
  const myThreads = threads.filter((t) => t.participants.includes(currentUser?.id ?? ""));
  const unreadMessages = messages.filter(
    (m) => m.senderId !== currentUser?.id && !m.read && myThreads.some((t) => t.id === m.threadId)
  ).length;
  const unreadNotifs = notifications.filter((n) => !n.read && n.userId === currentUser?.id).length;
  const disponibles = myProps.filter((p) => p.statut === "disponible").length;
  const reserves = myProps.filter((p) => p.statut === "reserve").length;
  const pendingRes = myReservations.filter((r) => r.status === "en_attente").length;

  const stats = [
    { label: "Mes biens", value: myProps.length, icon: Building2, color: "bg-primary/10 text-primary", delta: "total publié" },
    { label: "Disponibles", value: disponibles, icon: CheckCircle, color: "bg-accent/10 text-accent", delta: "biens actifs" },
    { label: "Réservés", value: reserves, icon: Clock, color: "bg-yellow-100 text-yellow-600", delta: "en visite" },
    { label: "Réservations", value: myReservations.length, icon: CalendarCheck, color: "bg-blue-100 text-blue-600", delta: `${pendingRes} en attente` },
    { label: "Messages", value: myThreads.length, icon: MessageSquare, color: "bg-purple-100 text-purple-600", delta: `${unreadMessages} non lus` },
    { label: "Notifications", value: unreadNotifs, icon: Bell, color: "bg-orange-100 text-orange-600", delta: "non lues" },
  ];

  const recentActivity = [
    ...myReservations.slice(-3).map((r) => ({
      id: r.id, icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10",
      title: `Réservation de ${r.clientName}`,
      sub: `${r.date} à ${r.time}`,
      badge: r.status, time: r.createdAt,
    })),
    ...myThreads.slice(-2).map((t) => ({
      id: t.id, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100",
      title: `Message de ${Object.values(t.participantNames ?? {}).join(", ") || "Client"}`,
      sub: t.lastMessage ?? "Nouveau message",
      badge: null as string | null, time: t.lastMessageAt,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Votre activité en un coup d'œil</p>
      </div>

      {currentUser?.verificationStatus === "en_attente" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Compte en cours de vérification</p>
            <p className="text-xs text-yellow-700 mt-0.5">Votre dossier est en cours d'examen. Vous serez notifié une fois validé.</p>
          </div>
        </div>
      )}

      {/* Subscription Card */}
      {plan && (
        <div className={`rounded-xl border-2 p-4 flex items-center justify-between ${plan.color === "gray" ? "bg-gray-50 border-gray-200" : plan.color === "blue" ? "bg-blue-50 border-blue-200" : plan.color === "orange" ? "bg-orange-50 border-orange-300" : "bg-green-50 border-green-300"}`}>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Plan actuel</p>
            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
            <p className="text-sm text-gray-700 mt-1">
              Annonces utilisées: <span className="font-bold">{propertiesCount}/{subscription.maxProperties}</span>
            </p>
          </div>
          {subscription.planId !== "free" && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Renouvellement</p>
              <p className="text-sm font-semibold text-gray-900">{subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString("fr-CI") : "N/A"}</p>
            </div>
          )}
          {subscription.planId === "free" && (
            <Button 
              onClick={() => setLocation("/tarifs")}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Passer à Premium
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.delta}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Activité récente</h3>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune activité récente</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.bg}`}>
                      <Icon className={`w-4 h-4 ${a.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{a.sub}</p>
                    </div>
                    {a.badge && (
                      <span className={`text-xs border rounded-full px-2 py-0.5 shrink-0 ${statusColors[a.badge]}`}>
                        {statusLabels[a.badge]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Mes biens récents</h3>
            <button className="text-xs text-primary hover:underline" onClick={() => onTabChange("biens")}>Voir tout</button>
          </div>
          {myProps.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucun bien publié</p>
              <button className="text-xs text-primary hover:underline mt-1" onClick={() => onTabChange("ajouter-bien")}>Publier un bien</button>
            </div>
          ) : (
            <div className="space-y-3">
              {myProps.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.titre} className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.titre}</p>
                    <p className="text-xs text-muted-foreground">{p.commune} · {p.prix.toLocaleString("fr-CI")} FCFA</p>
                  </div>
                  <span className={`text-xs border rounded-full px-2 py-0.5 shrink-0 ${statusColors[p.statut]}`}>
                    {statusLabels[p.statut]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

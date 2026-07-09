import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Bell, CalendarCheck, MessageSquare, Building2, Info, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  reservation: { icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10" },
  message: { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
  bien: { icon: Building2, color: "text-accent", bg: "bg-accent/10" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-100" },
};

function unwrapList(data: any) {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

export default function NotificationsTab() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["dashboard", "notifications", currentUser?.id],
    queryFn: () => api.notifications.list(),
    enabled: !!currentUser,
    staleTime: 30_000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number | string) => api.notifications.markAsRead(Number(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] }),
  });
  const markAllMutation = useMutation({
    mutationFn: () => api.notifications.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] }),
  });

  const myNotifs = unwrapList(notificationsQuery.data);

  const unread = myNotifs.filter((n: any) => !n.read).length;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{unread} non lue{unread !== 1 ? "s" : ""}</p>
        </div>
        {unread > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm"
            onClick={() => markAllMutation.mutate()}
            data-testid="mark-all-read"
          >
            <CheckCheck className="w-4 h-4" /> Tout marquer lu
          </Button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Aucune notification</h3>
          <p className="text-sm text-muted-foreground">Vos alertes et mises à jour apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myNotifs.map((n: any) => {
            const cfg = typeConfig[n.type] ?? typeConfig.info;
            const Icon = cfg.icon;
            const isRead = !!n.read;
            return (
              <button
                key={n.id}
                type="button"
                className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${isRead ? "bg-card border-border" : "bg-primary/3 border-primary/20"}`}
                onClick={() => {
                  if (!isRead) {
                    markReadMutation.mutate(n.id);
                  }
                }}
                data-testid={`notif-${n.id}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{formatDate(n.createdAt ?? n.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.content}</p>
                </div>
                {!isRead && <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

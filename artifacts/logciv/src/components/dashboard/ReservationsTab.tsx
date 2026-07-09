import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MessageSquare,
  Building2,
} from "lucide-react";

const statusConfig: Record<string, { label: string; cls: string; icon: any }> = {
  pending: {
    label: "En attente",
    cls: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  confirmed: {
    label: "Acceptee",
    cls: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Refusee",
    cls: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
  },
};

function unwrapList(data: any) {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

export default function ReservationsTab() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const reservationsQuery = useQuery({
    queryKey: ["dashboard", "reservations", "mes-biens"],
    queryFn: () => api.reservations.reservationsPourMesBiens(),
    enabled: !!currentUser,
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: string }) =>
      api.reservations.updateStatus(Number(id), { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dashboard", "reservations", "mes-biens"] }),
  });

  const myReservations = unwrapList(reservationsQuery.data);

  const counts = {
    pending: myReservations.filter((r: any) => r.status === "pending" || r.status === "en_attente").length,
    confirmed: myReservations.filter((r: any) => r.status === "confirmed" || r.status === "acceptee").length,
    cancelled: myReservations.filter((r: any) => r.status === "cancelled" || r.status === "refusee").length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Mes reservations</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {myReservations.length} reservation{myReservations.length !== 1 ? "s" : ""} au total
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(["pending", "confirmed", "cancelled"] as const).map((status) => {
          const cfg = statusConfig[status];
          const Icon = cfg.icon;
          return (
            <div key={status} className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.cls}`}>
              <Icon className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-lg font-bold">{counts[status]}</p>
                <p className="text-xs">{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {myReservations.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <CalendarCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Aucune reservation</h3>
          <p className="text-sm text-muted-foreground">Les demandes de visite apparaitront ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myReservations.map((r: any) => {
            const cfg = statusConfig[r.status] ?? statusConfig.pending;
            const StatusIcon = cfg.icon;
            const isPending = r.status === "pending" || r.status === "en_attente";

            return (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4" data-testid={`reservation-${r.id}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-semibold text-foreground">
                        {r.client_nom || r.utilisateur || "Client"}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-1 ${cfg.cls}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{r.bien_titre || "Bien inconnu"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        {r.date}
                      </span>
                      {r.client_telephone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {r.client_telephone}
                        </span>
                      )}
                    </div>
                    {(r.message || r.messag) && (
                      <div className="mt-2 flex items-start gap-1.5 bg-muted/40 rounded-lg px-3 py-2">
                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-foreground/80 italic">{r.message ?? r.messag}</p>
                      </div>
                    )}
                    {isPending && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="bg-accent text-white gap-1.5 text-xs"
                          onClick={() => updateMutation.mutate({ id: r.id, status: "confirmed" })}
                          data-testid={`accept-${r.id}`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/5 gap-1.5 text-xs"
                          onClick={() => updateMutation.mutate({ id: r.id, status: "cancelled" })}
                          data-testid={`refuse-${r.id}`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Refuser
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

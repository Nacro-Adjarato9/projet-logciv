import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CheckCircle, XCircle, Clock, Phone, MessageSquare, Building2 } from "lucide-react";

const statusConfig = {
  en_attente: { label: "En attente", cls: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  acceptee: { label: "Acceptée", cls: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  refusee: { label: "Refusée", cls: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

export default function ReservationsTab() {
  const { currentUser } = useAuth();
  const { reservations, properties, updateReservationStatus } = useStore();
  const myReservations = reservations
    .filter((r) => r.ownerId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getProp = (id: string) => properties.find((p) => p.id === id);

  const counts = {
    en_attente: myReservations.filter((r) => r.status === "en_attente").length,
    acceptee: myReservations.filter((r) => r.status === "acceptee").length,
    refusee: myReservations.filter((r) => r.status === "refusee").length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Mes réservations</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{myReservations.length} réservation{myReservations.length !== 1 ? "s" : ""} au total</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {(["en_attente", "acceptee", "refusee"] as const).map((status) => {
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
          <h3 className="font-semibold text-foreground mb-1">Aucune réservation</h3>
          <p className="text-sm text-muted-foreground">Les demandes de visite apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myReservations.map((r) => {
            const prop = getProp(r.propertyId);
            const cfg = statusConfig[r.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4" data-testid={`reservation-${r.id}`}>
                <div className="flex items-start gap-4">
                  {prop?.images[0] && (
                    <img src={prop.images[0]} alt={prop.titre} className="w-16 h-16 rounded-lg object-cover border border-border shrink-0 hidden sm:block" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-semibold text-foreground">{r.clientName}</h3>
                      <span className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-1 ${cfg.cls}`}>
                        <StatusIcon className="w-3.5 h-3.5" />{cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{prop?.titre ?? "Bien inconnu"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarCheck className="w-3.5 h-3.5" />{r.date} à {r.time}
                      </span>
                      {r.clientPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />{r.clientPhone}
                        </span>
                      )}
                    </div>
                    {r.message && (
                      <div className="mt-2 flex items-start gap-1.5 bg-muted/40 rounded-lg px-3 py-2">
                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-foreground/80 italic">{r.message}</p>
                      </div>
                    )}
                    {r.status === "en_attente" && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-accent text-white gap-1.5 text-xs"
                          onClick={() => updateReservationStatus(r.id, "acceptee")} data-testid={`accept-${r.id}`}>
                          <CheckCircle className="w-3.5 h-3.5" /> Accepter
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5 gap-1.5 text-xs"
                          onClick={() => updateReservationStatus(r.id, "refusee")} data-testid={`refuse-${r.id}`}>
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

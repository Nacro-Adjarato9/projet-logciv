import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 border-yellow-300 text-yellow-700",
  confirmed: "bg-green-100 border-green-300 text-green-700",
  cancelled: "bg-red-100 border-red-300 text-red-600",
  loue: "bg-gray-100 border-gray-300 text-gray-600",
  vendu: "bg-gray-100 border-gray-300 text-gray-600",
  en_attente: "bg-yellow-100 border-yellow-300 text-yellow-700",
  acceptee: "bg-green-100 border-green-300 text-green-700",
  refusee: "bg-red-100 border-red-300 text-red-600",
};

function unwrapList(data: any) {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

export default function CalendrierTab() {
  const { currentUser } = useAuth();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const reservationsQuery = useQuery({
    queryKey: ["dashboard", "calendar", currentMonth, currentYear],
    queryFn: () => api.reservations.list(),
    enabled: !!currentUser,
    staleTime: 30_000,
  });

  const myReservations = unwrapList(reservationsQuery.data);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const getResForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return myReservations.filter((r: any) => (r.date ?? r.date_debut) === dateStr);
  };

  const selectedReservations = selectedDate
    ? myReservations.filter((r: any) => (r.date ?? r.date_debut) === selectedDate)
    : myReservations.filter((r: any) => {
        const d = new Date(r.date ?? r.date_debut);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Calendrier des visites</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Visualisez vos visites programmées</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" className="p-2" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
            <h3 className="font-semibold text-foreground">{MONTHS[currentMonth]} {currentYear}</h3>
            <Button variant="outline" size="sm" className="p-2" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayRes = getResForDay(day);
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              const isSelected = selectedDate === dateStr;
              return (
                <button
                  key={day}
                  type="button"
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all ${isSelected ? "bg-primary text-white" : isToday ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted text-foreground"}`}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                >
                  {day}
                  {dayRes.length > 0 && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-primary"}`} />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" />Visite programmée</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary/20 border border-primary" />Aujourd&apos;hui</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-3">
            {selectedDate ? `Visites du ${new Date(selectedDate).toLocaleDateString("fr-CI")}` : `Visites de ${MONTHS[currentMonth]}`}
          </h3>
          {selectedReservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucune visite{selectedDate ? " ce jour" : " ce mois"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedReservations.map((r: any) => {
                const prop = (r.bien ?? r.property ?? null) as any;
                const status = r.status ?? "pending";
                return (
                  <div key={r.id} className={`border rounded-xl p-3 ${statusColors[status] ?? statusColors.pending}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs font-semibold">{r.date ?? r.date_debut} · {r.time ?? r.heure ?? "--"}</span>
                    </div>
                    <p className="text-sm font-medium">{r.clientName ?? r.client_name ?? "Client"}</p>
                    {prop && (
                      <div className="flex items-center gap-1 text-xs mt-0.5 opacity-80">
                        <MapPin className="w-3 h-3" />{prop.titre}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

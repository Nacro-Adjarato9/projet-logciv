import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Pencil, Trash2, PlusCircle, BedDouble, Maximize2 } from "lucide-react";

const statusColors: Record<string, string> = {
  disponible: "bg-green-100 text-green-700 border-green-200",
  reserve: "bg-yellow-100 text-yellow-700 border-yellow-200",
  loue: "bg-gray-100 text-gray-600 border-gray-200",
  vendu: "bg-gray-100 text-gray-600 border-gray-200",
  indisponible: "bg-gray-100 text-gray-600 border-gray-200",
};
const statusLabels: Record<string, string> = {
  disponible: "Disponible",
  reserve: "Réservé",
  loue: "Loué",
  vendu: "Vendu",
  indisponible: "Indisponible",
};

function unwrapList(data: any) {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

export default function BiensTab({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const biensQuery = useQuery({
    queryKey: ["dashboard", "biens", "mes"],
    queryFn: () => api.biens.mesBiens(),
    enabled: !!currentUser,
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, statut }: { id: number | string; statut: string }) =>
      api.biens.update(Number(id), { statut }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard", "biens", "mes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => api.biens.remove(Number(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard", "biens", "mes"] }),
  });

  const apiProps = unwrapList(biensQuery.data);
  const myProps = apiProps;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Mes biens</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {myProps.length} bien{myProps.length !== 1 ? "s" : ""} publié{myProps.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button className="bg-primary text-white gap-2" onClick={() => onTabChange("ajouter-bien")} data-testid="button-ajouter-bien">
          <PlusCircle className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      {myProps.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Aucun bien publié</h3>
          <p className="text-sm text-muted-foreground mb-4">Commencez par publier votre premier bien immobilier.</p>
          <Button className="bg-primary text-white gap-2" onClick={() => onTabChange("ajouter-bien")}>
            <PlusCircle className="w-4 h-4" /> Publier un bien
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {myProps.map((p: any) => {
            const statut = p.statut ?? p.status ?? "disponible";
            return (
              <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                <div className="relative h-44">
                  <img
                    src={p.images?.[0] ?? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"}
                    alt={p.titre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs border rounded-full px-2.5 py-1 font-medium ${statusColors[statut] ?? statusColors.indisponible}`}>
                      {statusLabels[statut] ?? statut}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-foreground/80 text-background text-xs rounded-full px-2.5 py-1">
                      {p.categorie ?? p.category ?? "Bien"}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <h3 className="font-semibold text-foreground leading-tight line-clamp-2">{p.titre}</h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs truncate">{p.quartier ?? p.commune ?? p.ville}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {p.pieces != null && p.pieces > 0 && (
                      <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{p.pieces} pièces</span>
                    )}
                    {p.chambres != null && p.chambres > 0 && (
                      <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.chambres} ch.</span>
                    )}
                    {p.superficie != null && (
                      <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{p.superficie}m²</span>
                    )}
                  </div>
                  <p className="font-bold text-foreground text-sm mt-1">
                    {Number(p.prix ?? 0).toLocaleString("fr-CI")} FCFA
                    <span className="font-normal text-muted-foreground">
                      {(p.categorie ?? p.category) === "Location" ? "/mois" : ""}
                    </span>
                  </p>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <select
                    className="flex-1 text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    value={statut}
                    onChange={(e) => updateMutation.mutate({ id: p.id, statut: e.target.value })}
                    data-testid={`select-statut-${p.id}`}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reserve">Réservé</option>
                    <option value="loue">Loué</option>
                    <option value="vendu">Vendu</option>
                  </select>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs px-3">
                    <Pencil className="w-3.5 h-3.5" /> Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/5 px-3"
                    onClick={() => deleteMutation.mutate(p.id)}
                    data-testid={`delete-bien-${p.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

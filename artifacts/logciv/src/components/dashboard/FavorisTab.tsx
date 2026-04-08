import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { Heart, MapPin, Building2, BedDouble, Maximize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FavorisTab() {
  const { currentUser } = useAuth();
  const { properties, favorites, toggleFavorite } = useStore();

  const favIds = favorites[currentUser?.id ?? ""] ?? [];
  const favProperties = properties.filter((p) => favIds.includes(p.id));

  const statusColors: Record<string, string> = {
    disponible: "bg-green-100 text-green-700 border-green-200",
    reserve: "bg-yellow-100 text-yellow-700 border-yellow-200",
    indisponible: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const statusLabels: Record<string, string> = { disponible: "Disponible", reserve: "Réservé", indisponible: "Indisponible" };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Favoris</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{favProperties.length} bien{favProperties.length !== 1 ? "s" : ""} sauvegardé{favProperties.length !== 1 ? "s" : ""}</p>
      </div>

      {favProperties.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Aucun favori</h3>
          <p className="text-sm text-muted-foreground">Les biens que vous sauvegardez apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {favProperties.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40">
                <img src={p.images[0]} alt={p.titre} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <span className={`text-xs border rounded-full px-2.5 py-1 font-medium ${statusColors[p.statut]}`}>
                    {statusLabels[p.statut]}
                  </span>
                </div>
                <button
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  onClick={() => currentUser && toggleFavorite(currentUser.id, p.id)}
                  data-testid={`remove-fav-${p.id}`}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground leading-tight line-clamp-2 mb-1">{p.titre}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs">{p.quartier}, {p.commune}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
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
                <p className="font-bold text-foreground">{p.prix.toLocaleString("fr-CI")} FCFA<span className="font-normal text-muted-foreground text-sm">{p.categorie === "Location" ? "/mois" : ""}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

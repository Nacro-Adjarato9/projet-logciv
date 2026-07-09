import { useEffect, useState } from "react";
import { biensAPI, favorisAPI } from "../services/api";

interface Bien {
  id: number;
  titre: string;
  description: string;
  prix: number;
  ville: string;
}

function BiensList() {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBiens = async () => {
      try {
        const data = await biensAPI.list();
        setBiens(Array.isArray(data) ? data : data?.results ?? []);
      } catch (err: any) {
        setError(err?.message || "Erreur lors du chargement des biens");
      } finally {
        setLoading(false);
      }
    };

    fetchBiens();
  }, []);

  const handleToggleFavori = async (bienId: number) => {
    try {
      await favorisAPI.toggle({ bien_id: bienId });
      alert("Favori mis a jour !");
    } catch (err: any) {
      alert("Erreur: " + (err?.message || "Impossible de mettre a jour le favori"));
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Biens</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {biens.map((bien) => (
          <div key={bien.id} className="border rounded-lg p-4 shadow">
            <h3 className="font-semibold">{bien.titre}</h3>
            <p className="text-gray-600">{bien.description}</p>
            <p className="text-lg font-bold text-green-600">
              {bien.prix.toLocaleString()} FCFA
            </p>
            <p className="text-sm text-gray-500">{bien.ville}</p>
            <button
              onClick={() => handleToggleFavori(bien.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ajouter aux favoris
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BiensList;

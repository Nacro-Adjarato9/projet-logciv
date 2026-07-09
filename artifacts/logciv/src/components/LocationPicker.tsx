import { useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

const containerStyle = { width: "100%", height: "280px", borderRadius: "0.75rem" };

const ABIDJAN_CENTER = { lat: 5.3599517, lng: -4.0082563 };

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (coords: { lat: number; lng: number }) => void;
}

export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "logciv-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [center] = useState(
    latitude && longitude ? { lat: latitude, lng: longitude } : ABIDJAN_CENTER
  );

  const handleClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    },
    [onChange]
  );

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
        <MapPin className="w-5 h-5" />
        Carte indisponible : ajoute une clé dans <code className="font-mono">VITE_GOOGLE_MAPS_API_KEY</code> (fichier .env.local).
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="border border-destructive/20 bg-destructive/5 rounded-xl p-4 text-sm text-destructive">
        Impossible de charger Google Maps. Vérifie ta clé API et les API activées (Maps JavaScript API).
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="border border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={latitude && longitude ? 15 : 12}
        onClick={handleClick}
      >
        {latitude && longitude && <Marker position={{ lat: latitude, lng: longitude }} />}
      </GoogleMap>
      <p className="text-xs text-muted-foreground">
        Cliquez sur la carte pour placer le bien.
        {latitude && longitude && (
          <span className="ml-1 font-medium text-foreground">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        )}
      </p>
    </div>
  );
}

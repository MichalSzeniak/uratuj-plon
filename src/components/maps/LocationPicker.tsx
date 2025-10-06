// src/components/maps/LocationPicker.tsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";

// Napraw problem z domyślnymi ikonami Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Customowa ikona dla LocationPicker
const createPickerIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 30px;
        height: 40px;
      ">
        <svg width="30" height="40" viewBox="0 0 30 40">
          <path
            d="M15 40s-10-6.5-10-17.5c0-5.5 4.5-10 10-10s10 4.5 10 10c0 11-10 17.5-10 17.5z"
            fill="#000"
            fillOpacity="0.2"
            transform="translate(0, 2)"
          />
          <path
            d="M15 38s-10-6.5-10-17.5c0-5.5 4.5-10 10-10s10 4.5 10 10c0 11-10 17.5-10 17.5z"
            fill="#dc2626"
            stroke="#fff"
            strokeWidth="2"
          />
          <circle cx="15" cy="18" r="6" fill="#fff" fillOpacity="0.9" />
          <circle cx="15" cy="18" r="3" fill="#dc2626" />
        </svg>
        <div style="
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #dc2626;
          color: white;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          border: 1px solid white;
        ">
          Tutaj
        </div>
      </div>
    `,
    className: "location-picker-marker",
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });
};

// Komponent do obsługi kliknięć na mapie
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      console.log("🗺️ Map clicked:", { lat, lng });

      // Reverse geocoding - spróbuj pobrać adres
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("🌍 Reverse geocoding result:", data);

          if (data.address) {
            const address = [
              data.address.road,
              data.address.house_number,
              data.address.city || data.address.town || data.address.village,
              data.address.postcode,
            ]
              .filter(Boolean)
              .join(", ");

            // Wywołaj callback z danymi
            onLocationSelect(lat, lng);

            // Pokazuj informację
            toast.success("📍 Lokalizacja ustawiona", {
              description: `Adres: ${address || "Brak szczegółów"}`,
            });
          }
        })
        .catch((error) => {
          console.log("❌ Reverse geocoding failed, using coordinates only");
          onLocationSelect(lat, lng);
          toast.success("📍 Lokalizacja ustawiona");
        });
    },
  });
  return null;
}

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
  height?: string;
}

export function LocationPicker({
  onLocationSelect,
  initialLocation = { lat: 52.0, lng: 19.0 },
  height = "300px",
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(
    initialLocation.lat !== 0 && initialLocation.lng !== 0
      ? initialLocation
      : null
  );

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    onLocationSelect(lat, lng);
  };

  // Aktualizuj initialLocation gdy się zmienia
  useEffect(() => {
    if (initialLocation.lat !== 0 && initialLocation.lng !== 0) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  return (
    <div className="space-y-3">
      {/* Instrukcja */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p className="font-medium">🗺️ Jak ustawić lokalizację:</p>
        <ol className="list-decimal list-inside space-y-1 mt-1">
          <li>Przybliż mapę do Twojej okolicy</li>
          <li>Kliknij dokładnie w miejsce Twojego gospodarstwa</li>
          <li>Czerwony znacznik pokaże wybraną lokalizację</li>
        </ol>
      </div>

      {/* Mapa */}
      <div
        className="border-2 border-gray-300 rounded-lg overflow-hidden"
        style={{ height }}
      >
        <MapContainer
          center={selectedLocation || [52.0, 19.0]}
          zoom={selectedLocation ? 12 : 6}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler onLocationSelect={handleLocationSelect} />

          {/* Wybrany marker */}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createPickerIcon()}
            />
          )}
        </MapContainer>
      </div>

      {/* Informacje o wybranej lokalizacji */}
      {selectedLocation && (
        <div className="text-sm text-gray-700 p-3 bg-green-50 rounded-lg">
          <p className="font-medium">✅ Lokalizacja wybrana</p>
          <p>
            Szerokość: <strong>{selectedLocation.lat.toFixed(6)}</strong>,
            Długość: <strong>{selectedLocation.lng.toFixed(6)}</strong>
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedLocation(null);
              onLocationSelect(0, 0);
            }}
            className="text-xs text-red-600 hover:text-red-800 mt-1"
          >
            ❌ Wyczyść lokalizację
          </button>
        </div>
      )}

      {!selectedLocation && (
        <div className="text-sm text-amber-700 p-3 bg-amber-50 rounded-lg">
          <p className="font-medium">⚠️ Wybierz lokalizację</p>
          <p>Kliknij na mapie aby ustawić lokalizację Twojego ogłoszenia</p>
        </div>
      )}
    </div>
  );
}

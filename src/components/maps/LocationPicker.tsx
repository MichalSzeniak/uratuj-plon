import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      fetchAddressFromCoordinates(lat, lng, onLocationSelect);
    },
  });
  return null;
}

// Funkcja do geokodowania - zamiana adresu na współrzędne
const fetchCoordinatesFromAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name,
      };
    }
    return null;
  } catch (error) {
    console.error("Błąd geokodowania:", error);
    return null;
  }
};

// Funkcja do reverse geokodowania - zamiana współrzędnych na adres
const fetchAddressFromCoordinates = async (
  lat: number,
  lng: number,
  callback: (lat: number, lng: number, address?: string) => void
) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();

    let address = "";
    if (data.address) {
      address = [
        data.address.road,
        data.address.house_number,
        data.address.city || data.address.town || data.address.village,
      ]
        .filter(Boolean)
        .join(", ");
    }

    callback(
      lat,
      lng,
      address || data.display_name || "Brak szczegółów adresu"
    );
    toast.success("📍 Lokalizacja ustawiona", {
      description: `Adres: ${address || "Brak szczegółów"}`,
    });
  } catch (err) {
    callback(lat, lng);
    toast.success("📍 Lokalizacja ustawiona");
  }
};

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onAddressSelect?: (address: string) => void;
  initialLocation?: { lat: number; lng: number };
  initialAddress?: string;
  height?: string;
}

export function LocationPicker({
  onLocationSelect,
  onAddressSelect,
  initialLocation = { lat: 52.0, lng: 19.0 },
  initialAddress = "",
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
  const [addressInput, setAddressInput] = useState(initialAddress);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<L.Map>(null);

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setSelectedLocation({ lat, lng });
    onLocationSelect(lat, lng);

    if (address) {
      setAddressInput(address);
      onAddressSelect?.(address);
    }

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 16);
    }
  };

  const handleAddressSearch = async () => {
    if (!addressInput.trim()) return;

    setIsSearching(true);
    try {
      const result = await fetchCoordinatesFromAddress(addressInput);
      if (result) {
        handleLocationSelect(result.lat, result.lng, result.display_name);
        toast.success("📍 Znaleziono lokalizację", {
          description: `Przesunięto mapę na: ${result.display_name}`,
        });
      } else {
        toast.error("Nie znaleziono adresu");
      }
    } catch (error) {
      toast.error("Błąd podczas wyszukiwania adresu");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
    setAddressInput("");
    onLocationSelect(0, 0);
    onAddressSelect?.("");
  };

  useEffect(() => {
    if (initialLocation.lat !== 0 && initialLocation.lng !== 0) {
      setSelectedLocation(initialLocation);
    }
    if (initialAddress) {
      setAddressInput(initialAddress);
    }
  }, [initialLocation, initialAddress]);

  return (
    <div className="space-y-3 ">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          🔍 Wyszukaj adres
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Wpisz adres (ulica, miasto, kod pocztowy)..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleAddressSearch()}
          />
          <Button
            onClick={handleAddressSearch}
            disabled={isSearching || !addressInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSearching ? "..." : "Szukaj"}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Wpisz adres i kliknij "Szukaj", lub kliknij bezpośrednio na mapie
        </p>
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p className="font-medium">🗺️ Jak ustawić lokalizację:</p>
        <ol className="list-decimal list-inside space-y-1 mt-1">
          <li>
            Wpisz adres i kliknij "Szukaj" LUB kliknij bezpośrednio na mapie
          </li>
          <li>Mapa automatycznie przeniesie się do wybranej lokalizacji</li>
          <li>Czerwony znacznik pokaże dokładną pozycję</li>
        </ol>
      </div>

      <div
        className="border-2 border-gray-300 rounded-lg overflow-hidden"
        style={{ height }}
      >
        <MapContainer
          center={selectedLocation || [52.0, 19.0]}
          zoom={selectedLocation ? 16 : 6}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler onLocationSelect={handleLocationSelect} />

          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createPickerIcon()}
            />
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="text-sm text-gray-700 p-3 bg-green-50 rounded-lg">
          <p className="font-medium">✅ Lokalizacja wybrana</p>
          <p className="font-semibold mb-1">
            {addressInput || "Adres nieznany"}
          </p>
          <p>
            Szerokość: <strong>{selectedLocation.lat.toFixed(6)}</strong>,
            Długość: <strong>{selectedLocation.lng.toFixed(6)}</strong>
          </p>
          <button
            type="button"
            onClick={handleClearLocation}
            className="text-xs text-red-600 hover:text-red-800 mt-1"
          >
            ❌ Wyczyść lokalizację
          </button>
        </div>
      )}

      {!selectedLocation && (
        <div className="text-sm text-amber-700 p-3 bg-amber-50 rounded-lg">
          <p className="font-medium">⚠️ Wybierz lokalizację</p>
          <p>Wyszukaj adres lub kliknij na mapie aby ustawić lokalizację</p>
        </div>
      )}
    </div>
  );
}

// src/components/maps/FarmMap.tsx - POPRAWIONA WERSJA
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useFarms } from "@/hooks/useFarms";
import { FarmPopup } from "./FarmPopup";
import { MapControls } from "./MapControls";
import { RescueListings } from "./RescueListings";
import { getFarmCoordinates, type Farm } from "@/types/map";

// Domyślne centrum - Polska
const DEFAULT_CENTER: [number, number] = [52.0, 19.0];
const DEFAULT_ZOOM = 6;

// Custom hook do obsługi zmiany widoku mapy
function MapViewUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

interface FarmMapProps {
  showRescueOnly?: boolean;
  onFarmSelect?: (farm: Farm) => void;
}

export function FarmMap({
  showRescueOnly = false,
  onFarmSelect,
}: FarmMapProps) {
  const { data: farms, isLoading, error } = useFarms();
  const [viewport, setViewport] = useState({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  console.log("FarmMap - Status:", {
    isLoading,
    error,
    farmsCount: farms?.length,
  }); // Debug

  // Filtrowanie gospodarstw - tylko z "akcjami ratunkowymi"
  const filteredFarms = showRescueOnly
    ? farms?.filter((farm) =>
        farm.listings?.some((listing) => listing.price_type === "rescue")
      )
    : farms;

  // Sprawdź czy gospodarstwa mają poprawne współrzędne
  const farmsWithValidCoordinates = filteredFarms?.filter((farm) => {
    const coords = getFarmCoordinates(farm);
    return (
      coords.lat !== undefined &&
      coords.lng !== undefined &&
      coords.lat !== 0 &&
      coords.lng !== 0
    ); // Filtruj (0,0)
  });

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie mapy gospodarstw...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center text-red-600">
          <p>Błąd podczas ładowania mapy</p>
          <p className="text-sm mt-2">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Kontrolki mapy */}
      <MapControls
        viewport={viewport}
        onViewportChange={setViewport}
        farmCount={farmsWithValidCoordinates?.length || 0}
      />

      {/* Lista akcji ratunkowych (dla widoku ratunkowego) */}
      {showRescueOnly && <RescueListings farms={filteredFarms || []} />}

      {/* Główna mapa */}
      <MapContainer
        center={viewport.center}
        zoom={viewport.zoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg z-0"
        scrollWheelZoom={true}
      >
        <MapViewUpdater center={viewport.center} zoom={viewport.zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markery gospodarstw */}
        {farmsWithValidCoordinates?.map((farm) => {
          const coordinates = getFarmCoordinates(farm);

          return (
            <Marker key={farm.id} position={[coordinates.lat, coordinates.lng]}>
              <Popup>
                <FarmPopup farm={farm} onSelect={onFarmSelect} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Komunikat jeśli brak gospodarstw */}
      {farmsWithValidCoordinates?.length === 0 && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {showRescueOnly ? "Brak akcji ratunkowych" : "Brak gospodarstw"}
            </h3>
            <p className="text-gray-600 mb-4">
              {showRescueOnly
                ? "Obecnie nie ma żadnych akcji ratunkowych w Twojej okolicy."
                : "Jeszcze nie ma gospodarstw w naszej bazie. Bądź pierwszy!"}
            </p>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
              Dodaj pierwsze gospodarstwo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

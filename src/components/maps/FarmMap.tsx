// src/components/maps/FarmMap.tsx - NOWA WERSJA
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useListings } from "@/hooks/useListings";
import { FarmPopup } from "./FarmPopup";
import { MapControls } from "./MapControls";
import { RescueListings } from "./RescueListings";
import { createFarmIcon } from "./CustomMarkers";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";

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

// Hook do obsługi resize mapy
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

interface FarmMapProps {
  showRescueOnly?: boolean;
  onFarmSelect?: (listing: any) => void;
}

export function FarmMap({
  showRescueOnly = false,
  onFarmSelect,
}: FarmMapProps) {
  const { data: listings, isLoading, error } = useListings();
  const [viewport, setViewport] = useState({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });
  const [mapReady, setMapReady] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const mapRef = useRef<L.Map | null>(null);

  console.log("FarmMap - Status:", {
    isLoading,
    error,
    listingsCount: listings?.length,
    mapReady,
  });

  // Filtrowanie ogłoszeń - tylko "akcje ratunkowe"
  const filteredListings = showRescueOnly
    ? listings?.filter((listing) => listing.price_type === "rescue")
    : listings;

  // Sprawdź czy ogłoszenia mają poprawne współrzędne
  const listingsWithValidCoordinates = filteredListings?.filter((listing) => {
    return (
      listing.latitude !== undefined &&
      listing.longitude !== undefined &&
      listing.latitude !== 0 &&
      listing.longitude !== 0
    );
  });

  // Efekt dla inicjalizacji mapy
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Efekt dla invalidate size gdy mapa jest gotowa
  useEffect(() => {
    if (mapReady && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [mapReady]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie mapy ogłoszeń...</p>
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
        farmCount={listingsWithValidCoordinates?.length || 0}
        showRescueOnly={showRescueOnly}
        onToggleRescue={() => {}} // TODO: Zaimplementować toggle
      />

      {/* Lista akcji ratunkowych (dla widoku ratunkowego) */}
      {showRescueOnly && <RescueListings listings={filteredListings || []} />}

      {/* Główna mapa */}
      <div className="h-full w-full">
        <MapContainer
          center={viewport.center}
          zoom={viewport.zoom}
          style={{ height: "100%", width: "100%" }}
          className="rounded-lg z-0"
          scrollWheelZoom={true}
          ref={mapRef}
          whenReady={() => {
            setMapReady(true);
            setTimeout(() => {
              mapRef.current?.invalidateSize();
            }, 100);
          }}
        >
          <MapResizer />
          <MapViewUpdater center={viewport.center} zoom={viewport.zoom} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Markery ogłoszeń */}
          <MarkerClusterGroup>
            {listingsWithValidCoordinates?.map((listing) => {
              return (
                <Marker
                  key={listing.id}
                  position={[listing.latitude, listing.longitude]}
                  icon={createFarmIcon(listing)}
                >
                  <Popup>
                    <FarmPopup listing={listing} onSelect={onFarmSelect} />
                  </Popup>
                </Marker>
                // <Marker
                //   key={listing.id}
                //   position={[listing.latitude, listing.longitude]}
                //   icon={createFarmIcon(listing)}
                //   eventHandlers={{
                //     click: () => {
                //       setSelectedListing(listing);
                //       onFarmSelect?.(listing);
                //     },
                //   }}
                // ></Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Komunikat jeśli brak ogłoszeń */}
      {listingsWithValidCoordinates?.length === 0 && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {showRescueOnly ? "Brak akcji ratunkowych" : "Brak ogłoszeń"}
            </h3>
            <p className="text-gray-600 mb-4">
              {showRescueOnly
                ? "Obecnie nie ma żadnych akcji ratunkowych w Twojej okolicy."
                : "Jeszcze nie ma ogłoszeń w naszej bazie. Bądź pierwszy!"}
            </p>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
              Dodaj pierwsze ogłoszenie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

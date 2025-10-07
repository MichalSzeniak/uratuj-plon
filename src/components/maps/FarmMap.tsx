import { useEffect, useState, useRef } from "react";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { useListings } from "@/hooks/useListings";
import { FarmPopup } from "./FarmPopup";
import { RescueListings } from "./RescueListings";
import { MobileMapControls } from "./MobileMapControls";
import { createFarmIcon } from "./CustomMarkers";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { ReliableTileLayer } from "./ReliableTileLayer";

const DEFAULT_CENTER: [number, number] = [52.0, 19.0];
const DEFAULT_ZOOM = 6;

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
  const navigate = useNavigate();

  // Hook do wykrywania mobile/desktop
  // const isMobile = useMediaQuery("(max-width: 1024px)");

  const isMobile = window.innerWidth < 1024; // lg breakpoint

  console.log("FarmMap - Status:", {
    isLoading,
    error,
    listingsCount: listings?.length,
    mapReady,
    isMobile,
    selectedListing: selectedListing?.id,
  });

  // Filtrowanie ogłoszeń
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

  // Handlery dla markerów
  const handleMarkerClick = (listing: any) => {
    console.log("📍 Marker clicked:", listing.id, "Mobile:", isMobile);
    setSelectedListing(listing);

    // Na desktop od razu pokazujemy popup (Leaflet się tym zajmuje)
    // Na mobile pokazujemy nasze custom controls
  };

  const handleShowDetails = () => {
    if (selectedListing) {
      console.log("📱 Navigating to listing:", selectedListing.id);
      navigate(`/listing/${selectedListing.id}`);
      setSelectedListing(null); // Reset po nawigacji
    }
  };

  const handleNavigate = () => {
    if (selectedListing?.latitude && selectedListing?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedListing.latitude},${selectedListing.longitude}`;
      window.open(url, "_blank");
    }
  };

  const handleCall = () => {
    // Tutaj później dodamy prawdziwy numer
    console.log("📞 Call action for:", selectedListing?.id);
    // toast.info("📞 Otwieranie aplikacji telefonu...");
  };

  const handleCloseMobileControls = () => {
    setSelectedListing(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mapReady && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [mapReady]);

  const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();

    let color = "bg-sky-500";
    if (count >= 10 && count < 50) color = "bg-yellow-500";
    if (count >= 50) color = "bg-red-500";

    const size = count < 10 ? "w-5 h-5" : count < 50 ? "w-6 h-6" : "w-6 h-6";

    return L.divIcon({
      html: `
      <div class="flex items-center justify-center ${color} ${size} rounded-full text-white font-bold shadow-lg ring-2 ring-white">
        <span>${count}</span>
      </div>
    `,
      className: "custom-cluster-icon",
      iconSize: L.point(40, 40, true),
    });
  };

  const handleMobileMarkerClick = (listing: any) => {
    console.log("📱 Mobile marker click:", listing.id);
    setSelectedListing(listing);
  };

  const handleDesktopMarkerClick = () => {
    return;
  };

  if (isLoading) {
    return <div>Ładowanie mapy...</div>;
  }

  if (error) {
    return <div>Błąd podczas ładowania mapy</div>;
  }

  return (
    <div className="h-full w-full relative">
      {showRescueOnly && <RescueListings listings={filteredListings || []} />}

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

          {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> */}

          <ReliableTileLayer />

          <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
            {listingsWithValidCoordinates?.map((listing) => {
              return (
                <Marker
                  key={listing.id}
                  position={[listing.latitude, listing.longitude]}
                  icon={createFarmIcon(listing)}
                  eventHandlers={{
                    click: isMobile
                      ? () => handleMobileMarkerClick(listing)
                      : () => handleDesktopMarkerClick(),
                  }}
                >
                  {!isMobile && (
                    <Popup>
                      <FarmPopup listing={listing} onSelect={onFarmSelect} />
                    </Popup>
                  )}
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {isMobile && (
        <MobileMapControls
          selectedListing={selectedListing}
          onShowDetails={handleShowDetails}
          onNavigate={handleNavigate}
          onCall={handleCall}
          onClose={handleCloseMobileControls}
        />
      )}

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

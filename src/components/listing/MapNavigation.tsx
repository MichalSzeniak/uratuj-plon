// src/components/listing/MapNavigation.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MapNavigationProps {
  listing: any;
}

export function MapNavigation({ listing }: MapNavigationProps) {
  const openInGoogleMaps = () => {
    if (!listing.latitude || !listing.longitude) {
      toast.error("Brak danych lokalizacji dla tego ogłoszenia");
      return;
    }

    const { latitude, longitude } = listing;

    // Tworzymy URL do Google Maps
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

    // Otwieramy w nowej karcie
    window.open(googleMapsUrl, "_blank");

    toast.success("🗺️ Otwieranie nawigacji w Google Maps...");
  };

  const openInAppleMaps = () => {
    if (!listing.latitude || !listing.longitude) {
      toast.error("Brak danych lokalizacji dla tego ogłoszenia");
      return;
    }

    const { latitude, longitude } = listing;

    // URL dla Apple Maps
    const appleMapsUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;

    window.open(appleMapsUrl, "_blank");
    toast.success("🗺️ Otwieranie nawigacji w Apple Maps...");
  };

  const copyCoordinates = async () => {
    if (!listing.latitude || !listing.longitude) {
      toast.error("Brak danych lokalizacji");
      return;
    }

    const coordinates = `${listing.latitude}, ${listing.longitude}`;
    try {
      await navigator.clipboard.writeText(coordinates);
      toast.success("✅ Współrzędne skopiowane do schowka");
    } catch (err) {
      toast.error("❌ Nie udało się skopiować współrzędnych");
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">📍 Nawigacja</h3>

        <div className="space-y-3">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={openInGoogleMaps}
          >
            🗺️ Nawiguj (Google Maps)
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={openInAppleMaps}
          >
            🗺️ Nawiguj (Apple Maps)
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={copyCoordinates}
          >
            📋 Kopiuj współrzędne
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">{listing.address}</p>
          {listing.latitude && listing.longitude && (
            <p className="text-xs text-gray-500">
              Współrzędne: {listing.latitude.toFixed(6)},{" "}
              {listing.longitude.toFixed(6)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

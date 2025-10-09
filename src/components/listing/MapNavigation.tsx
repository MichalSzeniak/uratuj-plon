import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MapNavigationProps {
  listing: any;
}

export function MapNavigation({ listing }: MapNavigationProps) {
  const longitude = listing.location.coordinates[0];
  const latitude = listing.location.coordinates[1];

  const openInGoogleMaps = () => {
    if (!latitude || !longitude) {
      toast.error("Brak danych lokalizacji dla tego ogłoszenia");
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    window.open(googleMapsUrl, "_blank");

    toast.success("🗺️ Otwieranie nawigacji w Google Maps...");
  };

  return (
    <Card>
      <CardContent className="p-6 py-0">
        <h3 className="font-semibold mb-4">📍 Nawigacja</h3>

        <div className="space-y-3">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={openInGoogleMaps}
          >
            🗺️ Nawiguj (Google Maps)
          </Button>
        </div>

        <span>
          <p className="text-muted-foreground">{listing.address}</p>
          {listing.city && (
            <p className="text-muted-foreground mt-1">
              {listing.city}, {listing.region}
            </p>
          )}
        </span>
      </CardContent>
    </Card>
  );
}

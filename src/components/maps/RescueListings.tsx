// src/components/maps/RescueListings.tsx - NOWA WERSJA
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlertTriangle, MapPin, Calendar, X } from "lucide-react";
import { useState } from "react";

interface RescueListingsProps {
  listings: any[];
}

export function RescueListings({ listings }: RescueListingsProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Filtruj tylko akcje ratunkowe
  const rescueListings = listings.filter(
    (listing) => listing.price_type === "rescue" && listing.status === "active"
  );

  console.log("🔍 RescueListings debug:", {
    totalListings: listings.length,
    rescueListings: rescueListings.length,
    listings: rescueListings.map((l) => ({
      title: l.title,
      address: l.address,
    })),
  });

  // Funkcja pomocnicza do formatowania daty
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Komponent karty pojedynczej akcji ratunkowej
  const RescueCard = ({ listing }: { listing: any }) => (
    <Card
      key={listing.id}
      className="border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
    >
      <CardContent className="p-3">
        {/* Nagłówek z tytułem i ceną */}
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
            {listing.title}
          </h4>
          <Badge variant="destructive" className="flex-shrink-0 text-xs">
            {listing.price_per_unit
              ? `${listing.price_per_unit} zł`
              : "Za darmo"}
          </Badge>
        </div>

        {/* Opis */}
        {listing.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {listing.description}
          </p>
        )}

        {/* Metadane */}
        <div className="text-xs text-gray-500 space-y-1 mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="font-medium truncate" title={listing.address}>
              {listing.address}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-400">
            <span>
              👤 {listing.user?.full_name || listing.user?.username || "Anonim"}
            </span>
          </div>

          {listing.available_until && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Do: {formatDate(listing.available_until)}</span>
            </div>
          )}
        </div>

        {/* Powód akcji ratunkowej */}
        {listing.rescue_reason && (
          <div className="mb-2 p-2 bg-white border border-red-300 rounded text-xs">
            <p className="font-medium text-red-800 mb-1">⚠️ Powód:</p>
            <p className="text-red-700 line-clamp-2">{listing.rescue_reason}</p>
          </div>
        )}

        {/* Przycisk akcji */}
        <Link
          to={`/listing/${listing.id}`}
          className="w-full bg-red-500 text-white text-center py-1.5 px-2 rounded text-xs hover:bg-red-600 transition-colors block"
          onClick={() => setMobileSheetOpen(false)}
        >
          🚀 Ratuj plony!
        </Link>
      </CardContent>
    </Card>
  );

  // Brak akcji ratunkowych
  if (rescueListings.length === 0) {
    return (
      <>
        {/* Desktop */}
        <div className="hidden md:block absolute top-4 right-4 z-10">
          <Card className="shadow-lg max-w-xs">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Brak akcji ratunkowych</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile */}
        <div className="md:hidden fixed bottom-4 right-4 z-20">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 shadow-lg"
            disabled
          >
            <AlertTriangle className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block absolute top-4 right-4 z-10">
        <Card className="shadow-lg max-w-xs max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {/* Nagłówek */}
            <div className="sticky top-0 bg-white border-b p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-semibold text-sm">
                    Akcje Ratunkowe ({rescueListings.length})
                  </span>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {rescueListings.length}
                </Badge>
              </div>
            </div>

            {/* Lista */}
            <div className="p-3 space-y-3">
              {rescueListings.map((listing) => (
                <RescueCard key={listing.id} listing={listing} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg relative"
            >
              <AlertTriangle className="h-5 w-5" />
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {rescueListings.length}
              </Badge>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="font-semibold">
                  Akcje Ratunkowe ({rescueListings.length})
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSheetOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 overflow-y-auto pb-4">
              {rescueListings.map((listing) => (
                <RescueCard key={listing.id} listing={listing} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

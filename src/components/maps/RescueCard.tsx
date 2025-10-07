// src/components/maps/RescueCard.tsx
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User } from "lucide-react";

interface RescueCardProps {
  listing: any;
  onAction?: () => void;
}

export function RescueCard({ listing, onAction }: RescueCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const handleClick = () => {
    onAction?.();
  };

  return (
    <Card className="border-red-200 bg-red-50 hover:bg-red-100 transition-colors group">
      <CardContent className="p-3">
        {/* Nagłówek z tytułem i ceną */}
        <div className="flex justify-between items-start mb-2">
          <h4
            className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2 line-clamp-2"
            title={listing.title}
          >
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
          <p
            className="text-xs text-gray-600 mb-2 line-clamp-2"
            title={listing.description}
          >
            {listing.description}
          </p>
        )}

        {/* Metadane */}
        <div className="text-xs text-gray-500 space-y-1 mb-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate" title={listing.address}>
              {listing.address}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <User className="h-3 w-3 flex-shrink-0" />
            <span>
              {listing.user?.full_name || listing.user?.username || "Anonim"}
            </span>
          </div>

          {listing.available_until && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>Do: {formatDate(listing.available_until)}</span>
            </div>
          )}
        </div>

        {/* Powód akcji ratunkowej */}
        {listing.rescue_reason && (
          <div className="mb-2 p-2 bg-white border border-red-300 rounded text-xs">
            <p className="font-medium text-red-800 mb-1 flex items-center gap-1">
              ⚠️ Powód ratunkowy:
            </p>
            <p
              className="text-red-700 line-clamp-2"
              title={listing.rescue_reason}
            >
              {listing.rescue_reason}
            </p>
          </div>
        )}

        {/* Przycisk akcji */}
        <Link
          to={`/listing/${listing.id}`}
          className="w-full bg-red-500 text-white text-center py-1.5 px-2 rounded text-xs hover:bg-red-600 transition-colors block font-medium"
          onClick={handleClick}
        >
          🚀 Ratuj plony!
        </Link>
      </CardContent>
    </Card>
  );
}

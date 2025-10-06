import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface FarmPopupProps {
  listing: any;
  onSelect?: (listing: any) => void;
}

export function FarmPopup({ listing, onSelect }: FarmPopupProps) {
  const [showDetails, setShowDetails] = useState(false);
  const handleSelect = () => {
    if (onSelect) {
      onSelect(listing);
    }
  };

  return (
    <div className="min-w-[280px] max-w-[320px]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-tight">
            {listing.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {listing.user?.full_name || listing.user?.username || "Anonim"}
            </Badge>
            {listing.price_type === "rescue" && (
              <Badge variant="destructive" className="text-xs">
                🚨 Ratunkowe
              </Badge>
            )}
          </div>
        </div>
      </div>

      {listing.images && listing.images.length > 0 && (
        <div className="mb-3">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="space-y-2 mb-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {listing.description || "Brak opisu"}
        </p>

        {listing.address && (
          <p className="text-xs text-gray-500 flex items-center">
            📍 {listing.address}
          </p>
        )}
      </div>

      <Card className="mb-3">
        <CardContent className="p-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-900">
                {listing.price_per_unit
                  ? `${listing.price_per_unit} zł/${listing.unit}`
                  : "Za darmo"}
              </span>
              {listing.estimated_amount && (
                <p className="text-xs text-gray-500">
                  Szacowana ilość: {listing.estimated_amount} {listing.unit}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Od:{" "}
                {new Date(listing.available_from).toLocaleDateString("pl-PL")}
              </p>
              {listing.available_until && (
                <p className="text-xs text-gray-500">
                  Do:{" "}
                  {new Date(listing.available_until).toLocaleDateString(
                    "pl-PL"
                  )}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {listing.pickup_instructions && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-medium text-blue-800 mb-1">
            📋 Instrukcje odbioru:
          </p>
          <p className="text-xs text-blue-700">{listing.pickup_instructions}</p>
        </div>
      )}

      {listing.rescue_reason && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs font-medium text-red-800 mb-1">
            ⚠️ Powód akcji ratunkowej:
          </p>
          <p className="text-xs text-red-700">{listing.rescue_reason}</p>
        </div>
      )}

      {showDetails && (
        <div className="mt-3 space-y-2 border-t pt-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Typ produktu:</span>
              <p className="text-gray-600 capitalize">{listing.product_type}</p>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <p className="text-gray-600">
                {listing.status === "active" ? "Aktywne" : "Oczekujące"}
              </p>
            </div>
          </div>

          {/* Kontakt */}
          {listing.user && (
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs font-medium">Kontakt:</p>
              <p className="text-xs text-gray-600">{listing.user.full_name}</p>
            </div>
          )}
        </div>
      )}
      <div className="flex space-x-2 mt-3">
        <Link
          to={`/listing/${listing.id}`}
          className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded-lg text-sm hover:bg-green-700 transition-colors"
          onClick={() => onSelect?.(listing)}
        >
          Zobacz szczegóły
        </Link>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-gray-200 text-gray-700 p-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
          title="Pokaż więcej informacji"
        >
          {showDetails ? "▲" : "▼"}
        </button>
      </div>

      <div className="flex space-x-1 mt-2">
        <button className="flex-1 bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors">
          📞 Zadzwoń
        </button>
        <button className="flex-1 bg-orange-500 text-white text-xs py-1 px-2 rounded hover:bg-orange-600 transition-colors">
          📧 Wiadomość
        </button>
      </div>

      <div className="flex space-x-2">
        <Link
          to={`/listing/${listing.id}`}
          className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded-lg text-sm hover:bg-green-700 transition-colors"
          onClick={handleSelect}
        >
          Zobacz szczegóły
        </Link>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareButton } from "../ShareButton";
import {
  MapPin,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface FarmPopupProps {
  listing: any;
  onSelect?: (listing: any) => void;
}

export function FarmPopup({ listing, onSelect }: FarmPopupProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleSelect = () => {
    onSelect?.(listing);
  };

  const handleCall = () => {
    // Tutaj później dodamy prawdziwą logikę
    console.log("📞 Call:", listing.id);
  };

  const handleMessage = () => {
    // Tutaj później dodamy prawdziwą logikę
    console.log("📧 Message:", listing.id);
  };

  const productTypeLabels: { [key: string]: string } = {
    vegetables: "🥦 Warzywa",
    fruits: "🍎 Owoce",
    grains: "🌾 Zboża",
    honey: "🍯 Miód",
    eggs: "🥚 Jaja",
    dairy: "🧀 Nabiał",
    meat: "🥩 Mięso",
    preserves: "🥫 Przetwory",
  };

  return (
    <div className="min-w-[300px] max-w-[350px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base leading-tight pr-2">
            {listing.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
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

      {/* Zdjęcie */}
      {listing.images && listing.images.length > 0 && (
        <div className="mb-3">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className={`w-full h-32 object-cover rounded-lg ${
              !imageLoaded ? "bg-gray-200 animate-pulse" : ""
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}

      {/* Podstawowe informacje */}
      <div className="space-y-2 mb-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {listing.description || "Brak opisu"}
        </p>

        {listing.address && (
          <p className="text-xs text-gray-500 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {listing.address}
          </p>
        )}
      </div>

      {/* Cena i dostępność */}
      {/* <Card className="mb-3">
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm font-medium text-gray-900">
                {listing.price_per_unit
                  ? `${listing.price_per_unit} zł/${listing.unit}`
                  : "Za darmo"}
              </span>
              {listing.estimated_amount && (
                <p className="text-xs text-gray-500 mt-1">
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
      </Card> */}

      {/* Dodatkowe informacje */}
      {/* {listing.pickup_instructions && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-medium text-blue-800 mb-1">
            📋 Instrukcje odbioru:
          </p>
          <p className="text-xs text-blue-700">{listing.pickup_instructions}</p>
        </div>
      )} */}

      {/* {listing.rescue_reason && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs font-medium text-red-800 mb-1">
            ⚠️ Powód akcji ratunkowej:
          </p>
          <p className="text-xs text-red-700">{listing.rescue_reason}</p>
        </div>
      )} */}

      {/* Rozszerzone szczegóły */}
      {showDetails && (
        <div className="mt-3 space-y-3 border-t pt-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-medium text-gray-700">Typ produktu:</span>
              <p className="text-gray-600 mt-1">
                {productTypeLabels[listing.product_type] ||
                  listing.product_type}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <p className="text-gray-600 mt-1">
                {listing.status === "active" ? "🟢 Aktywne" : "🟡 Oczekujące"}
              </p>
            </div>
          </div>

          {listing.user && (
            <div className="bg-gray-50 p-2 rounded border">
              <p className="text-xs font-medium text-gray-700 mb-1">Kontakt:</p>
              <p className="text-xs text-gray-600">{listing.user.full_name}</p>
              {listing.user.username && (
                <p className="text-xs text-gray-500">
                  @{listing.user.username}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Główne przyciski akcji */}
      <div className="flex space-x-2 mb-3">
        <Link
          to={`/listing/${listing.id}`}
          className="flex-1 bg-green-600 text-white text-center py-2 px-3 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center"
          onClick={handleSelect}
        >
          <MapPin className="h-4 w-4 mr-1" />
          Szczegóły
        </Link>

        <ShareButton listing={listing} />

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowDetails(!showDetails)}
          className="flex-shrink-0"
          title={showDetails ? "Ukryj szczegóły" : "Pokaż więcej"}
        >
          {showDetails ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Szybkie akcje kontaktowe */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={handleCall}
        >
          <Phone className="h-3 w-3 mr-1" />
          Zadzwoń
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={handleMessage}
        >
          <MessageCircle className="h-3 w-3 mr-1" />
          Wiadomość
        </Button>
      </div>

      {/* Status ogłoszenia */}
      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Dodano: {new Date(listing.created_at).toLocaleDateString("pl-PL")}
        </p>
      </div>
    </div>
  );
}

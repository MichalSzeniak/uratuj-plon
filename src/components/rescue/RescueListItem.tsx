// src/components/rescue/RescueListItem.tsx
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RescueListItemProps {
  listing: any;
  isSelected: boolean;
  onSelect: (listing: any) => void;
}

export function RescueListItem({
  listing,
  isSelected,
  onSelect,
}: RescueListItemProps) {
  const isUrgent =
    listing.available_until &&
    new Date(listing.available_until) <
      new Date(Date.now() + 24 * 60 * 60 * 1000);

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
    <div
      className={cn(
        "p-4 cursor-pointer transition-colors border-l-4 hover:",
        isSelected
          ? "bg-blue-50 border-l-blue-500 border-l-4"
          : "border-l-transparent hover:border-l-gray-200"
      )}
      onClick={() => onSelect(listing)}
    >
      {/* Nagłówek */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-muted-foreground line-clamp-2 flex-1 pr-2">
          {listing.title}
        </h3>
        {isUrgent && (
          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <Badge variant="secondary" className="text-xs">
          {productTypeLabels[listing.product_type] || listing.product_type}
        </Badge>
        <Badge variant="destructive" className="text-xs">
          🚨 Ratunkowe
        </Badge>
        {isUrgent && (
          <Badge
            variant="default"
            className="text-xs bg-red-100 text-red-800 border-red-200"
          >
            Pilne
          </Badge>
        )}
      </div>

      {/* Informacje */}
      <div className="space-y-1 text-sm text-muted-foreground mb-2">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{listing.address}</span>
        </div>

        {listing.available_until && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>
              Do:{" "}
              {new Date(listing.available_until).toLocaleDateString("pl-PL")}
              {isUrgent && " 🚨"}
            </span>
          </div>
        )}

        {listing.estimated_amount && (
          <div>
            <span className="font-medium">Ilość: </span>
            {listing.estimated_amount} {listing.unit}
          </div>
        )}
      </div>

      {/* Powód ratunkowy (krótki) */}
      {listing.rescue_reason && (
        <p className="text-xs text-red-700 line-clamp-2 bg-red-50 px-2 py-1 rounded">
          {listing.rescue_reason}
        </p>
      )}
    </div>
  );
}

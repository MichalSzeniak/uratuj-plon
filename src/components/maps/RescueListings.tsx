import type { Farm } from "@/types/map";
import { Link } from "react-router-dom";

interface RescueListingsProps {
  farms: Farm[];
}

export function RescueListings({ farms }: RescueListingsProps) {
  const rescueListings = farms.flatMap(
    (farm) =>
      farm.listings
        ?.filter((listing) => listing.price_type === "rescue")
        .map((listing) => ({ ...listing, farm })) || []
  );

  if (rescueListings.length === 0) {
    return (
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <h3 className="font-semibold text-gray-900 mb-2">🚨 Akcje Ratunkowe</h3>
        <p className="text-sm text-gray-600">
          Brak aktualnych akcji ratunkowych
        </p>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm max-h-96 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-3">
        🚨 Akcje Ratunkowe ({rescueListings.length})
      </h3>

      <div className="space-y-3">
        {rescueListings.map((listing) => (
          <div
            key={listing.id}
            className="border border-red-200 rounded-lg p-3 bg-red-50"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900 text-sm">
                {listing.title}
              </h4>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {listing.price_per_unit
                  ? `${listing.price_per_unit} zł/${listing.unit}`
                  : "Za darmo"}
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {listing.description}
            </p>

            <div className="text-xs text-gray-500 space-y-1">
              <p>🏠 {listing.farm.name}</p>
              {listing.farm.address && <p>📍 {listing.farm.address}</p>}
              {listing.rescue_reason && (
                <p className="text-red-600 font-medium">
                  ⚠️ {listing.rescue_reason}
                </p>
              )}
            </div>

            <Link
              to={`/farm/${listing.farm.id}`}
              className="mt-2 w-full bg-red-500 text-white text-center py-2 px-3 rounded text-xs hover:bg-red-600 transition-colors block"
            >
              Ratuj plony!
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

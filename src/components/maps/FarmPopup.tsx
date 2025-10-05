import type { Farm } from "@/types/map";
import { Link } from "react-router-dom";

interface FarmPopupProps {
  farm: Farm;
  onSelect?: (farm: Farm) => void;
}

export function FarmPopup({ farm, onSelect }: FarmPopupProps) {
  const hasRescueListings = farm.listings?.some(
    (l) => l.price_type === "rescue"
  );
  const activeListings =
    farm.listings?.filter((l) => l.status === "active") || [];

  const handleSelect = () => {
    if (onSelect) {
      onSelect(farm);
    }
  };

  return (
    <div className="min-w-[250px] max-w-[300px]">
      {/* Nagłówek */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{farm.name}</h3>
          {farm.is_verified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✅ Zweryfikowane
            </span>
          )}
        </div>
      </div>

      {/* Zdjęcie (jeśli istnieje) */}
      {farm.images && farm.images.length > 0 && (
        <div className="mb-3">
          <img
            src={farm.images[0]}
            alt={farm.name}
            className="w-full h-24 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Informacje podstawowe */}
      <div className="space-y-2 mb-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {farm.description || "Brak opisu"}
        </p>

        {farm.address && (
          <p className="text-xs text-gray-500 flex items-center">
            📍 {farm.address}
          </p>
        )}

        {farm.contact_phone && (
          <p className="text-xs text-gray-500 flex items-center">
            📞 {farm.contact_phone}
          </p>
        )}
      </div>

      {/* Aktywne ogłoszenia */}
      {activeListings.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-1">
            Dostępne produkty:
          </h4>
          <div className="space-y-1">
            {activeListings.slice(0, 3).map((listing) => (
              <div
                key={listing.id}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-gray-600">{listing.title}</span>
                <span
                  className={`font-medium ${
                    listing.price_type === "rescue"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {listing.price_per_unit
                    ? `${listing.price_per_unit} zł/${listing.unit}`
                    : "Za darmo"}
                </span>
              </div>
            ))}
            {activeListings.length > 3 && (
              <p className="text-xs text-gray-500">
                +{activeListings.length - 3} więcej...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Znacznik akcji ratunkowej */}
      {hasRescueListings && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs font-medium text-red-800 text-center">
            🚨 Akcja ratunkowa dostępna!
          </p>
        </div>
      )}

      {/* Przyciski akcji */}
      <div className="flex space-x-2">
        <Link
          to={`/farm/${farm.id}`}
          className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded-lg text-sm hover:bg-green-600 transition-colors"
          onClick={handleSelect}
        >
          Zobacz szczegóły
        </Link>
      </div>

      {/* Rolnik */}
      {farm.profiles && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            {farm.profiles.avatar_url ? (
              <img
                src={farm.profiles.avatar_url}
                alt="Avatar"
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {farm.profiles.full_name?.charAt(0) ||
                    farm.profiles.username?.charAt(0) ||
                    "R"}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-600">
              {farm.profiles.full_name || farm.profiles.username}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "../ShareButton";
import { ContactModal } from "../listing/ContactModal";
import { MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";

interface FarmPopupProps {
  listing: any;
}

export function FarmPopup({ listing }: FarmPopupProps) {
  const navigate = useNavigate();

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleShowDetails = () => {
    if (listing) {
      navigate(`/listing/${listing.id}`);
    }
  };

  const hasContactInfo = listing.contact_phone || listing.contact_email;

  return (
    <div className="min-w-[280px] max-w-[320px]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 mr-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
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

        <div className="flex-shrink-0">
          <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
            {listing.price_per_unit
              ? `${listing.price_per_unit} zł/${listing.unit}`
              : "Za darmo"}
          </span>
        </div>
      </div>

      {listing.images && listing.images.length > 0 && (
        <div className="mb-3">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className={`w-full h-24 object-cover rounded-lg ${
              !imageLoaded ? "bg-gray-200 animate-pulse" : ""
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}

      <div className="mb-3">
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
          {listing.description || "Brak opisu"}
        </p>
        {listing.address && (
          <p className="text-xs text-gray-500 flex items-center">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{listing.address}</span>
          </p>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <Button
          onClick={handleShowDetails}
          className="flex-1 bg-green-600 hover:bg-green-700"
          size="sm"
        >
          <MapPin className="h-1 w-1 mr-0" />
          Szczegóły
        </Button>

        <Button
          onClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}`,
              "_blank"
            )
          }
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          <Navigation className="h-3 w-3 mr-1" />
          Nawiguj
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          disabled={!hasContactInfo}
          onClick={() => setContactModalOpen(true)}
        >
          <Phone className="h-3 w-3 mr-1" />
          Kontakt
        </Button>

        <ShareButton listing={listing} className="flex-1" />
      </div>

      {listing.price_type === "rescue" && (
        <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-2 my-0">
          <div className="text-xs text-red-700 text-center my-2">
            🚨 Akcja Ratunkowa
          </div>
        </div>
      )}

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        listing={listing}
        phoneNumber={listing.contact_phone}
        email={listing.contact_email}
      />
    </div>
  );
}
